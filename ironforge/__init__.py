"""
IRONFORGE Core Package

Provides base constants, classes, and enumerations for the AI-powered
Military Decision Making Process (MDMP) engine.

Doctrine references:
- FM 6-0, Commander and Staff Organization and Operations
- JP 3-0, Joint Operations
- ADRP 5-0, The Operations Process
"""

from .constants import DOCTRINE_CITATIONS, PLANNING_FACTORS, DEFAULT_WEIGHTS
from .enums import (
    UnitType,
    Echelon,
    TerrainType,
    WeatherCondition,
    MissionType,
    ThreatCategory,
    COAStatus,
    MDMPStep,
)
from .base_classes import (
    Coordinate,
    Unit,
    TerrainFeature,
    WeatherState,
    ThreatModel,
    Scenario,
    DoctrineCitation,
)

__all__ = [
    "DOCTRINE_CITATIONS",
    "PLANNING_FACTORS",
    "DEFAULT_WEIGHTS",
    "UnitType",
    "Echelon",
    "TerrainType",
    "WeatherCondition",
    "MissionType",
    "ThreatCategory",
    "COAStatus",
    "MDMPStep",
    "Coordinate",
    "Unit",
    "TerrainFeature",
    "WeatherState",
    "ThreatModel",
    "Scenario",
    "DoctrineCitation",
]
