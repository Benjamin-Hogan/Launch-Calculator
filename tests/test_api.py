import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_calculate_vectors():
    payload = {"r": [7000, 0, 0], "v": [0, 7.5, 1], "mu": 398600.4418}
    response = client.post("/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()["results"]
    assert "semi_major_axis" in data
    assert isinstance(data["h_vec"], list)


def test_calculate_elements():
    payload = {"a": 7000, "e": 0.1, "mu": 398600.4418}
    response = client.post("/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()["results"]
    assert "periapsis" in data
    assert "apoapsis" in data
