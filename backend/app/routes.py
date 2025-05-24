from fastapi import APIRouter, UploadFile, File
from app.services.linting import analyze_code
from app.services.ai_review import ai_code_review

router = APIRouter()

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