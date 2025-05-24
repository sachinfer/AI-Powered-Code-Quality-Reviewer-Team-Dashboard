# Placeholder for AI-based feedback with CodeBERT 

import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def ai_code_review(code: str, language: str = "python"):
    prompt = f"""
You are an expert code reviewer. Analyze the following {language} code and provide:
- A summary of code quality
- Security risks
- Best practices
- Missing docstrings/comments
- Suggestions for refactoring
- Auto-generate docstrings for any undocumented functions

Code:
{code}
"""
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600,
        temperature=0.2,
    )
    return response.choices[0].message["content"] 