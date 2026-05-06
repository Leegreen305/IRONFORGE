"""
Step 5: COA Comparison

Scores each COA against decision criteria weighted by mission type per FM 6-0, para 9-117.
"""

from typing import List
from ironforge.base_classes import DoctrineCitation
from ironforge.constants import DOCTRINE_CITATIONS, DEFAULT_WEIGHTS
from ironforge.enums import MissionType
from mdmp.models import COA, COAComparisonResult, CriterionScore


def coa_comparison(coa: COA, mission_type: MissionType, analyses: List) -> COAComparisonResult:
    """
    Score a single COA against the six doctrinal decision criteria using mission-type weights.
    """
    weights = DEFAULT_WEIGHTS.get(
        mission_type.value, DEFAULT_WEIGHTS["OFFENSE"])
    scores: List[CriterionScore] = []
    total = 0.0

    for criterion, weight in weights.items():
        raw, rationale = _score_criterion(coa, criterion, analyses)
        weighted = raw * weight
        total += weighted
        scores.append(CriterionScore(
            criterion=criterion,
            raw_score=raw,
            weight=weight,
            weighted_score=round(weighted, 2),
            rationale=rationale,
        ))

    citations = [
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="9-117",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="9-118",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
    ]

    return COAComparisonResult(
        coa_id=coa.coa_id,
        scores=scores,
        total_score=round(total, 2),
        rank=0,
        citations=citations,
    )


def _score_criterion(coa: COA, criterion: str, analyses: List) -> tuple:
    """Return a raw score 1-5 and rationale for a given criterion."""
    desc = coa.description.lower()
    name = coa.name.lower()

    if criterion == "maneuverability":
        if "flank" in name or "envelopment" in desc or "mobile" in name:
            return 5, "Maximizes freedom of movement and avoids enemy strength."
        if "frontal" in name or "strongpoint" in name:
            return 2, "Limited maneuver; relies on direct approach or static defense."
        return 3, "Standard maneuver with some constraints."

    if criterion == "firepower":
        if "fires" in name or "kinetic" in desc:
            return 5, "Maximizes application of joint fires and precision effects."
        if "non-kinetic" in desc or "isolation" in desc:
            return 2, "Reduced kinetic firepower; relies on non-lethal effects."
        return 4, "Adequate fires integration for mission type."

    if criterion == "protection":
        if "defense in depth" in name or "strongpoint" in name:
            return 5, "Maximizes force protection through layered defense or fortification."
        if "raid" in name or "frontal" in name:
            return 2, "High exposure to enemy fires during execution."
        return 3, "Balanced protection through dispersion and cover."

    if criterion == "surprise":
        if "flank" in name or "envelopment" in desc or "raid" in name:
            return 5, "High potential for achieving surprise through indirect approach."
        if "frontal" in name or "strongpoint" in name:
            return 1, "Low surprise; enemy expects direct contact."
        return 3, "Some potential for tactical surprise."

    if criterion == "simplicity":
        if "frontal" in name or "strongpoint" in name:
            return 5, "Simple to understand and execute; minimal synchronization requirements."
        if "envelopment" in desc or "mobile" in name:
            return 3, "Requires complex timing and coordination between multiple elements."
        return 4, "Straightforward concept with manageable synchronization."

    if criterion == "sustainment":
        if "defense in depth" in name or "strongpoint" in name:
            return 4, "Prestocked supplies and short lines of communication."
        if "flank" in name or "envelopment" in desc:
            return 2, "Extended lines of communication increase sustainment risk."
        return 3, "Standard sustainment requirements."

    return 3, "Standard assessment."
