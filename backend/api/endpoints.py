from fastapi import APIRouter
import numpy as np
from .models import CalculateRequest, CalculateResponse, HohmannRequest, HohmannResponse
from ..engine import engine, constants, formulas

router = APIRouter()
solver = engine.AstroCalc()

@router.post("/calculate", response_model=CalculateResponse)
def calculate(req: CalculateRequest):
    knowns = {"mu": req.mu}
    if req.r is not None:
        knowns["r"] = np.array(req.r)
    if req.v is not None:
        knowns["v"] = np.array(req.v)
    if req.a is not None:
        knowns["semi_major_axis"] = req.a
    if req.e is not None:
        knowns["eccentricity"] = req.e
    kb = solver.solve(**knowns)
    return {"results": kb.as_dict()}


@router.post("/hohmann", response_model=HohmannResponse)
def hohmann(req: HohmannRequest):
    dv1, dv2, total, tof = formulas.hohmann_delta_v(req.r1, req.r2, req.mu)
    return {
        "delta_v1": dv1,
        "delta_v2": dv2,
        "total_delta_v": total,
        "transfer_time": tof,
    }
