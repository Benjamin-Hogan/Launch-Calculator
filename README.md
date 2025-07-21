# AstroCalc

AstroCalc is an extensible astrodynamics toolkit. A FastAPI backend exposes a calculation engine that infers as many orbital parameters as possible from any known values. A lightweight React frontend is bundled to interact with the API and display visualisations. The engine supports calculations such as inclination, node angles and periapsis/apoapsis distances.

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
Open `http://localhost:8000` in your browser for the web interface. It sends requests to `/calculate` under the hood. You can also send a POST request manually to `http://localhost:8000/calculate` with JSON body:
```json
{
  "r": [7000, 0, 0],
  "v": [0, 7.5, 1],
  "mu": 398600.4418
}
```
The response includes semi-major axis, eccentricity, period and more.

## Docker
You can build a single image that serves both the backend and frontend:
```bash
docker build -t astrocalc .
docker run -p 8000:8000 astrocalc
```
Then open `http://localhost:8000` to use the app.
