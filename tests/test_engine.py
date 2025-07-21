import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import numpy as np
from backend.engine.engine import AstroCalc
from backend.engine.constants import EARTH_MU


def test_basic_solve():
    solver = AstroCalc()
    kb = solver.solve(r=np.array([7000, 0, 0]), v=np.array([0, 7.5, 1]), mu=EARTH_MU)
    values = kb.as_dict()
    assert "semi_major_axis" in values
    assert values["orbit_type"] == "elliptical"
