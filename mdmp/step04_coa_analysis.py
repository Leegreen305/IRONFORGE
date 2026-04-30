"""
Step 4: COA Analysis (Wargaming)

Wargames each COA against likely enemy responses using structured
action/reaction/counteraction methodology per FM 6-0, paras 9-96 to 9-116.
"""

from typing import List
from ironforge.base_classes import Scenario, DoctrineCitation
from ironforge.constants import DOCTRINE_CITATIONS
from mdmp.models import COA, COAAnalysisResult, WargameSequence


def coa_analysis(coa: COA, scenario: Scenario) -> COAAnalysisResult:
    """
    Wargame a single COA against the most likely and most dangerous enemy COAs.
    """
    mt = scenario.mission_type.value
    enemy_ml = "Enemy conducts hasty defense with counterattack reserve."
    enemy_md = "Enemy conducts deliberate defense with deep fires and obstacles."
    if scenario.enemy_force:
        e = scenario.enemy_force[0]
        if e.most_likely_coa:
            enemy_ml = e.most_likely_coa
        if e.most_dangerous_coa:
            enemy_md = e.most_dangerous_coa

    sequences = _generate_wargame_sequences(coa, mt, enemy_ml, enemy_md)
    strengths, weaknesses, hazards = _assess_coa(coa, scenario)

    citations = [
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="9-105",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="9-108",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
    ]

    return COAAnalysisResult(
        coa_id=coa.coa_id,
        wargame_sequences=sequences,
        strengths=strengths,
        weaknesses=weaknesses,
        hazards=hazards,
        branches=[f"Branch: Enemy shifts to {enemy_md}"],
        sequels=["Sequel: Exploit success and continue attack.",
                 "Sequel: Transition to defense on objective."],
        overall_assessment=f"{coa.name} is viable against most likely enemy COA. "
        f"Risk increases if enemy executes most dangerous COA.",
        citations=citations,
    )


def _generate_wargame_sequences(coa: COA, mission_type: str, enemy_ml: str, enemy_md: str) -> List[WargameSequence]:
    sequences = []
    if mission_type == "OFFENSE":
        sequences.append(WargameSequence(
            sequence_num=1,
            friendly_action="Friendly reconnaissance confirms enemy disposition and obstacle locations.",
            enemy_reaction="Enemy maintains security and reports friendly reconnaissance contact.",
            friendly_counteraction="Adjust scheme of maneuver based on real-time ISR feed.",
            outcome="Friendly force has accurate enemy template; enemy is alerted but not fully prepared.",
            key_decision="Commander confirms H-hour based on readiness and weather.",
        ))
        sequences.append(WargameSequence(
            sequence_num=2,
            friendly_action=coa.decisive_operation,
            enemy_reaction=enemy_ml,
            friendly_counteraction="Shift priority of fires to suppress enemy strongpoint; commit reserve if penetration stalls.",
            outcome="Friendly force secures initial objective with moderate casualties.",
            key_decision="Commander commits reserve to maintain momentum.",
        ))
    elif mission_type == "DEFENSE":
        sequences.append(WargameSequence(
            sequence_num=1,
            friendly_action="Security force makes contact with enemy reconnaissance and destroys forward elements.",
            enemy_reaction="Enemy adjusts main effort based on security force resistance.",
            friendly_counteraction="Commander shifts indirect fires to adjusted enemy main effort axis.",
            outcome="Enemy main effort is delayed and channeled into engagement area.",
            key_decision="Commander confirms engagement area triggers and obstacle breach denial.",
        ))
        sequences.append(WargameSequence(
            sequence_num=2,
            friendly_action="Main battle area engages enemy with direct and indirect fires.",
            enemy_reaction=enemy_ml,
            friendly_counteraction="Commit reserve to counterattack enemy flank as they become fixed.",
            outcome="Enemy attack is repulsed; friendly force retains key terrain.",
            key_decision="Commander initiates counterattack at optimal moment.",
        ))
    else:
        sequences.append(WargameSequence(
            sequence_num=1,
            friendly_action=f"Friendly force executes {coa.decisive_operation}.",
            enemy_reaction=enemy_ml,
            friendly_counteraction="Friendly commander adjusts based on enemy reaction.",
            outcome="Mission progresses with manageable risk.",
            key_decision="Commander approves continuation or branches to sequel.",
        ))
    return sequences


def _assess_coa(coa: COA, scenario: Scenario) -> tuple:
    strengths = []
    weaknesses = []
    hazards = []

    if "Fires" in coa.name or "fires" in coa.description:
        strengths.append(
            "Heavy reliance on fires provides standoff and shock effect.")
    if "Flank" in coa.name or "envelopment" in coa.description.lower():
        strengths.append("Avoids enemy strength; exploits weakness.")
    if "Defense in Depth" in coa.name:
        strengths.append(
            "Absorbs enemy momentum and creates counterattack opportunities.")

    if "frontal" in coa.description.lower():
        weaknesses.append(
            "Frontal attack exposes force to enemy massed fires.")
    if "strongpoint" in coa.description.lower():
        weaknesses.append("Strongpoint can be bypassed, isolating defenders.")
    if "raid" in coa.description.lower():
        weaknesses.append(
            "Raid requires precise timing; exfiltration is high risk.")

    if scenario.weather:
        if scenario.weather.condition.value in ["RAIN", "SNOW", "FOG", "DUST"]:
            hazards.append(
                "Adverse weather degrades visibility and air support.")
    if scenario.terrain:
        for t in scenario.terrain:
            if t.terrain_type.value in ["MOUNTAIN", "URBAN", "RIVERINE"]:
                hazards.append(
                    f"{t.terrain_type.value.lower()} terrain complicates movement and sustainment.")

    if not strengths:
        strengths.append("Doctrinally sound with clear decisive operation.")
    if not weaknesses:
        weaknesses.append("Standard risks inherent to the mission type.")
    if not hazards:
        hazards.append("No additional environmental hazards identified.")

    return strengths, weaknesses, hazards
