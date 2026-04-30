"""
Named Area of Interest (NAI) Generator

Per FM 2-01.3, para 3-45: NAIs are geographical areas where information and intelligence
are required to satisfy a specific information requirement.
"""

from typing import List
from ironforge.base_classes import TerrainFeature, ThreatModel


class NAIGenerator:
    """Generate NAIs based on terrain and threat models."""

    def generate(self, terrain: List[TerrainFeature], threats: List[ThreatModel]) -> List[str]:
        nais = []
        for t in terrain:
            if t.is_key_terrain:
                nais.append(
                    f"NAI-KT: {t.name} — monitor for enemy occupation or bypass.")
            if t.terrain_type.value in ["URBAN", "MOUNTAIN", "RIVERINE"]:
                nais.append(
                    f"NAI-TERRAIN: {t.name} — assess mobility and obstacle status.")
        for th in threats:
            nais.append(
                f"NAI-THREAT: {th.name} assembly area or logistics node.")
        if not nais:
            nais.append(
                "NAI-GENERAL: Primary axis of advance and likely enemy engagement areas.")
        return nais
