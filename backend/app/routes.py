from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Body
from app.services.linting import analyze_code
from app.services.ai_review import ai_code_review
from app.models import User, CodeReview, Team, Base, TeamCreate
from app.db import AsyncSessionLocal
from sqlalchemy.future import select
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from sqlalchemy import insert
import bcrypt

router = APIRouter()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@router.post("/analyze/")
async def analyze_code_file(file: UploadFile = File(...)):
    content = await file.read()
    results = analyze_code(content.decode())
    return {
        "pylint": results["pylint"],
        "bandit": results["bandit"],
        "black": results["black"],
    }

@router.post("/ai-review/")
async def ai_review_code(file: UploadFile = File(...), language: str = "python"):
    content = await file.read()
    ai_feedback = ai_code_review(content.decode(), language)
    return {"ai_feedback": ai_feedback}

@router.post("/users/")
async def create_user(github_id: str, name: str, email: str, avatar_url: str, team_id: int = None, db: AsyncSession = Depends(get_db)):
    user = User(github_id=github_id, name=name, email=email, avatar_url=avatar_url, team_id=team_id)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.get("/users/{user_id}")
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/users/by-email/{email}")
async def get_user_by_email(email: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/reviews/")
async def create_review(user_id: int, code: str, language: str, pylint: str, bandit: str, black: str, ai_feedback: str, db: AsyncSession = Depends(get_db)):
    review = CodeReview(user_id=user_id, code=code, language=language, pylint=pylint, bandit=bandit, black=black, ai_feedback=ai_feedback)
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review

@router.get("/reviews/{user_id}", response_model=List[dict])
async def get_reviews(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CodeReview).where(CodeReview.user_id == user_id))
    reviews = result.scalars().all()
    return [
        {
            "id": r.id,
            "code": r.code,
            "language": r.language,
            "pylint": r.pylint,
            "bandit": r.bandit,
            "black": r.black,
            "ai_feedback": r.ai_feedback,
            "created_at": r.created_at,
        }
        for r in reviews
    ]

@router.post("/teams/")
async def create_team(team: TeamCreate, db: AsyncSession = Depends(get_db)):
    team_obj = Team(name=team.name)
    db.add(team_obj)
    await db.commit()
    await db.refresh(team_obj)
    return team_obj

@router.get("/teams/{team_id}")
async def get_team(team_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Team).where(Team.id == team_id))
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

@router.get("/teams/")
async def list_teams(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Team))
    teams = result.scalars().all()
    return teams

@router.get("/teams/{team_id}/members")
async def get_team_members(team_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.team_id == team_id))
    members = result.scalars().all()
    return members

@router.get("/teams/{team_id}/reviews")
async def get_team_reviews(team_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.team_id == team_id))
    users = result.scalars().all()
    user_ids = [u.id for u in users]
    if not user_ids:
        return []
    result = await db.execute(select(CodeReview).where(CodeReview.user_id.in_(user_ids)))
    reviews = result.scalars().all()
    return [
        {
            "id": r.id,
            "user_id": r.user_id,
            "code": r.code,
            "language": r.language,
            "pylint": r.pylint,
            "bandit": r.bandit,
            "black": r.black,
            "ai_feedback": r.ai_feedback,
            "created_at": r.created_at,
        }
        for r in reviews
    ]

@router.post("/demo/populate/")
async def populate_demo_data(db: AsyncSession = Depends(get_db)):
    # Create teams
    team1 = Team(name="Backend Team")
    team2 = Team(name="Frontend Team")
    db.add_all([team1, team2])
    await db.flush()
    # Create users
    user1 = User(github_id="1001", name="Alice", email="alice@example.com", avatar_url="https://randomuser.me/api/portraits/women/1.jpg", team=team1)
    user2 = User(github_id="1002", name="Bob", email="bob@example.com", avatar_url="https://randomuser.me/api/portraits/men/2.jpg", team=team1)
    user3 = User(github_id="1003", name="Carol", email="carol@example.com", avatar_url="https://randomuser.me/api/portraits/women/3.jpg", team=team2)
    db.add_all([user1, user2, user3])
    await db.flush()
    # Create code reviews
    review1 = CodeReview(user=user1, code="print('Hello')", language="python", pylint="Your code has been rated at 8.50/10", bandit="No issues identified.", black="would not reformat", ai_feedback="Looks good!")
    review2 = CodeReview(user=user2, code="x = 1\ny = 2\nprint(x + y)", language="python", pylint="Your code has been rated at 7.00/10", bandit="No issues identified.", black="would reformat", ai_feedback="Consider using f-strings.")
    review3 = CodeReview(user=user3, code="console.log('Hi')", language="javascript", pylint="N/A", bandit="N/A", black="N/A", ai_feedback="Use let/const instead of var.")
    db.add_all([review1, review2, review3])
    await db.commit()
    return {"status": "Demo data populated"}

@router.post("/manual/register")
async def manual_register(name: str = Body(...), email: str = Body(...), password: str = Body(...), team_id: int = Body(None), db: AsyncSession = Depends(get_db)):
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user = User(name=name, email=email, hashed_password=hashed_password, team_id=team_id)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"status": "registered"}

@router.post("/manual/login")
async def manual_login(email: str = Body(...), password: str = Body(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user or not user.hashed_password or not bcrypt.checkpw(password.encode(), user.hashed_password.encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"status": "logged_in", "user_id": user.id, "name": user.name, "email": user.email, "team_id": user.team_id} 