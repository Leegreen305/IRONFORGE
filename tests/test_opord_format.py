"""
Tests for OPORD paragraph numbering and formatting.
"""

import pytest
from scenarios import load_scenario
from mdmp.pipeline import MDMPPipeline


class TestOPORDFormat:
    def test_situation_has_paragraph_1(self):
        scenario = load_scenario("time_sensitive_targeting")
        run = MDMPPipeline.start_run(scenario)
        output = run.execute()
        nums = [p.paragraph_num for p in output.opord.situation]
        assert any(n.startswith("1.") for n in nums)

    def test_mission_has_paragraph_2(self):
        scenario = load_scenario("time_sensitive_targeting")
        run = MDMPPipeline.start_run(scenario)
        output = run.execute()
        nums = [p.paragraph_num for p in output.opord.mission]
        assert any(n == "2." for n in nums)

    def test_execution_has_paragraph_3(self):
        scenario = load_scenario("time_sensitive_targeting")
        run = MDMPPipeline.start_run(scenario)
        output = run.execute()
        nums = [p.paragraph_num for p in output.opord.execution]
        assert any(n.startswith("3.") for n in nums)

    def test_sustainment_has_paragraph_4(self):
        scenario = load_scenario("time_sensitive_targeting")
        run = MDMPPipeline.start_run(scenario)
        output = run.execute()
        nums = [p.paragraph_num for p in output.opord.sustainment]
        assert any(n.startswith("4.") for n in nums)

    def test_command_and_signal_has_paragraph_5(self):
        scenario = load_scenario("time_sensitive_targeting")
        run = MDMPPipeline.start_run(scenario)
        output = run.execute()
        nums = [p.paragraph_num for p in output.opord.command_and_signal]
        assert any(n.startswith("5.") for n in nums)

    def test_execution_includes_decisive_operation(self):
        scenario = load_scenario("time_sensitive_targeting")
        run = MDMPPipeline.start_run(scenario)
        output = run.execute()
        titles = [p.title.lower() for p in output.opord.execution]
        assert any("decisive" in t for t in titles)
