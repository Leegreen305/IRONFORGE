"""
Assets Package — Unit Capability Modeling

Doctrine sources:
- FM 6-0, Appendix B (Unit Types and Symbols)
- FM 3-09 (Field Artillery planning factors)
- FM 3-04 (Army Aviation)
- FM 3-12 (Cyberspace and Electronic Warfare Operations)
- JP 3-0 (Joint force capabilities)
"""

from .unit_models import UnitCapability, GroundManeuverUnit, AviationUnit, FiresUnit, CyberUnit, EWUnit, LogisticsUnit
from .capability_library import CapabilityLibrary
from .ground import (
    GroundManeuverCapability,
    INFANTRY_BATTALION,
    ARMOR_BATTALION,
    CAVALRY_SQUADRON,
    get_capability as get_ground_capability,
)
from .aviation import (
    AviationCapability,
    AH64E_APACHE,
    UH60M_BLACKHAWK,
    MQ1C_GRAY_EAGLE,
    get_aviation_capability,
)
from .fires import (
    FiresCapability,
    M109A7_PALADIN,
    M270_MLRS,
    M777A2_HOWITZER,
    get_fires_capability,
    estimate_fires_requirements,
)
from .cyber import (
    CyberCapability,
    EWCapability,
    CyberEffectType,
    EWOperationType,
    OFFENSIVE_CYBER_OPERATIONS,
    DEFENSIVE_CYBER_OPERATIONS,
    AN_MLQ44_PROPHET,
    AN_TLQ17_TRAFFIC_JAM,
    get_cyber_capability,
    get_ew_capability,
    cyber_effect_matrix,
)

__all__ = [
    # Legacy models
    "UnitCapability",
    "GroundManeuverUnit",
    "AviationUnit",
    "FiresUnit",
    "CyberUnit",
    "EWUnit",
    "LogisticsUnit",
    "CapabilityLibrary",
    # Ground
    "GroundManeuverCapability",
    "INFANTRY_BATTALION",
    "ARMOR_BATTALION",
    "CAVALRY_SQUADRON",
    "get_ground_capability",
    # Aviation
    "AviationCapability",
    "AH64E_APACHE",
    "UH60M_BLACKHAWK",
    "MQ1C_GRAY_EAGLE",
    "get_aviation_capability",
    # Fires
    "FiresCapability",
    "M109A7_PALADIN",
    "M270_MLRS",
    "M777A2_HOWITZER",
    "get_fires_capability",
    "estimate_fires_requirements",
    # Cyber / EW
    "CyberCapability",
    "EWCapability",
    "CyberEffectType",
    "EWOperationType",
    "OFFENSIVE_CYBER_OPERATIONS",
    "DEFENSIVE_CYBER_OPERATIONS",
    "AN_MLQ44_PROPHET",
    "AN_TLQ17_TRAFFIC_JAM",
    "get_cyber_capability",
    "get_ew_capability",
    "cyber_effect_matrix",
]
