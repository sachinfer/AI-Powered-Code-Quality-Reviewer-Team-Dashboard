# AI Code Reviewer

A full-stack platform for automated code review using static analysis and AI.

## Project Structure

```
ai-code-reviewer/
├── backend/         # FastAPI backend
├── frontend/        # Next.js + Tailwind frontend
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Quick Start

1. **Backend**
   - `cd backend`
   - `pip install -r requirements.txt`
   - `python -m uvicorn app.main:app --reload`

2. **Frontend**
   - `cd frontend`
   - `npm install`
   - `npm run dev`

3. **Dev (Docker Compose)**
   - `docker-compose up --build`

## Features
- Code upload & review
- Static analysis (pylint, bandit)
- AI feedback (CodeBERT, coming soon)
- Modern UI (Next.js + Tailwind) 