"""
Doctrinal constants and planning factors for IRONFORGE.

All values derived from publicly available U.S. Army and Joint publications.
"""

from typing import Dict, Any

DOCTRINE_CITATIONS: Dict[str, Dict[str, str]] = {
    "FM_6_0": {
        "title": "Commander and Staff Organization and Operations",
        "pub_num": "FM 6-0",
        "date": "May 2014",
        "url": "https://armypubs.army.mil/epubs/DR_pubs/DR_a/pdf/web/fm6_0.pdf",
    },
    "FM_3_60": {
        "title": "The Targeting Process",
        "pub_num": "FM 3-60",
        "date": "November 2023",
        "url": "https://armypubs.army.mil/epubs/DR_pubs/DR_a/pdf/web/fm3_60.pdf",
    },
    "FM_2_01_3": {
        "title": "Intelligence Preparation of the Battlefield",
        "pub_num": "FM 2-01.3",
        "date": "July 2009",
        "url": "https://armypubs.army.mil/epubs/DR_pubs/DR_a/pdf/web/fm2_01x3.pdf",
    },
    "FM_3_09": {
        "title": "Fire Support and Field Artillery Operations",
        "pub_num": "FM 3-09",
        "date": "April 2023",
        "url": "https://armypubs.army.mil/epubs/DR_pubs/DR_a/pdf/web/fm3_09.pdf",
    },
    "ADRP_5_0": {
        "title": "The Operations Process",
        "pub_num": "ADRP 5-0",
        "date": "May 2012",
        "url": "https://armypubs.army.mil/epubs/DR_pubs/DR_a/pdf/web/adrp5_0.pdf",
    },
    "JP_3_0": {
        "title": "Joint Operations",
        "pub_num": "JP 3-0",
        "date": "June 2022",
        "url": "https://www.jcs.mil/Doctrine/Joint-Publications/JP-3-0/",
    },
    "JP_3_60": {
        "title": "Joint Targeting",
        "pub_num": "JP 3-60",
        "date": "April 2018",
        "url": "https://www.jcs.mil/Doctrine/Joint-Publications/JP-3-60/",
    },
    "TRADOC_P525_3_1": {
        "title": "The U.S. Army in Multi-Domain Operations",
        "pub_num": "TRADOC Pamphlet 525-3-1",
        "date": "December 2018",
        "url": "https://adminpubs.tradoc.army.mil/pamphlets/TP525-3-1.pdf",
    },
    "RAND_AI_MDMP": {
        "title": "Artificial Intelligence and Military Decision Making",
        "pub_num": "RAND Arroyo Center Research Report",
        "date": "2021",
        "url": "https://www.rand.org/pubs/research_reports/RRA739-1.html",
    },
}

# Planning factors derived from FM 6-0, FM 3-09, and JP 3-0.
PLANNING_FACTORS: Dict[str, Any] = {
    "movement_rates": {
        "dismounted_infantry_km_hr": 4,
        "mounted_infantry_road_km_hr": 40,
        "mounted_infantry_cross_country_km_hr": 20,
        "armor_road_km_hr": 50,
        "armor_cross_country_km_hr": 30,
        "helicopter_cruise_knots": 120,
        "fixed_wing_cruise_knots": 450,
    },
    "fuel_consumption": {
        "tank_gal_per_km": 1.5,
        "bradley_gal_per_km": 1.2,
        "stryker_gal_per_km": 0.6,
        "humvee_gal_per_km": 0.3,
        "helicopter_gal_per_hour": 200,
    },
    "ammo_planning_factors": {
        "artillery_rounds_per_tube_per_day": 200,
        "small_arms_rounds_per_soldier_per_day": 150,
        "tank_main_gun_rounds_per_day": 40,
    },
    "time_standards": {
        "mdmp_hasty_hours": 2,
        "mdmp_deliberate_hours": 24,
        "warno_minutes": 30,
        "frago_minutes": 15,
    },
    "visibility_km": {
        "CLEAR": 10,
        "PARTLY_CLOUDY": 8,
        "OVERCAST": 6,
        "RAIN": 4,
        "SNOW": 2,
        "FOG": 1,
        "DUST": 3,
        "HIGH_WIND": 8,
        "EXTREME_HEAT": 10,
        "EXTREME_COLD": 8,
    },
}

# Default decision criteria weights by mission type per FM 6-0, Table 9-2.
DEFAULT_WEIGHTS: Dict[str, Dict[str, float]] = {
    "OFFENSE": {
        "maneuverability": 0.25,
        "firepower": 0.25,
        "protection": 0.15,
        "surprise": 0.20,
        "simplicity": 0.10,
        "sustainment": 0.05,
    },
    "DEFENSE": {
        "maneuverability": 0.15,
        "firepower": 0.25,
        "protection": 0.30,
        "surprise": 0.10,
        "simplicity": 0.10,
        "sustainment": 0.10,
    },
    "STABILITY": {
        "maneuverability": 0.10,
        "firepower": 0.10,
        "protection": 0.20,
        "surprise": 0.05,
        "simplicity": 0.25,
        "sustainment": 0.30,
    },
    "DEFENSE_SUPPORT_OF_CIVIL_AUTHORITIES": {
        "maneuverability": 0.15,
        "firepower": 0.05,
        "protection": 0.25,
        "surprise": 0.05,
        "simplicity": 0.30,
        "sustainment": 0.20,
    },
    "HUMANITARIAN_ASSISTANCE": {
        "maneuverability": 0.10,
        "firepower": 0.05,
        "protection": 0.15,
        "surprise": 0.05,
        "simplicity": 0.30,
        "sustainment": 0.35,
    },
    "PEACEKEEPING": {
        "maneuverability": 0.10,
        "firepower": 0.05,
        "protection": 0.25,
        "surprise": 0.05,
        "simplicity": 0.30,
        "sustainment": 0.25,
    },
    "COUNTER_INSURGENCY": {
        "maneuverability": 0.20,
        "firepower": 0.20,
        "protection": 0.20,
        "surprise": 0.15,
        "simplicity": 0.10,
        "sustainment": 0.15,
    },
    "TARGETING": {
        "maneuverability": 0.10,
        "firepower": 0.30,
        "protection": 0.10,
        "surprise": 0.25,
        "simplicity": 0.15,
        "sustainment": 0.10,
    },
}
