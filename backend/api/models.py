from pydantic import BaseModel, Field
from typing import List, Optional

class CalculateRequest(BaseModel):
    r: Optional[List[float]] = Field(None, description="Position vector in km")
    v: Optional[List[float]] = Field(None, description="Velocity vector in km/s")
    a: Optional[float] = Field(None, description="Semi-major axis in km")
    e: Optional[float] = Field(None, description="Eccentricity")
    mu: float = Field(..., description="Gravitational parameter")

class CalculateResponse(BaseModel):
    results: dict
