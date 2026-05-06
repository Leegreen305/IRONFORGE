"""
Tests for intelligence module.
"""

import pytest
from scenarios import load_scenario
from intelligence import IPBEngine


class TestIntelligence:
    def test_ipb_analysis(self):
        scenario = load_scenario("brigade_defense_peer_threat")
        engine = IPBEngine()
        result = engine.analyze(scenario)
        assert result.step1_operational_environment != ""
        assert result.step2_environment_effects != ""
        assert result.step3_threat_evaluation != ""
        assert len(result.step4_threat_coas) > 0
        assert len(result.citations) > 0

    def test_key_terrain_identified(self):
        scenario = load_scenario("brigade_defense_peer_threat")
        engine = IPBEngine()
        result = engine.analyze(scenario)
        assert len(result.key_terrain) > 0

    def test_avenues_of_approach(self):
        scenario = load_scenario("brigade_defense_peer_threat")
        engine = IPBEngine()
        result = engine.analyze(scenario)
        assert len(result.avenues_of_approach) > 0

    def test_nai_generation(self):
        scenario = load_scenario("brigade_defense_peer_threat")
        engine = IPBEngine()
        result = engine.analyze(scenario)
        assert len(result.named_areas_of_interest) > 0
