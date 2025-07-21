import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import numpy as np
from pytest import approx
from backend.engine.engine import AstroCalc
from backend.engine.constants import EARTH_MU, EARTH_RADIUS
from backend.engine import formulas


def test_basic_solve():
    solver = AstroCalc()
    kb = solver.solve(r=np.array([7000, 0, 0]), v=np.array([0, 7.5, 1]), mu=EARTH_MU)
    values = kb.as_dict()
    assert "semi_major_axis" in values
    assert values["orbit_type"] == "elliptical"
    assert "mean_motion" in values
    assert "periapsis" in values
    assert "apoapsis" in values
    assert "inclination" in values


def test_with_elements():
    solver = AstroCalc()
    kb = solver.solve(semi_major_axis=7000, eccentricity=0.01, mu=EARTH_MU)
    values = kb.as_dict()
    assert values["periapsis"] == approx(6930.0, abs=1.0)


def test_constants_exposed():
    assert EARTH_RADIUS > 6000


def test_hohmann_formula():
    dv1, dv2, total, tof = formulas.hohmann_delta_v(7000, 10000, EARTH_MU)
    assert dv1 > 0
    assert dv2 > 0
    assert total > abs(dv1)
    assert tof > 0
