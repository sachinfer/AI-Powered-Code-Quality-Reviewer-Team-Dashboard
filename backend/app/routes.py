from fastapi import APIRouter, UploadFile, File
from app.services.linting import analyze_code

router = APIRouter()

@router.post("/analyze/")
async def analyze_code_file(file: UploadFile = File(...)):
    content = await file.read()
    results = analyze_code(content.decode())
    return {"analysis": results} 