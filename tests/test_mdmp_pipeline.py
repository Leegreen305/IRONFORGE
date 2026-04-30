"""
Tests for MDMP pipeline step outputs.
"""

import pytest
from scenarios import load_scenario
from mdmp.pipeline import MDMPPipeline
from mdmp.models import MDMPOutput


@pytest.fixture
def offense_scenario():
    return load_scenario("contested_airspace_cas")


@pytest.fixture
def defense_scenario():
    return load_scenario("brigade_defense_peer_threat")


class TestMDMPPipeline:
    def test_pipeline_completes_all_steps(self, offense_scenario):
        run = MDMPPipeline.start_run(offense_scenario)
        output = run.execute()
        assert output is not None
        assert isinstance(output, MDMPOutput)
        assert len(run.completed_steps) == 7

    def test_receipt_of_mission(self, offense_scenario):
        run = MDMPPipeline.start_run(offense_scenario)
        output = run.execute()
        assert output.receipt.step_name == "RECEIPT_OF_MISSION"
        assert output.receipt.classification in [
            "hasty", "deliberate", "crisis_action"]
        assert len(output.receipt.key_tasks_identified) > 0

    def test_mission_analysis(self, offense_scenario):
        run = MDMPPipeline.start_run(offense_scenario)
        output = run.execute()
        assert output.mission_analysis.step_name == "MISSION_ANALYSIS"
        assert output.mission_analysis.mett_tc.mission != ""
        assert output.mission_analysis.restated_mission != ""
        assert len(output.mission_analysis.specified_tasks) > 0

    def test_coa_development_generates_three(self, offense_scenario):
        run = MDMPPipeline.start_run(offense_scenario)
        output = run.execute()
        assert len(output.coas) == 3
        coa_ids = [c.coa_id for c in output.coas]
        assert "COA-A" in coa_ids
        assert "COA-B" in coa_ids
        assert "COA-C" in coa_ids

    def test_coa_analysis(self, offense_scenario):
        run = MDMPPipeline.start_run(offense_scenario)
        output = run.execute()
        assert len(output.coa_analyses) == 3
        for analysis in output.coa_analyses:
            assert analysis.step_name == "COA_ANALYSIS"
            assert len(analysis.wargame_sequences) > 0
            assert len(analysis.strengths) > 0
            assert len(analysis.weaknesses) > 0

    def test_coa_comparison(self, offense_scenario):
        run = MDMPPipeline.start_run(offense_scenario)
        output = run.execute()
        assert len(output.coa_comparisons) == 3
        for comp in output.coa_comparisons:
            assert comp.step_name == "COA_COMPARISON"
            assert comp.total_score > 0
            assert len(comp.scores) == 6

    def test_coa_approval(self, offense_scenario):
        run = MDMPPipeline.start_run(offense_scenario)
        output = run.execute()
        assert output.approval.step_name == "COA_APPROVAL"
        assert output.approval.recommended_coa_id in [
            "COA-A", "COA-B", "COA-C"]
        assert output.approval.justification != ""

    def test_opord_production(self, offense_scenario):
        run = MDMPPipeline.start_run(offense_scenario)
        output = run.execute()
        assert output.opord.step_name == "ORDERS_PRODUCTION"
        assert len(output.opord.situation) > 0
        assert len(output.opord.mission) > 0
        assert len(output.opord.execution) > 0
        assert len(output.opord.sustainment) > 0
        assert len(output.opord.command_and_signal) > 0

    def test_defense_scenario_pipeline(self, defense_scenario):
        run = MDMPPipeline.start_run(defense_scenario)
        output = run.execute()
        assert output is not None
        assert len(output.coas) == 3
        assert output.approval.recommended_coa_id is not None
