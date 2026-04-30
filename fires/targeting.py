"""
Targeting Engine

Implements F2T2EA (Find, Fix, Track, Target, Engage, Assess) per FM 3-60, Chapter 2.
"""

from typing import List, Optional
from pydantic import BaseModel, Field

from ironforge.base_classes import DoctrineCitation
from ironforge.constants import DOCTRINE_CITATIONS


class TargetNomination(BaseModel):
    """A nominated target with F2T2EA status."""
    target_id: str
    name: str
    target_type: str
    priority: str = Field(...,
                          description="High Payoff Target, High Value Target, or TAI")
    location_description: str
    desired_effect: str
    recommended_engagement: str
    f2t2ea_status: str = Field(
        default="FIND", description="FIND, FIX, TRACK, TARGET, ENGAGE, ASSESS")
    citation: Optional[DoctrineCitation] = None


class TargetingEngine:
    """Runs the target nomination workflow."""

    def nominate(self, target_data: dict) -> TargetNomination:
        """Nominate a target from raw data."""
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
            recommended_engagement=target_data.get(
                "recommended_engagement", "Field Artillery"),
            f2t2ea_status=target_data.get("f2t2ea_status", "FIND"),
            citation=citation,
        )

    def process_f2t2ea(self, target: TargetNomination, new_status: str) -> TargetNomination:
        """Advance a target through the F2T2EA kill chain."""
        valid = ["FIND", "FIX", "TRACK", "TARGET", "ENGAGE", "ASSESS"]
        if new_status not in valid:
            raise ValueError(f"Invalid F2T2EA status: {new_status}")
        target.f2t2ea_status = new_status
        return target
