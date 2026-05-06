"""
Ground Maneuver Asset Capability Models

Doctrinal planning factors sourced from:
- FM 6-0, Commander and Staff Organization and Operations, Appendix B
- ATP 3-21.20, Infantry Battalion
- ATP 3-20.15, Tank Platoon
- FM 3-96, Brigade Combat Team
"""

from typing import List, Optional
from pydantic import BaseModel, Field

from ironforge.enums import UnitType, Echelon
from ironforge.base_classes import DoctrineCitation
from ironforge.constants import PLANNING_FACTORS, DOCTRINE_CITATIONS


class GroundMovementRates(BaseModel):
    """Doctrinal movement rates per FM 6-0, Appendix B."""
    road_km_hr: float
    cross_country_km_hr: float
    restricted_terrain_km_hr: float
    urban_km_hr: float


class GroundFirepowerData(BaseModel):
    """Organic firepower capabilities."""
    primary_weapon: str
    effective_range_m: int
    suppression_capability: str
    anti_armor_capability: Optional[str] = None


class GroundLogisticsData(BaseModel):
    """Sustainment planning factors per FM 6-0."""
    fuel_consumption_gal_per_km: float
    daily_class_iii_gal: float
    daily_class_v_rounds: int
    resupply_interval_hrs: int


class GroundManeuverCapability(BaseModel):
    """
    Doctrinal capability model for a ground maneuver unit.
    Planning factors per FM 6-0 Appendix B and unit MTOEs.
    """
    unit_type: UnitType
    echelon: Echelon
    typical_strength_pax: int
    movement_rates: GroundMovementRates
    firepower: GroundFirepowerData
    logistics: GroundLogisticsData
    mission_profiles: List[str]
    doctrinal_frontage_km: Optional[float] = Field(
        None, description="Doctrinal frontage for the echelon per FM 6-0 planning factors"
    )
    doctrinal_depth_km: Optional[float] = None
    citations: List[DoctrineCitation]


# ── Infantry Battalion ──────────────────────────────────────────────────────

INFANTRY_BATTALION: GroundManeuverCapability = GroundManeuverCapability(
    unit_type=UnitType.INFANTRY,
    echelon=Echelon.BATTALION,
    typical_strength_pax=800,
    movement_rates=GroundMovementRates(
        road_km_hr=PLANNING_FACTORS["movement_rates"]["mounted_infantry_road_km_hr"],
        cross_country_km_hr=PLANNING_FACTORS["movement_rates"]["mounted_infantry_cross_country_km_hr"],
        restricted_terrain_km_hr=8,
        urban_km_hr=4,
    ),
    firepower=GroundFirepowerData(
        primary_weapon="M4 Carbine / M249 SAW / M240B",
        effective_range_m=500,
        suppression_capability="Organic mortars (81mm, 120mm); attached fires",
        anti_armor_capability="Javelin ATGM; AT4",
    ),
    logistics=GroundLogisticsData(
        fuel_consumption_gal_per_km=PLANNING_FACTORS["fuel_consumption"]["stryker_gal_per_km"],
        daily_class_iii_gal=3000,
        daily_class_v_rounds=PLANNING_FACTORS["ammo_planning_factors"]["small_arms_rounds_per_soldier_per_day"] * 800,
        resupply_interval_hrs=24,
    ),
    mission_profiles=[
        "Attack",
        "Defend",
        "Movement to contact",
        "Delay",
        "Stability",
        "Urban operations",
        "Air assault",
    ],
    doctrinal_frontage_km=4.0,
    doctrinal_depth_km=3.0,
    citations=[
        DoctrineCitation(
            pub="ATP 3-21.20",
            paragraph="2-1",
            title="Infantry Battalion",
            url=None,
        ),
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="B-1",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
    ],
)

# ── Armor (Tank) Battalion ──────────────────────────────────────────────────

ARMOR_BATTALION: GroundManeuverCapability = GroundManeuverCapability(
    unit_type=UnitType.ARMOR,
    echelon=Echelon.BATTALION,
    typical_strength_pax=500,
    movement_rates=GroundMovementRates(
        road_km_hr=PLANNING_FACTORS["movement_rates"]["armor_road_km_hr"],
        cross_country_km_hr=PLANNING_FACTORS["movement_rates"]["armor_cross_country_km_hr"],
        restricted_terrain_km_hr=12,
        urban_km_hr=6,
    ),
    firepower=GroundFirepowerData(
        primary_weapon="M1A2 SEP v3 120mm Smoothbore",
        effective_range_m=3000,
        suppression_capability="Coaxial 7.62mm MG; .50 cal M2; mortar section",
        anti_armor_capability="APFSDS, HEAT, MPAT, STAFF rounds; effective against all armor classes",
    ),
    logistics=GroundLogisticsData(
        fuel_consumption_gal_per_km=PLANNING_FACTORS["fuel_consumption"]["tank_gal_per_km"],
        daily_class_iii_gal=8000,
        daily_class_v_rounds=PLANNING_FACTORS["ammo_planning_factors"]["tank_main_gun_rounds_per_day"] * 44,
        resupply_interval_hrs=8,
    ),
    mission_profiles=[
        "Attack",
        "Penetration",
        "Exploitation",
        "Pursuit",
        "Counterattack",
        "Defensive operations",
    ],
    doctrinal_frontage_km=3.0,
    doctrinal_depth_km=2.0,
    citations=[
        DoctrineCitation(
            pub="ATP 3-20.15",
            paragraph="2-1",
            title="Tank Platoon",
            url=None,
        ),
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="B-2",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
    ],
)

# ── Cavalry Squadron ────────────────────────────────────────────────────────

CAVALRY_SQUADRON: GroundManeuverCapability = GroundManeuverCapability(
    unit_type=UnitType.CAVALRY,
    echelon=Echelon.BATTALION,
    typical_strength_pax=900,
    movement_rates=GroundMovementRates(
        road_km_hr=PLANNING_FACTORS["movement_rates"]["armor_road_km_hr"],
        cross_country_km_hr=PLANNING_FACTORS["movement_rates"]["armor_cross_country_km_hr"],
        restricted_terrain_km_hr=15,
        urban_km_hr=8,
    ),
    firepower=GroundFirepowerData(
        primary_weapon="M1A2 / M3 Bradley / M1127 RV",
        effective_range_m=2500,
        suppression_capability="25mm chain gun; organic mortar platoon; attached FA",
        anti_armor_capability="TOW ATGM; 120mm smoothbore (if M1A2 equipped)",
    ),
    logistics=GroundLogisticsData(
        fuel_consumption_gal_per_km=PLANNING_FACTORS["fuel_consumption"]["bradley_gal_per_km"],
        daily_class_iii_gal=6000,
        daily_class_v_rounds=25000,
        resupply_interval_hrs=12,
    ),
    mission_profiles=[
        "Reconnaissance",
        "Security (screen, guard, cover)",
        "Economy of force",
        "Wide area security",
        "Flank security",
        "Pursuit",
    ],
    doctrinal_frontage_km=15.0,
    doctrinal_depth_km=20.0,
    citations=[
        DoctrineCitation(
            pub="FM 3-96",
            paragraph="3-1",
            title="Brigade Combat Team",
            url=None,
        ),
    ],
)


def get_capability(unit_type: UnitType, echelon: Echelon) -> Optional[GroundManeuverCapability]:
    """Return the closest matching doctrinal capability model for a ground unit."""
    registry = {
        (UnitType.INFANTRY, Echelon.BATTALION): INFANTRY_BATTALION,
        (UnitType.ARMOR, Echelon.BATTALION):    ARMOR_BATTALION,
        (UnitType.CAVALRY, Echelon.BATTALION):  CAVALRY_SQUADRON,
    }
    return registry.get((unit_type, echelon))
