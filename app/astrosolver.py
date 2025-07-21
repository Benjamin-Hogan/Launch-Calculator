import numpy as np
from dataclasses import dataclass, field
from math import pi, sqrt

@dataclass
class KnowledgeBase:
    data: dict = field(default_factory=dict)
    derivations: dict = field(default_factory=dict)

    def add(self, key, value, derivation="provided"):
        if key not in self.data:
            self.data[key] = value
            self.derivations[key] = derivation

    def has(self, key):
        return key in self.data

    def get(self, key, default=None):
        return self.data.get(key, default)

    def explain(self):
        lines = []
        for k, v in self.data.items():
            deriv = self.derivations.get(k, "")
            lines.append(f"{k}: {v} ({deriv})")
        return "\n".join(lines)

class Calculation:
    def __init__(self, required, outputs, func):
        self.required = required
        self.outputs = outputs
        self.func = func

    def can_run(self, kb):
        return all(kb.has(r) for r in self.required)

    def run(self, kb):
        results = self.func(*[kb.get(r) for r in self.required])
        if len(self.outputs) == 1:
            results = (results,)
        for out, res in zip(self.outputs, results):
            kb.add(out, res, f"from {', '.join(self.required)} via {self.func.__name__}")

class AstroSolver:
    def __init__(self, mu=398600.4418):
        self.mu = mu
        self.calculations = []
        self._build_calculations()

    def add_calculation(self, required, outputs, func):
        self.calculations.append(Calculation(required, outputs, func))

    def _build_calculations(self):
        self.add_calculation(['r'], ['r_mag'], lambda r: np.linalg.norm(r))
        self.add_calculation(['v'], ['v_mag'], lambda v: np.linalg.norm(v))
        self.add_calculation(['r', 'v'], ['h_vec'], lambda r, v: np.cross(r, v))
        self.add_calculation(['h_vec'], ['h_mag'], lambda h: np.linalg.norm(h))
        self.add_calculation(['v_mag', 'r_mag'], ['specific_energy'],
                             lambda v_mag, r_mag: v_mag ** 2 / 2 - self.mu / r_mag)
        self.add_calculation(['specific_energy'], ['semi_major_axis'],
                             lambda energy: -self.mu / (2 * energy))
        self.add_calculation(['r', 'v'], ['eccentricity_vec'],
                             lambda r, v: np.cross(v, np.cross(r, v)) / self.mu - r / np.linalg.norm(r))
        self.add_calculation(['eccentricity_vec'], ['eccentricity'],
                             lambda e_vec: np.linalg.norm(e_vec))
        self.add_calculation(['eccentricity'], ['orbit_type'], self.classify_orbit)
        self.add_calculation(['semi_major_axis'], ['period'],
                             lambda a: 2 * pi * sqrt(a ** 3 / self.mu) if a > 0 else None)

    def classify_orbit(self, e):
        if e < 1:
            return 'elliptical'
        elif np.isclose(e, 1.0):
            return 'parabolic'
        else:
            return 'hyperbolic'

    def solve(self, **knowns):
        kb = KnowledgeBase()
        for k, v in knowns.items():
            kb.add(k, v)
        progress = True
        while progress:
            progress = False
            for calc in self.calculations:
                if calc.can_run(kb) and not all(kb.has(o) for o in calc.outputs):
                    calc.run(kb)
                    progress = True
        return kb
