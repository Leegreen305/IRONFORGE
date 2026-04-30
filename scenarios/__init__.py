"""
Scenarios Package — Pre-built demonstration scenarios for IRONFORGE.
"""

import json
import os
from typing import Dict
from ironforge.base_classes import Scenario


def load_scenario(name: str) -> Scenario:
    """Load a pre-built scenario by file name (without .json)."""
    path = os.path.join(os.path.dirname(__file__), f"{name}.json")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return Scenario(**data)


def list_scenarios() -> Dict[str, str]:
    """List available scenario names and titles."""
    return {
        "time_sensitive_targeting": "Time Sensitive Targeting of a High Value Individual",
        "brigade_defense_peer_threat": "Brigade Defense Against a Peer Threat Armored Assault",
        "cyber_physical_fob": "Cyber-Physical Attack on a Forward Operating Base",
        "contested_airspace_cas": "Contested Airspace Close Air Support Request",
        "multi_domain_strike": "Multi-Domain Strike Coordination",
    }
