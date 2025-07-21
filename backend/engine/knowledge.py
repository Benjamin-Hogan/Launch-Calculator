from dataclasses import dataclass, field
from typing import Any, Dict
import numpy as np

@dataclass
class KnowledgeBase:
    values: Dict[str, Any] = field(default_factory=dict)
    derivations: Dict[str, str] = field(default_factory=dict)

    def add(self, key, value, derivation="provided"):
        if key not in self.values:
            self.values[key] = value
            self.derivations[key] = derivation

    def has(self, key):
        return key in self.values

    def get(self, key, default=None):
        return self.values.get(key, default)

    def as_dict(self):
        def convert(val):
            if isinstance(val, np.ndarray):
                return val.tolist()
            if isinstance(val, np.generic):
                return val.item()
            return val

        return {k: convert(v) for k, v in self.values.items()}
