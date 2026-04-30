"""
Fire Support Coordination Measures (FSCM)

Per FM 3-09, Chapter 5: FSCMs facilitate the rapid engagement of targets and
provide safeguards for friendly forces.
"""

from typing import List
from pydantic import BaseModel


class FSCM(BaseModel):
    """Single fire support coordination measure."""
    name: str
    type: str
    description: str
    coordinates: List[str] = []


class FireSupportCoordinationMeasures:
    """Manages FSCMs for an operation."""

    def __init__(self):
        self.measures: List[FSCM] = []

    def add_measure(self, name: str, measure_type: str, description: str, coordinates: List[str] = None):
        self.measures.append(FSCM(
            name=name,
            type=measure_type,
            description=description,
            coordinates=coordinates or [],
        ))

    def list_measures(self) -> List[FSCM]:
        return self.measures

    def standard_offensive_measures(self):
        self.add_measure(
            name="COORDINATED FIRE LINE (CFL)",
            measure_type="CFL",
            description="Short of the CFL, all fires must be coordinated with maneuver commander.",
        )
        self.add_measure(
            name="FIRE SUPPORT COORDINATION LINE (FSCL)",
            measure_type="FSCL",
            description="Beyond the FSCL, fires are conducted without coordination with ground maneuver commander.",
        )

    def standard_defensive_measures(self):
        self.add_measure(
            name="NO-FIRE AREA (NFA)",
            measure_type="NFA",
            description="Area in which no fires or effects of fires are allowed.",
        )
        self.add_measure(
            name="RESTRICTIVE FIRE AREA (RFA)",
            measure_type="RFA",
            description="Area with specific restrictions into which fires exceeding those restrictions will not be delivered.",
        )
