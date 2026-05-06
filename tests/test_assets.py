"""
Tests for assets module.
"""

import pytest
from assets import CapabilityLibrary
from ironforge.enums import UnitType, Echelon


class TestAssets:
    def test_armor_company(self):
        unit = CapabilityLibrary.armor_company()
        assert unit.unit_type == UnitType.ARMOR
        assert unit.echelon == Echelon.COMPANY
        assert unit.personnel_count == 120
        assert "M1A2 Abrams" in unit.primary_systems

    def test_artillery_battery(self):
        unit = CapabilityLibrary.artillery_battery()
        assert unit.unit_type == UnitType.ARTILLERY
        assert unit.tube_count == 8
        assert unit.rounds_per_tube_per_day == 200

    def test_cyber_team(self):
        unit = CapabilityLibrary.cyber_team()
        assert unit.unit_type == UnitType.CYBER
        assert "network_exploitation" in unit.capabilities

    def test_ew_team(self):
        unit = CapabilityLibrary.ew_team()
        assert unit.unit_type == UnitType.ELECTRONIC_WARFARE
        assert unit.frequency_range_mhz is not None
