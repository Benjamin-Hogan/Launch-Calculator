from .knowledge import KnowledgeBase
from . import formulas, constants


class Calculation:
    def __init__(self, required, outputs, func):
        self.required = required
        self.outputs = outputs
        self.func = func

    def can_run(self, kb: KnowledgeBase):
        return all(kb.has(r) for r in self.required)

    def run(self, kb: KnowledgeBase):
        args = [kb.get(r) for r in self.required]
        results = self.func(*args)
        if len(self.outputs) == 1:
            results = (results,)
        for name, value in zip(self.outputs, results):
            kb.add(name, value, f"{self.func.__name__} from {', '.join(self.required)}")


class AstroCalc:
    def __init__(self, mu: float = constants.EARTH_MU):
        self.mu = mu
        self.calculations: list[Calculation] = []
        self._register_defaults()

    def add(self, required, outputs, func):
        self.calculations.append(Calculation(required, outputs, func))

    def _register_defaults(self):
        self.add(["r"], ["r_mag"], formulas.r_mag)
        self.add(["v"], ["v_mag"], formulas.v_mag)
        self.add(["r", "v"], ["h_vec"], formulas.h_vec)
        self.add(["h_vec"], ["h_mag"], formulas.h_mag)
        self.add(["v_mag", "r_mag", "mu"], ["specific_energy"], formulas.specific_energy)
        self.add(["specific_energy", "mu"], ["semi_major_axis"], formulas.semi_major_axis)
        self.add(["r", "v", "mu"], ["eccentricity_vec"], formulas.eccentricity_vec)
        self.add(["eccentricity_vec"], ["eccentricity"], formulas.eccentricity)
        self.add(["eccentricity"], ["orbit_type"], formulas.orbit_type)
        self.add(["semi_major_axis", "mu"], ["period"], formulas.period)

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
