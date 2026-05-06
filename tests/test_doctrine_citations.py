"""
Tests for doctrine citation presence and format.
"""

import pytest
from scenarios import load_scenario
from mdmp.pipeline import MDMPPipeline
from ironforge.constants import DOCTRINE_CITATIONS


class TestDoctrineCitations:
    def test_all_steps_have_citations(self):
        scenario = load_scenario("multi_domain_strike")
        run = MDMPPipeline.start_run(scenario)
        output = run.execute()
        assert len(output.receipt.citations) > 0
        assert len(output.mission_analysis.citations) > 0
        for coa in output.coas:
            assert len(coa.citations) > 0
        for analysis in output.coa_analyses:
            assert len(analysis.citations) > 0
        for comp in output.coa_comparisons:
            assert len(comp.citations) > 0
        assert len(output.approval.citations) > 0
        assert len(output.opord.citations) > 0

    def test_citations_have_pub_and_paragraph(self):
        scenario = load_scenario("multi_domain_strike")
        run = MDMPPipeline.start_run(scenario)
        output = run.execute()
        all_citations = []
        all_citations.extend(output.receipt.citations)
        all_citations.extend(output.mission_analysis.citations)
        for c in output.coas:
            all_citations.extend(c.citations)
        for c in output.coa_analyses:
            all_citations.extend(c.citations)
        for c in output.coa_comparisons:
            all_citations.extend(c.citations)
        all_citations.extend(output.approval.citations)
        all_citations.extend(output.opord.citations)

        for citation in all_citations:
            assert citation.pub != ""
            assert citation.paragraph != ""
            assert citation.title != ""

    def test_known_doctrine_citations_exist(self):
        assert "FM_6_0" in DOCTRINE_CITATIONS
        assert "FM_3_60" in DOCTRINE_CITATIONS
        assert "FM_2_01_3" in DOCTRINE_CITATIONS
        assert "FM_3_09" in DOCTRINE_CITATIONS
        assert "ADRP_5_0" in DOCTRINE_CITATIONS
        assert "JP_3_0" in DOCTRINE_CITATIONS
        assert "JP_3_60" in DOCTRINE_CITATIONS
        assert "TRADOC_P525_3_1" in DOCTRINE_CITATIONS
        assert "RAND_AI_MDMP" in DOCTRINE_CITATIONS
