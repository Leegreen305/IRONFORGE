"""
Fires Asset Capability Models

Doctrinal planning factors sourced from:
- FM 3-09, Fire Support and Field Artillery Operations (April 2023)
- FM 3-60, The Targeting Process (November 2023)
- ATP 3-09.23, Field Artillery Cannon Battalion
- ATP 3-09.50, The Field Artillery Cannon Battery
"""

from typing import List, Optional
from pydantic import BaseModel, Field

from ironforge.base_classes import DoctrineCitation
from ironforge.constants import PLANNING_FACTORS, DOCTRINE_CITATIONS


class ArtilleryRangeData(BaseModel):
    """Effective and maximum range parameters."""
    min_range_m: int
    max_range_m: int
    max_range_RAP_m: Optional[int] = Field(None, description="Rocket Assisted Projectile extended range")
    max_range_ERFB_m: Optional[int] = Field(None, description="Extended Range Full Bore")


class ArtilleryAmmoData(BaseModel):
    """Ammunition types and planning factors per FM 3-09."""
    standard_projectiles: List[str]
    precision_guided: Optional[List[str]] = None
    illumination: bool = False
    smoke: bool = False
    rounds_per_tube_per_day: int = Field(
        description="Sustained rate per FM 3-09 planning tables"
    )
    max_rate_rounds_per_min: float


class FiresCapability(BaseModel):
    """
    Doctrinal capability model for a fires system.
    All planning factors per FM 3-09 and ATP references.
    """
    system: str
    designation: str
    caliber_mm: int
    crew: int
    range_data: ArtilleryRangeData
    ammo: ArtilleryAmmoData
    displacement_time_min: int = Field(
        description="Time to displace from firing position per ATP 3-09.50"
    )
    emplacement_time_min: int
    mission_profiles: List[str]
    planning_considerations: List[str]
    citations: List[DoctrineCitation]


# ── M109A7 Paladin (155mm SPH) ─────────────────────────────────────────────

M109A7_PALADIN: FiresCapability = FiresCapability(
    system="M109A7 Paladin",
    designation="M109A7",
    caliber_mm=155,
    crew=4,
    range_data=ArtilleryRangeData(
        min_range_m=3000,
        max_range_m=22000,
        max_range_RAP_m=30000,
        max_range_ERFB_m=36000,
    ),
    ammo=ArtilleryAmmoData(
        standard_projectiles=["M107 HE", "M483A1 DPICM", "M795 HE"],
        precision_guided=["M982 Excalibur (GPS)", "M1156 PGK"],
        illumination=True,
        smoke=True,
        rounds_per_tube_per_day=PLANNING_FACTORS["ammo_planning_factors"]["artillery_rounds_per_tube_per_day"],
        max_rate_rounds_per_min=4.0,
    ),
    displacement_time_min=3,
    emplacement_time_min=3,
    mission_profiles=[
        "Direct support (DS)",
        "General support (GS)",
        "General support-reinforcing (GSR)",
        "Reinforcing (R)",
        "Counterfire",
        "Suppression of enemy air defense (SEAD)",
        "Destruction of high priority targets",
        "Final protective fires (FPF)",
        "Illumination",
    ],
    planning_considerations=[
        "Shoot-and-scoot doctrine: displace within 3 min of last round to avoid counterfire",
        "AFATDS digital fire mission network requires TACFIRE or FBCB2 integration",
        "Excalibur GPS munition provides CEP <10m at max range",
        "Counterfire radar (AN/TPQ-50, -53) cues organic fire missions",
        "Copperhead laser-guided rounds require forward observer designation",
        "Planning factor: 6 howitzers per battery, 3 batteries per battalion",
    ],
    citations=[
        DoctrineCitation(
            pub="FM 3-09",
            paragraph="4-1",
            title="Fire Support and Field Artillery Operations",
            url=DOCTRINE_CITATIONS["FM_3_09"]["url"],
        ),
        DoctrineCitation(
            pub="ATP 3-09.23",
            paragraph="2-1",
            title="Field Artillery Cannon Battalion",
            url=None,
        ),
    ],
)

# ── M270 MLRS (227mm Multiple Launch Rocket System) ────────────────────────

M270_MLRS: FiresCapability = FiresCapability(
    system="M270 Multiple Launch Rocket System",
    designation="M270",
    caliber_mm=227,
    crew=3,
    range_data=ArtilleryRangeData(
        min_range_m=15000,
        max_range_m=45000,
        max_range_RAP_m=84000,
    ),
    ammo=ArtilleryAmmoData(
        standard_projectiles=["M26 (DPICM)", "M26A1 (ER-DPICM)", "M28A2 (Practice)"],
        precision_guided=["M30/M31 GMLRS (GPS, 70km)", "M57 ATACMS variant"],
        illumination=False,
        smoke=False,
        rounds_per_tube_per_day=36,
        max_rate_rounds_per_min=12.0,
    ),
    displacement_time_min=5,
    emplacement_time_min=5,
    mission_profiles=[
        "Area suppression / destruction",
        "Deep operations target defeat",
        "SEAD",
        "Counterfire",
        "Time sensitive targeting (with GMLRS)",
        "Anti-personnel area effects",
    ],
    planning_considerations=[
        "GMLRS provides 70km range with <10m CEP — primary precision option",
        "Two-launcher section fires 24 GMLRS or two ATACMS in one ripple",
        "MLRS is sensitive to OPSEC — launch signature visible at 30+ km",
        "Minimum counterfire radar integration required for MLRS employment",
        "Area DPICM munitions restricted under DoD policy — GMLRS preferred",
    ],
    citations=[
        DoctrineCitation(
            pub="FM 3-09",
            paragraph="4-12",
            title="Fire Support and Field Artillery Operations — Rocket Artillery",
            url=DOCTRINE_CITATIONS["FM_3_09"]["url"],
        ),
    ],
)

# ── M777A2 (155mm Towed Howitzer) ───────────────────────────────────────────

M777A2_HOWITZER: FiresCapability = FiresCapability(
    system="M777A2 155mm Towed Howitzer",
    designation="M777A2",
    caliber_mm=155,
    crew=8,
    range_data=ArtilleryRangeData(
        min_range_m=3000,
        max_range_m=24700,
        max_range_RAP_m=30000,
        max_range_ERFB_m=40000,
    ),
    ammo=ArtilleryAmmoData(
        standard_projectiles=["M107 HE", "M795 HE", "M864 DPICM"],
        precision_guided=["M982 Excalibur", "M1156 PGK"],
        illumination=True,
        smoke=True,
        rounds_per_tube_per_day=PLANNING_FACTORS["ammo_planning_factors"]["artillery_rounds_per_tube_per_day"],
        max_rate_rounds_per_min=5.0,
    ),
    displacement_time_min=30,
    emplacement_time_min=30,
    mission_profiles=[
        "Direct support",
        "General support",
        "Air assault / airborne operations (light weight)",
        "Mountain and restricted terrain",
        "Expeditionary operations",
    ],
    planning_considerations=[
        "Titanium construction: 4,218 lb — airlifted by CH-47F (two per sortie)",
        "Emplacement and displacement times significantly longer than Paladin",
        "Preferred for air assault and expeditionary force due to weight",
        "Requires gun line defilade or alternate position plan",
        "AFATDS digital integration same as M109A7",
    ],
    citations=[
        DoctrineCitation(
            pub="FM 3-09",
            paragraph="4-3",
            title="Fire Support and Field Artillery Operations",
            url=DOCTRINE_CITATIONS["FM_3_09"]["url"],
        ),
        DoctrineCitation(
            pub="ATP 3-09.50",
            paragraph="3-1",
            title="The Field Artillery Cannon Battery",
            url=None,
        ),
    ],
)


FIRES_LIBRARY = {
    "M109A7": M109A7_PALADIN,
    "M270":   M270_MLRS,
    "M777A2": M777A2_HOWITZER,
}


def get_fires_capability(designation: str) -> Optional[FiresCapability]:
    """Return the doctrinal capability model for a fires system."""
    return FIRES_LIBRARY.get(designation)


def estimate_fires_requirements(target_area_km2: float, effect: str) -> dict:
    """
    Estimate fires requirements for a target area.
    Planning factors per FM 3-09.
    """
    rounds_per_km2 = {
        "Suppress":  20,
        "Neutralize": 40,
        "Destroy":   80,
    }
    factor = rounds_per_km2.get(effect, 40)
    total_rounds = round(target_area_km2 * factor)
    return {
        "target_area_km2": target_area_km2,
        "desired_effect": effect,
        "estimated_rounds": total_rounds,
        "estimated_tubes_m109a7": max(1, round(total_rounds / PLANNING_FACTORS["ammo_planning_factors"]["artillery_rounds_per_tube_per_day"])),
        "planning_factor_source": "FM 3-09 Table 4-1",
    }
