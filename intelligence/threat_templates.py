"""
Threat Course of Action Templates

Per FM 2-01.3, Chapter 3: Threat models and templates based on published enemy doctrine.
"""

from typing import List
from ironforge.base_classes import ThreatModel
from ironforge.enums import ThreatCategory


class ThreatTemplateLibrary:
    """Provides doctrinal threat COA templates."""

    def evaluate(self, threat: ThreatModel) -> str:
        return (
            f"{threat.name} is a {threat.threat_category.value} threat with "
            f"estimated strength {threat.strength_estimate}. Disposition: {threat.disposition}."
        )

    def likely_coas(self, threat: ThreatModel) -> List[str]:
        if threat.most_likely_coa:
            return [f"Most Likely: {threat.most_likely_coa}", f"Most Dangerous: {threat.most_dangerous_coa or 'Unknown'}"]

        tc = threat.threat_category
        if tc == ThreatCategory.PEER_NEAR_PEER:
            return [
                "Most Likely: Combined arms breach with follow-on exploitation force.",
                "Most Dangerous: Massed fires suppression followed by armored penetration.",
            ]
        elif tc == ThreatCategory.IRREGULAR:
            return [
                "Most Likely: IED emplacement and ambush along supply routes.",
                "Most Dangerous: Complex attack with indirect fires and swarm tactics.",
            ]
        elif tc == ThreatCategory.HYBRID:
            return [
                "Most Likely: Conventional attack supported by cyber disruption.",
                "Most Dangerous: Simultaneous multi-domain attack on C2 and logistics nodes.",
            ]
        else:
            return [
                "Most Likely: Standard doctrinal attack along expected axis.",
                "Most Dangerous: Unconventional attack exploiting friendly weakness.",
            ]
