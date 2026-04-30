"""
High Payoff Target List

Per FM 3-60, para 2-15: HPTs are those targets whose loss to the enemy will most contribute
to the success of the friendly course of action.
"""

from typing import List
from fires.targeting import TargetNomination


class HighPayoffTargetList:
    """Manage the HPT list."""

    def __init__(self):
        self.targets: List[TargetNomination] = []

    def add(self, target: TargetNomination):
        if target.priority.upper() in ["HIGH PAYOFF TARGET", "HPT", "HIGH VALUE TARGET", "HVT"]:
            self.targets.append(target)

    def list_targets(self) -> List[TargetNomination]:
        return sorted(self.targets, key=lambda t: t.target_id)

    def clear(self):
        self.targets = []
