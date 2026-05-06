"""
Tests for fires module.
"""

import pytest
from fires import TargetingEngine, HighPayoffTargetList, FireSupportCoordinationMeasures


class TestFires:
    def test_target_nomination(self):
        engine = TargetingEngine()
        target = engine.nominate({
            "target_id": "T-001",
            "name": "Enemy Command Post",
            "target_type": "C2",
            "priority": "HPT",
            "location_description": "Grid 38T MN 12345 67890",
            "desired_effect": "Neutralize",
            "recommended_engagement": "HIMARS",
        })
        assert target.target_id == "T-001"
        assert target.f2t2ea_status == "FIND"
        assert target.citation is not None

    def test_f2t2ea_progression(self):
        engine = TargetingEngine()
        target = engine.nominate({"target_id": "T-002", "name": "Test"})
        target = engine.process_f2t2ea(target, "FIX")
        assert target.f2t2ea_status == "FIX"
        target = engine.process_f2t2ea(target, "ENGAGE")
        assert target.f2t2ea_status == "ENGAGE"

    def test_invalid_f2t2ea_raises(self):
        engine = TargetingEngine()
        target = engine.nominate({"target_id": "T-003", "name": "Test"})
        with pytest.raises(ValueError):
            engine.process_f2t2ea(target, "INVALID")

    def test_hptl(self):
        hptl = HighPayoffTargetList()
        engine = TargetingEngine()
        target = engine.nominate(
            {"target_id": "T-004", "name": "HVT", "priority": "HVT"})
        hptl.add(target)
        assert len(hptl.list_targets()) == 1

    def test_fscm_standard_measures(self):
        fscm = FireSupportCoordinationMeasures()
        fscm.standard_offensive_measures()
        assert len(fscm.list_measures()) == 2
        types = [m.type for m in fscm.list_measures()]
        assert "CFL" in types
        assert "FSCL" in types
