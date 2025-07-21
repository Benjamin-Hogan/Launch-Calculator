from fastapi import FastAPI
from .api import endpoints

app = FastAPI(title="AstroCalc")
app.include_router(endpoints.router)
