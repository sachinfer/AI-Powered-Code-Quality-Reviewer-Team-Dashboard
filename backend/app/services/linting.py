import subprocess
import tempfile
import sys

def analyze_code(code: str):
    with tempfile.NamedTemporaryFile(mode='w+', suffix='.py', delete=False, encoding="utf-8") as tmp:
        tmp.write(code)
        tmp.flush()
        pylint_result = subprocess.run([sys.executable, "-m", "pylint", tmp.name], capture_output=True, text=True)
        bandit_result = subprocess.run([sys.executable, "-m", "bandit", "-r", tmp.name, "-f", "txt"], capture_output=True, text=True)
        black_result = subprocess.run([sys.executable, "-m", "black", "--check", tmp.name], capture_output=True, text=True)
        return {
            "pylint": pylint_result.stdout,
            "bandit": bandit_result.stdout,
            "black": black_result.stdout,
        } 