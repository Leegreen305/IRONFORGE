"""
Terrain Analysis

Per FM 2-01.3, Chapter 2: Terrain analysis includes observation and fields of fire,
cover and concealment, obstacles, key terrain, and avenues of approach (OCOKA).
"""

from typing import List
from ironforge.base_classes import TerrainFeature


class TerrainAnalyzer:
    """Analyzes terrain using OCOKA."""

    def identify_key_terrain(self, terrain: List[TerrainFeature]) -> List[TerrainFeature]:
        """Return terrain features marked as key terrain or inferred from type."""
        key = []
        for t in terrain:
            if t.is_key_terrain:
                key.append(t)
            elif t.terrain_type.value in ["URBAN", "MOUNTAIN", "RIVERINE"]:
                key.append(t)
        return key

    def avenues_of_approach(self, terrain: List[TerrainFeature]) -> List[str]:
        """Infer avenues of approach from terrain features."""
        aoa = []
        for t in terrain:
            if t.avenues_of_approach:
                aoa.extend(t.avenues_of_approach)
            else:
                if t.terrain_type.value == "OPEN":
                    aoa.append(f"Unrestricted avenue through {t.name}")
                elif t.terrain_type.value == "RESTRICTED":
                    aoa.append(f"Restricted avenue through {t.name}")
                elif t.terrain_type.value == "SEVERELY_RESTRICTED":
                    aoa.append(f"Severely restricted avenue through {t.name}")
        return aoa
