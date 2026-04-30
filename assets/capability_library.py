"""
Capability Library

Predefined unit capabilities based on published Army tables.
"""

from assets.unit_models import (
    GroundManeuverUnit,
    AviationUnit,
    FiresUnit,
    CyberUnit,
    EWUnit,
    LogisticsUnit,
)
from ironforge.enums import UnitType, Echelon


class CapabilityLibrary:
    """Provides doctrinal unit capability templates."""

    @staticmethod
    def armor_company() -> GroundManeuverUnit:
        return GroundManeuverUnit(
            unit_type=UnitType.ARMOR,
            echelon=Echelon.COMPANY,
            personnel_count=120,
            primary_systems=["M1A2 Abrams", "M113", "HMMWV"],
            road_march_speed_kmh=50,
            cross_country_speed_kmh=30,
            fuel_consumption_gal_per_km=1.5,
            combat_radius_km=300,
        )

    @staticmethod
    def infantry_company() -> GroundManeuverUnit:
        return GroundManeuverUnit(
            unit_type=UnitType.INFANTRY,
            echelon=Echelon.COMPANY,
            personnel_count=130,
            primary_systems=["M4", "M240B", "Javelin", "Stryker"],
            road_march_speed_kmh=40,
            cross_country_speed_kmh=20,
            fuel_consumption_gal_per_km=0.6,
            combat_radius_km=150,
        )

    @staticmethod
    def artillery_battery() -> FiresUnit:
        return FiresUnit(
            unit_type=UnitType.ARTILLERY,
            echelon=Echelon.BATTALION,
            personnel_count=120,
            primary_systems=["M777A2", "M119A3"],
            tube_count=8,
            max_range_km=24,
            rounds_per_tube_per_day=200,
            response_time_minutes=3,
        )

    @staticmethod
    def attack_helicopter_troop() -> AviationUnit:
        return AviationUnit(
            unit_type=UnitType.AVIATION,
            echelon=Echelon.COMPANY,
            personnel_count=80,
            primary_systems=["AH-64E Apache"],
            cruise_speed_knots=140,
            endurance_hours=2.5,
            payload_kg=2300,
            loiter_time_hours=1.5,
        )

    @staticmethod
    def cyber_team() -> CyberUnit:
        return CyberUnit(
            unit_type=UnitType.CYBER,
            echelon=Echelon.PLATOON,
            personnel_count=30,
            primary_systems=["CWD", "CNE toolkit", "CNA platform"],
            capabilities=["network_exploitation", "network_attack",
                          "defensive_cyber_ops", "influence_ops"],
            target_categories=["C2", "communications",
                               "infrastructure", "financial"],
        )

    @staticmethod
    def ew_team() -> EWUnit:
        return EWUnit(
            unit_type=UnitType.ELECTRONIC_WARFARE,
            echelon=Echelon.PLATOON,
            personnel_count=25,
            primary_systems=["TLS", "CEMA support"],
            capabilities=["electronic_attack", "electronic_protect",
                          "electronic_support", "signals_intelligence"],
            frequency_range_mhz="20-3000",
            platform="Ground vehicle mounted",
        )

    @staticmethod
    def logistics_company() -> LogisticsUnit:
        return LogisticsUnit(
            unit_type=UnitType.QUARTERMASTER,
            echelon=Echelon.COMPANY,
            personnel_count=180,
            primary_systems=["HEMTT", "PLS", "FSC"],
            daily_supply_capacity_tons=150,
            transport_capacity_liters=20000,
            medical_beds=10,
            maintenance_capability=[
                " automotive", "communications", "weapons"],
        )
