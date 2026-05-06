"""
Pydantic models for MDMP step outputs.

Doctrine source:
- FM 6-0, Commander and Staff Organization and Operations, Chapter 9
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

from ironforge.base_classes import DoctrineCitation, Unit, ThreatModel, TerrainFeature, WeatherState
from ironforge.enums import COAStatus, MissionType


class ReceiptOfMissionResult(BaseModel):
    """Step 1: Receipt of Mission output per FM 6-0, para 9-20."""
    step_name: str = "RECEIPT_OF_MISSION"
    mission_type: MissionType
    classification: str = Field(...,
                                description="e.g., hasty, deliberate, crisis action")
    time_available_hours: Optional[float] = None
    initial_assessment: str
    key_tasks_identified: List[str]
    citations: List[DoctrineCitation]


class METTTC(BaseModel):
    """METT-TC factors per FM 6-0, para 9-32."""
    mission: str
    enemy: str
    terrain_and_weather: str
    troops_and_support_available: str
    time_available: str
    civil_considerations: str


class MissionAnalysisResult(BaseModel):
    """Step 2: Mission Analysis output per FM 6-0, paras 9-29 to 9-77."""
    step_name: str = "MISSION_ANALYSIS"
    mett_tc: METTTC
    specified_tasks: List[str]
    implied_tasks: List[str]
    essential_tasks: List[str]
    restated_mission: str
    commander_intent_summary: Optional[str] = None
    planning_guidance: Optional[str] = None
    citations: List[DoctrineCitation]


class COA(BaseModel):
    """Course of Action per FM 6-0, para 9-78."""
    coa_id: str
    name: str
    description: str
    type: str = Field(..., description="e.g., offense, defense, stability")
    decisive_operation: str
    shaping_operations: List[str]
    sustaining_operation: Optional[str] = None
    risk_assessment: str
    status: COAStatus = COAStatus.DRAFT
    citations: List[DoctrineCitation]


class WargameSequence(BaseModel):
    """Action/Reaction/Counteraction sequence per FM 6-0, para 9-105."""
    sequence_num: int
    friendly_action: str
    enemy_reaction: str
    friendly_counteraction: str
    outcome: str
    key_decision: Optional[str] = None


class COAAnalysisResult(BaseModel):
    """Step 4: COA Analysis output per FM 6-0, paras 9-96 to 9-116."""
    step_name: str = "COA_ANALYSIS"
    coa_id: str
    wargame_sequences: List[WargameSequence]
    strengths: List[str]
    weaknesses: List[str]
    hazards: List[str]
    branches: List[str]
    sequels: List[str]
    overall_assessment: str
    citations: List[DoctrineCitation]


class CriterionScore(BaseModel):
    """Score for a single decision criterion."""
    criterion: str
    raw_score: int = Field(..., ge=1, le=5)
    weight: float
    weighted_score: float
    rationale: str


class COAComparisonResult(BaseModel):
    """Step 5: COA Comparison output per FM 6-0, para 9-117."""
    step_name: str = "COA_COMPARISON"
    coa_id: str
    scores: List[CriterionScore]
    total_score: float
    rank: int
    citations: List[DoctrineCitation]


class COAApprovalResult(BaseModel):
    """Step 6: COA Approval output per FM 6-0, paras 9-123 to 9-128."""
    step_name: str = "COA_APPROVAL"
    recommended_coa_id: str
    recommended_coa_name: str
    justification: str
    risk_acceptance: str
    decision_criteria_summary: str
    citations: List[DoctrineCitation]


class OPORDParagraph(BaseModel):
    """Single OPORD paragraph per FM 6-0, Appendix C."""
    paragraph_num: str = Field(..., description="e.g., 1.a., 3.b.(1)")
    title: str
    text: str


class OPORDFragment(BaseModel):
    """Step 7: Orders Production output per FM 6-0, Appendix C."""
    step_name: str = "ORDERS_PRODUCTION"
    situation: List[OPORDParagraph]
    mission: List[OPORDParagraph]
    execution: List[OPORDParagraph]
    sustainment: List[OPORDParagraph]
    command_and_signal: List[OPORDParagraph]
    citations: List[DoctrineCitation]


class MDMPOutput(BaseModel):
    """Complete MDMP pipeline output."""
    run_id: str
    receipt: ReceiptOfMissionResult
    mission_analysis: MissionAnalysisResult
    coas: List[COA]
    coa_analyses: List[COAAnalysisResult]
    coa_comparisons: List[COAComparisonResult]
    approval: COAApprovalResult
    opord: OPORDFragment
