"""
Step 7: Orders Production

Generates a structured OPORD fragment with proper paragraph numbering per FM 6-0, Appendix C.
"""

from typing import List
from ironforge.base_classes import DoctrineCitation
from ironforge.constants import DOCTRINE_CITATIONS
from mdmp.models import (
    COA,
    COAApprovalResult,
    MissionAnalysisResult,
    OPORDFragment,
    OPORDParagraph,
)


def orders_production(
    coa: COA,
    approval: COAApprovalResult,
    mission_analysis: MissionAnalysisResult,
) -> OPORDFragment:
    """
    Produce a structured OPORD fragment based on the approved COA.
    """
    situation = _build_situation(mission_analysis)
    mission = _build_mission(mission_analysis)
    execution = _build_execution(coa)
    sustainment = _build_sustainment(coa)
    command_and_signal = _build_command_and_signal(coa)

    citations = [
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="C-1",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="C-7",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
    ]

    return OPORDFragment(
        situation=situation,
        mission=mission,
        execution=execution,
        sustainment=sustainment,
        command_and_signal=command_and_signal,
        citations=citations,
    )


def _build_situation(ma: MissionAnalysisResult) -> List[OPORDParagraph]:
    return [
        OPORDParagraph(paragraph_num="1.a.",
                       title="Enemy Forces", text=ma.mett_tc.enemy),
        OPORDParagraph(paragraph_num="1.b.", title="Friendly Forces",
                       text=ma.mett_tc.troops_and_support_available),
        OPORDParagraph(paragraph_num="1.c.", title="Attachments and Detachments",
                       text="As per current task organization."),
    ]


def _build_mission(ma: MissionAnalysisResult) -> List[OPORDParagraph]:
    return [
        OPORDParagraph(paragraph_num="2.", title="Mission",
                       text=ma.restated_mission),
    ]


def _build_execution(coa: COA) -> List[OPORDParagraph]:
    paragraphs = [
        OPORDParagraph(paragraph_num="3.a.", title="Commander's Intent",
                       text="Defeat the enemy and retain the initiative."),
        OPORDParagraph(paragraph_num="3.b.",
                       title="Concept of Operations", text=coa.description),
        OPORDParagraph(paragraph_num="3.b.(1)",
                       title="Decisive Operation", text=coa.decisive_operation),
    ]
    for i, shaping in enumerate(coa.shaping_operations, start=2):
        paragraphs.append(OPORDParagraph(
            paragraph_num=f"3.b.({i})",
            title=f"Shaping Operation {i-1}",
            text=shaping,
        ))
    if coa.sustaining_operation:
        paragraphs.append(OPORDParagraph(
            paragraph_num=f"3.b.({len(coa.shaping_operations)+2})",
            title="Sustaining Operation",
            text=coa.sustaining_operation,
        ))
    paragraphs.append(OPORDParagraph(paragraph_num="3.c.", title="Tasks to Maneuver Units",
                      text="As per unit task organization and concept of operations."))
    paragraphs.append(OPORDParagraph(paragraph_num="3.d.", title="Tasks to Combat Support",
                      text="Fires, engineer, and intelligence support as coordinated."))
    paragraphs.append(OPORDParagraph(paragraph_num="3.e.", title="Coordination Instructions",
                      text="Report readiness NLT H-2. Maintain digital connectivity throughout operation."))
    return paragraphs


def _build_sustainment(coa: COA) -> List[OPORDParagraph]:
    return [
        OPORDParagraph(paragraph_num="4.a.", title="Logistics",
                       text="Sustainment follows approved COA. Priority of support to decisive operation."),
        OPORDParagraph(paragraph_num="4.b.", title="Personnel",
                       text="Casualty evacuation via standard routes. Replacements held at brigade support area."),
        OPORDParagraph(paragraph_num="4.c.", title="Medical",
                       text="Role 2 medical treatment team colocated with brigade support area."),
    ]


def _build_command_and_signal(coa: COA) -> List[OPORDParagraph]:
    return [
        OPORDParagraph(paragraph_num="5.a.", title="Command",
                       text="Commander located with main effort. Succession of command per unit SOP."),
        OPORDParagraph(paragraph_num="5.b.", title="Signal",
                       text="Primary: FM voice and digital. Alternate: Messenger. Contingency: Satellite communications. Emergency: Visual signals per SOI."),
    ]
