import subprocess
import tempfile
import sys

def analyze_code(code: str):
    with tempfile.NamedTemporaryFile(mode='w+', suffix='.py', delete=False, encoding="utf-8") as tmp:
        tmp.write(code)
        tmp.flush()
        result = subprocess.run([sys.executable, "-m", "pylint", tmp.name], capture_output=True, text=True)
        return result.stdout 