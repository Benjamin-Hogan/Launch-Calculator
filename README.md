# AstroCalc

AstroCalc is an extensible astrodynamics toolkit. A FastAPI backend exposes a calculation engine that infers as many orbital parameters as possible from any known values. A React frontend can consume the API to provide an interactive interface (frontend not included here). The engine now supports additional calculations including node angles, inclination and periapsis/apoapsis distances.

## Features
- Dependency-aware calculation engine
- Vector based computations using NumPy
- `/calculate` endpoint that accepts position/velocity vectors or orbital elements along with gravitational parameter
- Returns a dictionary of all derived values including inclination, node angles, periapsis and apoapsis distances

## Quick Start
```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload
```
Send a POST request to `http://localhost:8000/calculate` with JSON body:
```json
{
  "r": [7000, 0, 0],
  "v": [0, 7.5, 1],
  "mu": 398600.4418
}
```
The response includes semi-major axis, eccentricity, period and more.
