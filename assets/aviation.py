"""
Aviation Asset Capability Models

Doctrinal planning factors sourced from:
- FM 3-04, Army Aviation
- FM 3-04.126, Attack Reconnaissance Helicopter Operations
- ATP 3-04.1, Aviation Reconnaissance and Security Operations
- FM 6-0, Commander and Staff Organization and Operations, Appendix B
"""

from typing import List, Optional
from pydantic import BaseModel, Field

from ironforge.base_classes import DoctrineCitation
from ironforge.constants import PLANNING_FACTORS, DOCTRINE_CITATIONS


class AviationPerformanceData(BaseModel):
    """Aviation platform performance specifications per FM 3-04."""
    cruise_speed_knots: float
    max_range_nm: float
    endurance_hrs: float
    service_ceiling_ft: int
    hover_ceiling_ige_ft: int
    fuel_consumption_gal_per_hr: float


class AviationWeaponsData(BaseModel):
    """Organic and attached weapons systems."""
    primary_weapon: str
    secondary_weapon: Optional[str] = None
    max_effective_range_km: float
    anti_armor_capability: Optional[str] = None
    standoff_engagement_km: Optional[float] = None


class AviationCapability(BaseModel):
    """
    Doctrinal capability model for an aviation platform.
    Planning factors per FM 3-04 and unit-level ATP references.
    """
    platform: str
    designation: str
    role: str
    crew: int
    performance: AviationPerformanceData
    weapons: Optional[AviationWeaponsData] = None
    mission_profiles: List[str]
    planning_considerations: List[str]
    limitations: List[str]
    citations: List[DoctrineCitation]


# ── AH-64E Apache Guardian (Attack Helicopter) ─────────────────────────────

AH64E_APACHE: AviationCapability = AviationCapability(
    platform="AH-64E Apache Guardian",
    designation="AH-64E",
    role="Attack Reconnaissance",
    crew=2,
    performance=AviationPerformanceData(
        cruise_speed_knots=PLANNING_FACTORS["movement_rates"]["helicopter_cruise_knots"],
        max_range_nm=257,
        endurance_hrs=3.0,
        service_ceiling_ft=21000,
        hover_ceiling_ige_ft=15895,
        fuel_consumption_gal_per_hr=PLANNING_FACTORS["fuel_consumption"]["helicopter_gal_per_hour"],
    ),
    weapons=AviationWeaponsData(
        primary_weapon="AGM-114 Hellfire II ATGM",
        secondary_weapon="70mm Hydra-70 unguided rockets; M230 30mm chain gun",
        max_effective_range_km=8.0,
        anti_armor_capability="AGM-114K HEAT; AGM-114L Longbow radar-guided",
        standoff_engagement_km=6.0,
    ),
    mission_profiles=[
        "Armed reconnaissance",
        "Attack",
        "Close combat attack (CCA)",
        "Security (screen, guard)",
        "Escort",
        "High value target defeat",
        "Anti-armor",
    ],
    planning_considerations=[
        "Requires forward arming and refueling point (FARP) within operational range",
        "Acoustic and thermal signature requires terrain masking and noise discipline",
        "Degraded capability in IMC/low-visibility without NVG/FLIR",
        "Target handoff via manned-unmanned teaming (MUM-T) with Gray Eagle",
        "Coordinate airspace deconfliction with fixed-wing and UAS",
    ],
    limitations=[
        "Limited endurance requires FARP planning",
        "Vulnerable to MANPADS and medium-caliber AAA",
        "Rotor wash compromises concealment in hover",
        "Dust brownout degrades low-level operations in arid environments",
    ],
    citations=[
        DoctrineCitation(
            pub="FM 3-04.126",
            paragraph="2-1",
            title="Attack Reconnaissance Helicopter Operations",
            url=None,
        ),
        DoctrineCitation(
            pub="FM 3-04",
            paragraph="1-1",
            title="Army Aviation",
            url=None,
        ),
    ],
)

# ── UH-60M Black Hawk (Utility Helicopter) ─────────────────────────────────

UH60M_BLACKHAWK: AviationCapability = AviationCapability(
    platform="UH-60M Black Hawk",
    designation="UH-60M",
    role="Utility / Air Assault",
    crew=2,
    performance=AviationPerformanceData(
        cruise_speed_knots=145,
        max_range_nm=320,
        endurance_hrs=3.0,
        service_ceiling_ft=19000,
        hover_ceiling_ige_ft=10000,
        fuel_consumption_gal_per_hr=185,
    ),
    weapons=AviationWeaponsData(
        primary_weapon="M134 7.62mm minigun (door gun, optional)",
        max_effective_range_km=1.0,
        anti_armor_capability=None,
    ),
    mission_profiles=[
        "Air assault",
        "Air movement of troops and equipment",
        "Medical evacuation (MEDEVAC)",
        "Command and control",
        "Resupply (internal and external load)",
        "Personnel recovery / CSAR",
        "Special operations support",
    ],
    planning_considerations=[
        "Lift capacity: 11 combat-equipped soldiers or 2,600 lbs internal",
        "External load: 8,000 lbs sling load",
        "Pickup zone (PZ) / Landing zone (LZ) requires minimum 100m x 100m clear area",
        "Altitude and temperature (density altitude) significantly affect lift capacity",
    ],
    limitations=[
        "Not optimized for contested airspace without SEAD",
        "External loads reduce cruise speed to approximately 100 knots",
        "Requires PZ/LZ preparation or pathfinder support in degraded environments",
    ],
    citations=[
        DoctrineCitation(
            pub="ATP 3-04.1",
            paragraph="2-1",
            title="Aviation Reconnaissance and Security Operations",
            url=None,
        ),
        DoctrineCitation(
            pub="FM 3-04",
            paragraph="3-1",
            title="Army Aviation",
            url=None,
        ),
    ],
)

# ── MQ-1C Gray Eagle (UAS) ─────────────────────────────────────────────────

MQ1C_GRAY_EAGLE: AviationCapability = AviationCapability(
    platform="MQ-1C Gray Eagle Extended Range (GEER)",
    designation="MQ-1C",
    role="UAS — ISR / Strike",
    crew=0,
    performance=AviationPerformanceData(
        cruise_speed_knots=130,
        max_range_nm=4000,
        endurance_hrs=28.0,
        service_ceiling_ft=29000,
        hover_ceiling_ige_ft=0,
        fuel_consumption_gal_per_hr=25,
    ),
    weapons=AviationWeaponsData(
        primary_weapon="AGM-114 Hellfire (up to 4 per sortie)",
        max_effective_range_km=8.0,
        anti_armor_capability="AGM-114K HEAT",
        standoff_engagement_km=5.0,
    ),
    mission_profiles=[
        "Persistent ISR / reconnaissance",
        "Manned-unmanned teaming (MUM-T) with AH-64E",
        "Armed overwatch",
        "Time sensitive targeting (TST)",
        "Battle damage assessment (BDA)",
        "Signals intelligence (SIGINT) collection",
        "Communications relay",
    ],
    planning_considerations=[
        "Requires ground control station (GCS) and satellite data link",
        "LOS and BLOS control modes require frequency deconfliction",
        "MUM-T enables 72 km sensor-to-shooter link with AH-64E crew",
        "Persistent coverage (28 hrs) enables dynamic targeting without FARP",
        "Requires airspace deconfliction in non-segregated airspace",
    ],
    limitations=[
        "Vulnerable to GPS jamming and electronic warfare",
        "Requires SA-CAAS spectrum management coordination",
        "Data link interruption can result in lost link procedures",
        "Limited self-defense capability",
    ],
    citations=[
        DoctrineCitation(
            pub="FM 3-04",
            paragraph="4-1",
            title="Army Aviation — UAS Integration",
            url=None,
        ),
        DoctrineCitation(
            pub="TRADOC Pam 525-3-1",
            paragraph="B-2",
            title="The U.S. Army in Multi-Domain Operations",
            url=DOCTRINE_CITATIONS["TRADOC_P525_3_1"]["url"],
        ),
    ],
)


AVIATION_LIBRARY = {
    "AH-64E": AH64E_APACHE,
    "UH-60M": UH60M_BLACKHAWK,
    "MQ-1C":  MQ1C_GRAY_EAGLE,
}


def get_aviation_capability(designation: str) -> Optional[AviationCapability]:
    """Return doctrinal capability model for an aviation platform by designation."""
    return AVIATION_LIBRARY.get(designation)
