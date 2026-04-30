"""
Targeting Engine

Implements F2T2EA (Find, Fix, Track, Target, Engage, Assess) per FM 3-60, Chapter 2.
Engagement authority, ROE, CDE, and BDA fields per JP 3-60 and CJCSI 3160.01A.
"""

from typing import List, Optional
from pydantic import BaseModel, Field

from ironforge.base_classes import DoctrineCitation
from ironforge.constants import DOCTRINE_CITATIONS


class CDEAssessment(BaseModel):
    """
    Collateral Damage Estimation per CJCSI 3160.01A.
    Categories I-IV reflect increasing collateral damage risk thresholds.
    """
    category: str = Field(
        ...,
        description="CAT I (Minimal), CAT II (Low), CAT III (Moderate), CAT IV (High)",
    )
    methodology: str = "CJCSI 3160.01A — No-Strike and Restricted Target Lists"
    expected_casualties: Optional[int] = None
    notes: Optional[str] = None


class BDARecord(BaseModel):
    """
    Battle Damage Assessment per FM 3-60 §6-1 and JP 3-60 §IV-1.
    Three levels: Initial (IBDA), Updated (UBDA), Reattack Assessment.
    """
    level: str = Field(
        ...,
        description="INITIAL, UPDATED, or REATTACK_ASSESSMENT",
    )
    physical_damage: Optional[str] = Field(
        None, description="Physical effects on the target structure"
    )
    functional_damage: Optional[str] = Field(
        None, description="Degradation of target capability"
    )
    target_system_assessment: Optional[str] = Field(
        None, description="Effects on the broader enemy system"
    )
    reattack_required: bool = False
    assessor: Optional[str] = None


class TargetNomination(BaseModel):
    """
    Nominated target with full F2T2EA tracking and legal/ROE fields.

    Doctrine references:
    - FM 3-60 §2-1 (F2T2EA cycle)
    - FM 3-60 §4-8 (Positive Identification standards)
    - JP 3-60 §III-4 (Engagement authority)
    - JP 3-60 §III-6 (No-Strike and Restricted Target Lists)
    - CJCSI 3160.01A (CDE methodology)
    - CJCSI 5810.01D (LOAC implementation)
    """
    target_id: str
    name: str
    target_type: str
    priority: str = Field(
        ..., description="High Payoff Target (HPT), High Value Target (HVT), or TAI"
    )
    location_description: str
    desired_effect: str
    recommended_engagement: str

    # Kill chain status
    f2t2ea_status: str = Field(
        default="FIND",
        description="FIND, FIX, TRACK, TARGET, ENGAGE, ASSESS",
    )
    tst_eligible: bool = Field(
        False, description="Qualifies for Time-Sensitive Targeting track per FM 3-60 §5-1"
    )
    attack_timing: str = Field(
        default="On order",
        description="On order, On call, Immediate, or specific time window",
    )

    # Engagement authority — JP 3-60 §III-4
    engagement_authority: str = Field(
        default="CDR BCT",
        description="Authority level required: CDR BCT, CDR DIV, CDR Corps, JFC, SecDef, POTUS",
    )

    # Positive Identification — FM 3-60 §4-8
    pid_required: bool = True
    pid_confirmed: bool = False
    pid_method: Optional[str] = Field(
        None, description="Visual, SIGINT, HUMINT, pattern of life, or multi-source"
    )

    # ROE and legal
    roe_reference: str = Field(
        default="SROE Chapter 3",
        description="Applicable ROE authority: SROE Ch.3, LOAC, SOFA, mission-specific ROE",
    )
    roe_restrictions: List[str] = Field(
        default_factory=list,
        description="Specific ROE restrictions that apply to this target",
    )
    no_strike_deconflicted: bool = False

    # CDE — CJCSI 3160.01A
    cde: Optional[CDEAssessment] = None

    # BDA — FM 3-60 §6-1, JP 3-60 §IV-1
    bda_status: str = Field(
        default="PENDING",
        description="PENDING, INITIAL, UPDATED, REATTACK_ASSESSMENT, or COMPLETE",
    )
    bda_records: List[BDARecord] = Field(default_factory=list)

    citation: Optional[DoctrineCitation] = None


class TargetingEngine:
    """
    Runs the target nomination workflow per FM 3-60 and JP 3-60.
    """

    F2T2EA_SEQUENCE = ["FIND", "FIX", "TRACK", "TARGET", "ENGAGE", "ASSESS"]

    def nominate(self, target_data: dict) -> TargetNomination:
        """Nominate a target and populate doctrinal fields."""
        raw_cde = target_data.get("cde_category")
        cde = CDEAssessment(category=raw_cde) if raw_cde else CDEAssessment(category="CAT II")

        roe_restrictions: List[str] = target_data.get("roe_restrictions", [])
        if not roe_restrictions:
            if target_data.get("target_type", "").lower() in ["personnel", "vehicle", "c2"]:
                roe_restrictions = ["PID required before engagement", "LOAC compliance mandatory"]

        citation = DoctrineCitation(
            pub="FM 3-60",
            paragraph="2-1",
            title="The Targeting Process",
            url=DOCTRINE_CITATIONS["FM_3_60"]["url"],
        )

        return TargetNomination(
            target_id=target_data.get("target_id", "T-UNKNOWN"),
            name=target_data.get("name", "Unknown Target"),
            target_type=target_data.get("target_type", "UNKNOWN"),
            priority=target_data.get("priority", "TAI"),
            location_description=target_data.get("location_description", ""),
            desired_effect=target_data.get("desired_effect", "Neutralize"),
            recommended_engagement=target_data.get("recommended_engagement", "Field Artillery"),
            f2t2ea_status=target_data.get("f2t2ea_status", "FIND"),
            tst_eligible=target_data.get("tst_eligible", False),
            attack_timing=target_data.get("attack_timing", "On order"),
            engagement_authority=target_data.get("engagement_authority", "CDR BCT"),
            pid_required=target_data.get("pid_required", True),
            pid_confirmed=target_data.get("pid_confirmed", False),
            pid_method=target_data.get("pid_method"),
            roe_reference=target_data.get("roe_reference", "SROE Chapter 3"),
            roe_restrictions=roe_restrictions,
            no_strike_deconflicted=target_data.get("no_strike_deconflicted", False),
            cde=cde,
            bda_status=target_data.get("bda_status", "PENDING"),
            citation=citation,
        )

    def advance_f2t2ea(self, target: TargetNomination) -> TargetNomination:
        """Advance target one step through F2T2EA cycle."""
        try:
            current_idx = self.F2T2EA_SEQUENCE.index(target.f2t2ea_status)
            if current_idx < len(self.F2T2EA_SEQUENCE) - 1:
                target.f2t2ea_status = self.F2T2EA_SEQUENCE[current_idx + 1]
        except ValueError:
            pass
        return target

    def record_bda(
        self,
        target: TargetNomination,
        level: str,
        physical: str,
        functional: str,
        reattack: bool = False,
    ) -> TargetNomination:
        """Record a BDA entry per FM 3-60 §6-1."""
        bda = BDARecord(
            level=level,
            physical_damage=physical,
            functional_damage=functional,
            reattack_required=reattack,
        )
        target.bda_records.append(bda)
        target.bda_status = level if not reattack else "REATTACK_ASSESSMENT"
        if not reattack and level == "UPDATED":
            target.bda_status = "COMPLETE"
        return target
