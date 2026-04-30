"""
Step 1: Receipt of Mission

Parses and classifies the incoming scenario per FM 6-0, para 9-20.
"""

from ironforge.constants import DOCTRINE_CITATIONS
from typing import List
from ironforge.base_classes import Scenario, DoctrineCitation
from ironforge.constants import PLANNING_FACTORS
from mdmp.models import ReceiptOfMissionResult


def receipt_of_mission(scenario: Scenario) -> ReceiptOfMissionResult:
    """
    Analyze the incoming scenario to determine mission classification,
    time available, and initial key tasks.
    """
    time_available = scenario.time_available or "unknown"
    time_hours = _parse_time_hours(time_available)

    if time_hours is not None and time_hours <= PLANNING_FACTORS["time_standards"]["mdmp_hasty_hours"]:
        classification = "hasty"
    elif time_hours is not None and time_hours >= PLANNING_FACTORS["time_standards"]["mdmp_deliberate_hours"]:
        classification = "deliberate"
    else:
        classification = "crisis_action"

    key_tasks = _extract_key_tasks(scenario)

    citations = [
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="9-20",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="9-21",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
    ]

    return ReceiptOfMissionResult(
        mission_type=scenario.mission_type,
        classification=classification,
        time_available_hours=time_hours,
        initial_assessment=f"{classification.upper()} mission received. Time available: {time_available}. "
        f"Friendly force consists of {len(scenario.friendly_force)} units. "
        f"Enemy force estimated at {len(scenario.enemy_force or [])} threat elements.",
        key_tasks_identified=key_tasks,
        citations=citations,
    )


def _parse_time_hours(time_str: str) -> float:
    if not time_str or time_str.lower() == "unknown":
        return 24.0
    time_str = time_str.lower().replace("hours", "hr").replace("hour", "hr")
    try:
        if "hr" in time_str:
            return float(time_str.split("hr")[0].strip())
        if "min" in time_str:
            return float(time_str.split("min")[0].strip()) / 60.0
        if "day" in time_str:
            return float(time_str.split("day")[0].strip()) * 24.0
        return float(time_str)
    except ValueError:
        return 24.0


def _extract_key_tasks(scenario: Scenario) -> List[str]:
    tasks = []
    if scenario.mission_type.value == "OFFENSE":
        tasks.append("Conduct movement to contact")
        tasks.append("Develop the situation")
        tasks.append("Fix the enemy")
        tasks.append("Decisively engage")
    elif scenario.mission_type.value == "DEFENSE":
        tasks.append("Establish security area")
        tasks.append("Allocate combat power to main battle area")
        tasks.append("Maintain reserve")
        tasks.append("Plan counterattack options")
    elif scenario.mission_type.value == "STABILITY":
        tasks.append("Establish civil security")
        tasks.append("Restore essential services")
        tasks.append("Support governance")
    elif scenario.mission_type.value == "TARGETING":
        tasks.append("Detect and locate high-value target")
        tasks.append("Develop targeting solution")
        tasks.append("Engage with appropriate capability")
        tasks.append("Assess effects")
    else:
        tasks.append("Conduct mission analysis")
        tasks.append("Develop courses of action")
        tasks.append("Issue warning order")
    return tasks
