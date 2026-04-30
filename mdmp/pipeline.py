"""
MDMP Pipeline Orchestrator

Runs all seven steps of the MDMP per FM 6-0, Chapter 9.
"""

import uuid
from typing import Dict, List

from ironforge.base_classes import Scenario
from ironforge.enums import MDMPStep
from mdmp.models import MDMPOutput
from mdmp.step01_receipt import receipt_of_mission
from mdmp.step02_mission_analysis import mission_analysis
from mdmp.step03_coa_development import coa_development
from mdmp.step04_coa_analysis import coa_analysis
from mdmp.step05_coa_comparison import coa_comparison
from mdmp.step06_coa_approval import coa_approval
from mdmp.step07_orders_production import orders_production


class MDMPRun:
    """Tracks the state of a single MDMP execution."""

    def __init__(self, scenario: Scenario):
        self.run_id = str(uuid.uuid4())
        self.scenario = scenario
        self.scenario.run_id = self.run_id
        self.completed_steps: List[MDMPStep] = []
        self.output: MDMPOutput = None
        self._step_results: Dict[str, any] = {}

    def execute(self) -> MDMPOutput:
        """Execute the full seven-step MDMP pipeline."""
        # Step 1
        receipt = receipt_of_mission(self.scenario)
        self._step_results["receipt"] = receipt
        self.completed_steps.append(MDMPStep.RECEIPT_OF_MISSION)

        # Step 2
        ma = mission_analysis(self.scenario)
        self._step_results["mission_analysis"] = ma
        self.completed_steps.append(MDMPStep.MISSION_ANALYSIS)

        # Step 3
        coas = coa_development(self.scenario)
        self._step_results["coas"] = coas
        self.completed_steps.append(MDMPStep.COA_DEVELOPMENT)

        # Step 4
        analyses = [coa_analysis(c, self.scenario) for c in coas]
        self._step_results["coa_analyses"] = analyses
        self.completed_steps.append(MDMPStep.COA_ANALYSIS)

        # Step 5
        comparisons = [coa_comparison(
            c, self.scenario.mission_type, analyses) for c in coas]
        self._step_results["coa_comparisons"] = comparisons
        self.completed_steps.append(MDMPStep.COA_COMPARISON)

        # Step 6
        approval = coa_approval(coas, comparisons)
        self._step_results["approval"] = approval
        self.completed_steps.append(MDMPStep.COA_APPROVAL)

        # Step 7
        recommended_coa = next(
            c for c in coas if c.coa_id == approval.recommended_coa_id)
        opord = orders_production(recommended_coa, approval, ma)
        self._step_results["opord"] = opord
        self.completed_steps.append(MDMPStep.ORDERS_PRODUCTION)

        self.output = MDMPOutput(
            run_id=self.run_id,
            receipt=receipt,
            mission_analysis=ma,
            coas=coas,
            coa_analyses=analyses,
            coa_comparisons=comparisons,
            approval=approval,
            opord=opord,
        )
        return self.output


class MDMPPipeline:
    """Singleton-style pipeline manager for MDMP runs."""

    _runs: Dict[str, MDMPRun] = {}

    @classmethod
    def start_run(cls, scenario: Scenario) -> MDMPRun:
        run = MDMPRun(scenario)
        cls._runs[run.run_id] = run
        return run

    @classmethod
    def get_run(cls, run_id: str) -> MDMPRun:
        return cls._runs.get(run_id)
