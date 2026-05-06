"""
IPB Engine

Implements the four-step IPB process per FM 2-01.3:
1. Define the operational environment
2. Describe environment effects on operations
3. Evaluate the threat
4. Determine threat COAs
"""

from typing import List, Dict
from pydantic import BaseModel, Field

from ironforge.base_classes import Scenario, TerrainFeature, ThreatModel, DoctrineCitation
from ironforge.constants import DOCTRINE_CITATIONS
from intelligence.terrain import TerrainAnalyzer
from intelligence.weather_effects import WeatherEffects
from intelligence.threat_templates import ThreatTemplateLibrary
from intelligence.nai_generator import NAIGenerator


class IPBResult(BaseModel):
    """Complete IPB output."""
    step1_operational_environment: str
    step2_environment_effects: str
    step3_threat_evaluation: str
    step4_threat_coas: List[str]
    key_terrain: List[TerrainFeature]
    avenues_of_approach: List[str]
    named_areas_of_interest: List[str]
    citations: List[DoctrineCitation]


class IPBEngine:
    """Runs the four-step IPB process."""

    def __init__(self):
        self.terrain_analyzer = TerrainAnalyzer()
        self.weather_effects = WeatherEffects()
        self.threat_lib = ThreatTemplateLibrary()
        self.nai_gen = NAIGenerator()

    def analyze(self, scenario: Scenario) -> IPBResult:
        terrain = scenario.terrain or []
        weather = scenario.weather
        threats = scenario.enemy_force or []

        kt = self.terrain_analyzer.identify_key_terrain(terrain)
        aoa = self.terrain_analyzer.avenues_of_approach(terrain)
        weather_effects = self.weather_effects.assess(
            weather) if weather else "No weather data."

        threat_evals = []
        threat_coas = []
        for t in threats:
            threat_evals.append(self.threat_lib.evaluate(t))
            threat_coas.extend(self.threat_lib.likely_coas(t))

        nais = self.nai_gen.generate(terrain, threats)

        citations = [
            DoctrineCitation(
                pub="FM 2-01.3",
                paragraph="1-1",
                title="Intelligence Preparation of the Battlefield",
                url=DOCTRINE_CITATIONS["FM_2_01_3"]["url"],
            ),
            DoctrineCitation(
                pub="FM 2-01.3",
                paragraph="2-1",
                title="Intelligence Preparation of the Battlefield",
                url=DOCTRINE_CITATIONS["FM_2_01_3"]["url"],
            ),
        ]

        return IPBResult(
            step1_operational_environment=f"AO includes {len(terrain)} terrain features and {len(threats)} threat elements.",
            step2_environment_effects=weather_effects,
            step3_threat_evaluation="; ".join(
                threat_evals) if threat_evals else "No threat data.",
            step4_threat_coas=threat_coas if threat_coas else [
                "No threat COAs identified."],
            key_terrain=kt,
            avenues_of_approach=aoa,
            named_areas_of_interest=nais,
            citations=citations,
        )
