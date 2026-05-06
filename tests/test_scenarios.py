"""
Tests for pre-built scenarios.
"""

import pytest
from scenarios import load_scenario, list_scenarios
from ironforge.base_classes import Scenario


class TestScenarios:
    def test_all_scenarios_load(self):
        names = list_scenarios().keys()
        for name in names:
            scenario = load_scenario(name)
            assert isinstance(scenario, Scenario)
            assert scenario.title != ""
            assert len(scenario.friendly_force) > 0

    def test_time_sensitive_targeting(self):
        s = load_scenario("time_sensitive_targeting")
        assert s.mission_type.value == "TARGETING"
        assert len(s.enemy_force) > 0
        assert len(s.terrain) > 0

    def test_brigade_defense(self):
        s = load_scenario("brigade_defense_peer_threat")
        assert s.mission_type.value == "DEFENSE"
        assert len(s.friendly_force) >= 2

    def test_cyber_physical_fob(self):
        s = load_scenario("cyber_physical_fob")
        assert s.mission_type.value == "DEFENSE"
        assert any(u.unit_type.value == "CYBER" for u in s.friendly_force)

    def test_contested_airspace_cas(self):
        s = load_scenario("contested_airspace_cas")
        assert s.mission_type.value == "OFFENSE"
        assert any(u.unit_type.value == "AVIATION" for u in s.friendly_force)

    def test_multi_domain_strike(self):
        s = load_scenario("multi_domain_strike")
        assert s.mission_type.value == "OFFENSE"
        assert any(u.unit_type.value == "CYBER" for u in s.friendly_force)
        assert any(u.unit_type.value ==
                   "ELECTRONIC_WARFARE" for u in s.friendly_force)
