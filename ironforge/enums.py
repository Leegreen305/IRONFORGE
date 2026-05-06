"""
Enumerations for IRONFORGE

Doctrine sources:
- FM 6-0, Commander and Staff Organization and Operations
- JP 3-0, Joint Operations
- FM 2-01.3, Intelligence Preparation of the Battlefield
"""

from enum import Enum


class UnitType(str, Enum):
    """Doctrinal unit types per FM 6-0 Table B-1."""
    INFANTRY = "INFANTRY"
    ARMOR = "ARMOR"
    CAVALRY = "CAVALRY"
    ARTILLERY = "ARTILLERY"
    AIR_DEFENSE = "AIR_DEFENSE"
    ENGINEER = "ENGINEER"
    SIGNAL = "SIGNAL"
    MILITARY_POLICE = "MILITARY_POLICE"
    CHEMICAL = "CHEMICAL"
    TRANSPORTATION = "TRANSPORTATION"
    QUARTERMASTER = "QUARTERMASTER"
    ORDNANCE = "ORDNANCE"
    MEDICAL = "MEDICAL"
    AVIATION = "AVIATION"
    CYBER = "CYBER"
    ELECTRONIC_WARFARE = "ELECTRONIC_WARFARE"
    SPECIAL_OPERATIONS = "SPECIAL_OPERATIONS"


class Echelon(str, Enum):
    """Doctrinal echelons per JP 3-0."""
    SQUAD = "SQUAD"
    PLATOON = "PLATOON"
    COMPANY = "COMPANY"
    BATTALION = "BATTALION"
    BRIGADE = "BRIGADE"
    DIVISION = "DIVISION"
    CORPS = "CORPS"
    ARMY = "ARMY"
    JTF = "JTF"


class TerrainType(str, Enum):
    """Terrain categories per FM 2-01.3."""
    OPEN = "OPEN"
    RESTRICTED = "RESTRICTED"
    SEVERELY_RESTRICTED = "SEVERELY_RESTRICTED"
    URBAN = "URBAN"
    FOREST = "FOREST"
    DESERT = "DESERT"
    MOUNTAIN = "MOUNTAIN"
    MARITIME = "MARITIME"
    RIVERINE = "RIVERINE"


class WeatherCondition(str, Enum):
    """Weather effects categories per FM 2-01.3 Appendix B."""
    CLEAR = "CLEAR"
    PARTLY_CLOUDY = "PARTLY_CLOUDY"
    OVERCAST = "OVERCAST"
    RAIN = "RAIN"
    SNOW = "SNOW"
    FOG = "FOG"
    DUST = "DUST"
    HIGH_WIND = "HIGH_WIND"
    EXTREME_HEAT = "EXTREME_HEAT"
    EXTREME_COLD = "EXTREME_COLD"


class MissionType(str, Enum):
    """Doctrinal mission types per ADRP 5-0."""
    OFFENSE = "OFFENSE"
    DEFENSE = "DEFENSE"
    STABILITY = "STABILITY"
    DEFENSE_SUPPORT_OF_CIVIL_AUTHORITIES = "DEFENSE_SUPPORT_OF_CIVIL_AUTHORITIES"
    HUMANITARIAN_ASSISTANCE = "HUMANITARIAN_ASSISTANCE"
    PEACEKEEPING = "PEACEKEEPING"
    COUNTER_INSURGENCY = "COUNTER_INSURGENCY"
    TARGETING = "TARGETING"


class ThreatCategory(str, Enum):
    """Threat categories per FM 2-01.3."""
    IRREGULAR = "IRREGULAR"
    TRADITIONAL = "TRADITIONAL"
    CATASTROPHIC = "CATASTROPHIC"
    DISRUPTIVE = "DISRUPTIVE"
    HYBRID = "HYBRID"
    PEER_NEAR_PEER = "PEER_NEAR_PEER"


class COAStatus(str, Enum):
    """Status of a Course of Action in the MDMP pipeline."""
    DRAFT = "DRAFT"
    ANALYZED = "ANALYZED"
    WARGAMED = "WARGAMED"
    COMPARED = "COMPARED"
    RECOMMENDED = "RECOMMENDED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class MDMPStep(str, Enum):
    """The seven steps of MDMP per FM 6-0, Chapter 9."""
    RECEIPT_OF_MISSION = "RECEIPT_OF_MISSION"
    MISSION_ANALYSIS = "MISSION_ANALYSIS"
    COA_DEVELOPMENT = "COA_DEVELOPMENT"
    COA_ANALYSIS = "COA_ANALYSIS"
    COA_COMPARISON = "COA_COMPARISON"
    COA_APPROVAL = "COA_APPROVAL"
    ORDERS_PRODUCTION = "ORDERS_PRODUCTION"
