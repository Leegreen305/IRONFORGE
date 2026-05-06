"""
Tests for COA scoring logic.
"""

import pytest
from scenarios import load_scenario
from mdmp.pipeline import MDMPPipeline


class TestCOAScoring:
    def test_coa_scores_within_valid_range(self):
        scenario = load_scenario("brigade_defense_peer_threat")
        run = MDMPPipeline.start_run(scenario)
        output = run.execute()
        for comp in output.coa_comparisons:
            for score in comp.scores:
                assert 1 <= score.raw_score <= 5
                assert 0 < score.weight < 1
                assert score.weighted_score == pytest.approx(
                    score.raw_score * score.weight, 0.01)

    def test_total_score_is_sum_of_weighted(self):
        scenario = load_scenario("brigade_defense_peer_threat")
        run = MDMPPipeline.start_run(scenario)
        output = run.execute()
        for comp in output.coa_comparisons:
            expected = sum(s.weighted_score for s in comp.scores)
            assert comp.total_score == pytest.approx(expected, 0.01)

    def test_ranks_are_unique_and_ordered(self):
        scenario = load_scenario("brigade_defense_peer_threat")
        run = MDMPPipeline.start_run(scenario)
        output = run.execute()
        ranks = [c.rank for c in output.coa_comparisons]
        assert sorted(ranks) == [1, 2, 3]

    def test_defense_weights_sum_to_one(self):
        from ironforge.constants import DEFAULT_WEIGHTS
        weights = DEFAULT_WEIGHTS["DEFENSE"]
        assert sum(weights.values()) == pytest.approx(1.0, 0.01)

    def test_offense_weights_sum_to_one(self):
        from ironforge.constants import DEFAULT_WEIGHTS
        weights = DEFAULT_WEIGHTS["OFFENSE"]
        assert sum(weights.values()) == pytest.approx(1.0, 0.01)
