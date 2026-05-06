"""
Step 2: Mission Analysis

Extracts METT-TC factors and restates the mission per FM 6-0, paras 9-29 to 9-77.
"""

from typing import List
from ironforge.base_classes import Scenario, DoctrineCitation
from ironforge.constants import DOCTRINE_CITATIONS
from mdmp.models import MissionAnalysisResult, METTTC


def mission_analysis(scenario: Scenario) -> MissionAnalysisResult:
    """
    Perform mission analysis including METT-TC, specified/implied/essential tasks,
    and restated mission.
    """
    mett_tc = _build_mett_tc(scenario)
    specified = _specified_tasks(scenario)
    implied = _implied_tasks(scenario, specified)
    essential = _essential_tasks(specified, implied)
    restated = _restated_mission(scenario, essential)

    citations = [
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="9-32",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="9-45",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="9-55",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
    ]

    return MissionAnalysisResult(
        mett_tc=mett_tc,
        specified_tasks=specified,
        implied_tasks=implied,
        essential_tasks=essential,
        restated_mission=restated,
        commander_intent_summary=scenario.higher_intent,
        planning_guidance=f"Conduct {scenario.mission_type.value.lower()} operations "
        f"with available forces within {scenario.time_available or 'allocated time'}.",
        citations=citations,
    )


def _build_mett_tc(scenario: Scenario) -> METTTC:
    enemy_summary = "No enemy forces identified."
    if scenario.enemy_force:
        enemy_summary = "; ".join(
            [f"{e.name} ({e.threat_category.value}, {e.strength_estimate})" for e in scenario.enemy_force]
        )

    terrain_summary = "No terrain data."
    if scenario.terrain:
        terrain_summary = "; ".join(
            [f"{t.name} ({t.terrain_type.value})" for t in scenario.terrain]
        )

    weather_summary = "No weather data."
    if scenario.weather:
        w = scenario.weather
        weather_summary = f"{w.condition.value}, visibility {w.visibility_km or 'unknown'} km"

    troops_summary = f"{len(scenario.friendly_force)} friendly units: " + ", ".join(
        [u.name for u in scenario.friendly_force]
    )

    civil_summary = "None identified."
    if scenario.civil_considerations:
        civil_summary = "; ".join(scenario.civil_considerations)

    return METTTC(
        mission=scenario.description,
        enemy=enemy_summary,
        terrain_and_weather=f"{terrain_summary}; {weather_summary}",
        troops_and_support_available=troops_summary,
        time_available=scenario.time_available or "unknown",
        civil_considerations=civil_summary,
    )


def _specified_tasks(scenario: Scenario) -> List[str]:
    tasks = []
    tasks.append(
        f"Conduct {scenario.mission_type.value.lower()} operations as described.")
    if scenario.restrictions:
        for r in scenario.restrictions:
            tasks.append(f"Adhere to restriction: {r}")
    return tasks


def _implied_tasks(scenario: Scenario, specified: List[str]) -> List[str]:
    tasks = []
    mt = scenario.mission_type.value
    if mt == "OFFENSE":
        tasks.append("Coordinate fires and maneuver")
        tasks.append("Establish breach sites if obstacles encountered")
    elif mt == "DEFENSE":
        tasks.append("Prepare obstacles and fortifications")
        tasks.append("Coordinate engagement areas with indirect fires")
    elif mt == "TARGETING":
        tasks.append("Conduct target development and validation")
        tasks.append("Coordinate collection assets for BDA")
    elif mt == "STABILITY":
        tasks.append("Coordinate with host nation security forces")
        tasks.append("Establish civil-military operations center")
    else:
        tasks.append("Coordinate with adjacent units")
        tasks.append("Establish sustainment lines of communication")
    return tasks


def _essential_tasks(specified: List[str], implied: List[str]) -> List[str]:
    combined = specified + implied
    return combined[:3] if len(combined) > 3 else combined


def _restated_mission(scenario: Scenario, essential: List[str]) -> str:
    who = " and ".join([u.name for u in scenario.friendly_force[:2]])
    what = scenario.mission_type.value.lower()
    where = "in the assigned area of operations"
    if scenario.terrain and scenario.terrain[0].coordinates:
        where = f"in the vicinity of {scenario.terrain[0].name}"
    when = f"NLT {scenario.time_available or 'mission complete'}"
    why = scenario.higher_intent or "to accomplish the commander's intent"
    return f"{who} {what}s {where} {when} in order to {why}."
