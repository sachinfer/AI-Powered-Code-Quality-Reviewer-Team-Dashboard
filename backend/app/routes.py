from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.services.linting import analyze_code
from app.services.ai_review import ai_code_review
from app.models import User, CodeReview, Team
from app.main import AsyncSessionLocal
from sqlalchemy.future import select
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

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
async def create_user(github_id: str, name: str, email: str, avatar_url: str, db: AsyncSession = Depends(get_db)):
    user = User(github_id=github_id, name=name, email=email, avatar_url=avatar_url)
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
async def create_team(name: str, db: AsyncSession = Depends(get_db)):
    team = Team(name=name)
    db.add(team)
    await db.commit()
    await db.refresh(team)
    return team

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