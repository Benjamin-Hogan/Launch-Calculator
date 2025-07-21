from dataclasses import dataclass, field

@dataclass
class KnowledgeBase:
    values: dict = field(default_factory=dict)
    derivations: dict = field(default_factory=dict)

    def add(self, key, value, derivation="provided"):
        if key not in self.values:
            self.values[key] = value
            self.derivations[key] = derivation

    def has(self, key):
        return key in self.values

    def get(self, key, default=None):
        return self.values.get(key, default)

    def as_dict(self):
        return self.values
