from fastapi import APIRouter
import numpy as np
from .models import CalculateRequest, CalculateResponse
from ..engine import engine, constants

router = APIRouter()
solver = engine.AstroCalc()

@router.post("/calculate", response_model=CalculateResponse)
def calculate(req: CalculateRequest):
    knowns = {"mu": req.mu}
    if req.r is not None:
        knowns["r"] = np.array(req.r)
    if req.v is not None:
        knowns["v"] = np.array(req.v)
    kb = solver.solve(**knowns)
    return {"results": kb.as_dict()}
