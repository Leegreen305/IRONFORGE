"""
Fires Package — Fire Support and Targeting Integration

Doctrine sources:
- FM 3-09, Fire Support and Field Artillery Operations
- FM 3-60, The Targeting Process
- JP 3-60, Joint Targeting
"""

from .targeting import TargetingEngine, TargetNomination
from .hptl import HighPayoffTargetList
from .fscm import FireSupportCoordinationMeasures

__all__ = [
    "TargetingEngine",
    "TargetNomination",
    "HighPayoffTargetList",
    "FireSupportCoordinationMeasures",
]
