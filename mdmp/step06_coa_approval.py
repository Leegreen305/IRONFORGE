"""
Step 6: COA Approval

Selects and formats the recommended COA with full justification per FM 6-0, paras 9-123 to 9-128.
"""

from typing import List
from ironforge.base_classes import DoctrineCitation
from ironforge.constants import DOCTRINE_CITATIONS
from mdmp.models import COA, COAComparisonResult, COAApprovalResult


def coa_approval(coas: List[COA], comparisons: List[COAComparisonResult]) -> COAApprovalResult:
    """
    Select the highest-scoring COA and produce approval justification.
    """
    ranked = sorted(comparisons, key=lambda c: c.total_score, reverse=True)
    for i, comp in enumerate(ranked, start=1):
        comp.rank = i

    recommended = ranked[0]
    recommended_coa = next(c for c in coas if c.coa_id == recommended.coa_id)

    justification_parts = [
        f"{recommended_coa.name} ({recommended.coa_id}) achieved the highest weighted score of {recommended.total_score}.",
        "This COA best balances the commander's decision criteria for the given mission type.",
        "Key advantages include: " +
        "; ".join(recommended_coa.shaping_operations[:2]) + ".",
        "Risk assessment: " + recommended_coa.risk_assessment,
    ]

    risk_acceptance = (
        "The commander accepts the risks identified in the COA analysis, "
        "noting that mitigation measures are incorporated into the execution paragraph."
    )

    criteria_summary = "; ".join(
        [f"{s.criterion}: {s.raw_score}/5 (weighted {s.weighted_score})" for s in recommended.scores]
    )

    citations = [
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="9-123",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="9-128",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
    ]

    return COAApprovalResult(
        recommended_coa_id=recommended.coa_id,
        recommended_coa_name=recommended_coa.name,
        justification=" ".join(justification_parts),
        risk_acceptance=risk_acceptance,
        decision_criteria_summary=criteria_summary,
        citations=citations,
    )
