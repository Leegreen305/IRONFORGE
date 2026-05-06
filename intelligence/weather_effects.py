"""
Weather Effects on Operations

Per FM 2-01.3, Appendix B: Weather effects on visibility, mobility, and soldier performance.
"""

from ironforge.base_classes import WeatherState
from ironforge.constants import PLANNING_FACTORS


class WeatherEffects:
    """Assess weather impact on operations."""

    def assess(self, weather: WeatherState) -> str:
        vis = weather.visibility_km
        if vis is None:
            vis = PLANNING_FACTORS["visibility_km"].get(
                weather.condition.value, 10)

        effects = []
        if vis < 3:
            effects.append(
                "Degraded visibility limits air operations and long-range direct fires.")
        if weather.condition.value in ["RAIN", "SNOW", "EXTREME_COLD"]:
            effects.append(
                "Adverse weather reduces mobility and increases maintenance requirements.")
        if weather.condition.value in ["EXTREME_HEAT"]:
            effects.append(
                "Extreme heat increases water consumption and risk of heat casualties.")
        if weather.condition.value in ["HIGH_WIND", "DUST"]:
            effects.append(
                "High winds and dust degrade rotary-wing and UAV operations.")

        if not effects:
            effects.append("Weather is favorable for all operation types.")

        return f"{weather.condition.value}: visibility {vis} km. " + " ".join(effects)
