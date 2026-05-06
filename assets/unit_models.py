"""
Unit Capability Models

Models for doctrinal unit capabilities with planning factors.
"""

from typing import List, Optional
from pydantic import BaseModel, Field

from ironforge.enums import UnitType, Echelon


class UnitCapability(BaseModel):
    """Base capability model."""
    unit_type: UnitType
    echelon: Echelon
    personnel_count: Optional[int] = None
    primary_systems: List[str] = []
    planning_factors: dict = {}


class GroundManeuverUnit(UnitCapability):
    """Ground maneuver unit with movement and sustainment factors."""
    road_march_speed_kmh: float = Field(
        default=40.0, description="FM 6-0 planning factor")
    cross_country_speed_kmh: float = Field(default=20.0)
    fuel_consumption_gal_per_km: float = Field(default=1.0)
    combat_radius_km: Optional[float] = None


class AviationUnit(UnitCapability):
    """Aviation unit with flight and endurance factors."""
    cruise_speed_knots: float = Field(default=120.0)
    endurance_hours: float = Field(default=2.5)
    payload_kg: Optional[float] = None
    loiter_time_hours: Optional[float] = None


class FiresUnit(UnitCapability):
    """Field artillery or fires unit."""
    tube_count: int = Field(default=6)
    max_range_km: float = Field(default=20.0)
    rounds_per_tube_per_day: int = Field(
        default=200, description="FM 3-09 planning factor")
    response_time_minutes: float = Field(default=3.0)


class CyberUnit(UnitCapability):
    """Cyber warfare unit."""
    capabilities: List[str] = Field(
        default=["network_exploitation", "network_attack", "defensive_cyber_ops"])
    target_categories: List[str] = Field(
        default=["C2", "communications", "infrastructure"])


class EWUnit(UnitCapability):
    """Electronic warfare unit."""
    capabilities: List[str] = Field(
        default=["electronic_attack", "electronic_protect", "electronic_support"])
    frequency_range_mhz: Optional[str] = None
    platform: Optional[str] = None


class LogisticsUnit(UnitCapability):
    """Sustainment and logistics unit."""
    daily_supply_capacity_tons: Optional[float] = None
    transport_capacity_liters: Optional[float] = None
    medical_beds: Optional[int] = None
    maintenance_capability: List[str] = []
