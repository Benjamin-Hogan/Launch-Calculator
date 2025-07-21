from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from .api import endpoints

app = FastAPI(title="AstroCalc")
app.include_router(endpoints.router)

frontend_dir = Path(__file__).resolve().parent.parent / "frontend"
if frontend_dir.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")

