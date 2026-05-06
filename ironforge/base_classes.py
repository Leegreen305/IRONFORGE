"""
Base Pydantic models for IRONFORGE

Doctrine sources:
- FM 6-0, Commander and Staff Organization and Operations
- FM 2-01.3, Intelligence Preparation of the Battlefield
- JP 3-0, Joint Operations
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

from .enums import UnitType, Echelon, TerrainType, WeatherCondition, MissionType, ThreatCategory


class DoctrineCitation(BaseModel):
    """Reference to a specific doctrine publication and paragraph."""
    pub: str = Field(..., description="Publication identifier, e.g., FM 6-0")
    paragraph: str = Field(..., description="Paragraph or section number")
    title: str = Field(..., description="Title of the publication")
    url: Optional[str] = Field(
        None, description="Publicly available URL if known")


class Coordinate(BaseModel):
    """MGRS or lat/lon coordinate pair."""
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)
    mgrs: Optional[str] = Field(
        None, description="Military Grid Reference System string")


class Unit(BaseModel):
    """Friendly or enemy unit descriptor per FM 6-0."""
    name: str
    unit_type: UnitType
    echelon: Echelon
    size_estimate: Optional[str] = Field(
        None, description="Estimated strength, e.g., '300 pax'")
    coordinates: Optional[Coordinate] = None
    higher_hq: Optional[str] = None
    task_org: Optional[str] = Field(
        None, description="Task organization assignment")
    equipment: Optional[List[str]] = None
    readiness: Optional[str] = Field(
        None, description="C-level readiness rating")


class TerrainFeature(BaseModel):
    """Key terrain feature per FM 2-01.3."""
    name: str
    terrain_type: TerrainType
    coordinates: Optional[Coordinate] = None
    description: str
    is_key_terrain: bool = Field(
        False, description="Does this feature provide a marked advantage?")
    avenues_of_approach: Optional[List[str]] = None
    mobility_corridors: Optional[List[str]] = None


class WeatherState(BaseModel):
    """Current and forecast weather per FM 2-01.3 Appendix B."""
    condition: WeatherCondition
    temperature_c: Optional[float] = None
    wind_kph: Optional[float] = None
    visibility_km: Optional[float] = None
    precipitation_mm: Optional[float] = None
    illumination: Optional[str] = Field(
        None, description="Day, night, or limited visibility")
    effects_summary: Optional[str] = Field(
        None, description="Doctrine-based effects summary")


class ThreatModel(BaseModel):
    """Enemy/threat model per FM 2-01.3."""
    name: str
    threat_category: ThreatCategory
    disposition: str
    strength_estimate: str
    most_likely_coa: Optional[str] = None
    most_dangerous_coa: Optional[str] = None
    known_vulnerabilities: Optional[List[str]] = None
    high_value_targets: Optional[List[str]] = None
    units: Optional[List[Unit]] = None


class Scenario(BaseModel):
    """Top-level scenario input for IRONFORGE."""
    title: str
    description: str
    mission_type: MissionType
    friendly_force: List[Unit]
    enemy_force: Optional[List[ThreatModel]] = None
    terrain: Optional[List[TerrainFeature]] = None
    weather: Optional[WeatherState] = None
    time_available: Optional[str] = Field(
        None, description="Time available for planning, e.g., '6 hours'")
    civil_considerations: Optional[List[str]] = None
    restrictions: Optional[List[str]] = None
    attachments: Optional[List[str]] = None
    higher_intent: Optional[str] = None
    run_id: Optional[str] = None
