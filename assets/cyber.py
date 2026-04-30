"""
Cyber and Electronic Warfare Asset Capability Models

Doctrinal planning factors sourced from:
- FM 3-12, Cyberspace and Electronic Warfare Operations (April 2017)
- ATP 3-36, Electronic Warfare Techniques (February 2019)
- TRADOC Pamphlet 525-3-1, The U.S. Army in Multi-Domain Operations (December 2018)
- JP 3-0, Joint Operations (June 2022)
"""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

from ironforge.base_classes import DoctrineCitation
from ironforge.constants import DOCTRINE_CITATIONS


class CyberEffectType(str, Enum):
    """Doctrinal cyber effect types per FM 3-12."""
    DEGRADE   = "DEGRADE"
    DISRUPT   = "DISRUPT"
    DESTROY   = "DESTROY"
    DENY      = "DENY"
    DECEIVE   = "DECEIVE"
    EXPLOIT   = "EXPLOIT"


class EWOperationType(str, Enum):
    """Electronic warfare operation types per ATP 3-36."""
    ELECTRONIC_ATTACK          = "ELECTRONIC_ATTACK"
    ELECTRONIC_PROTECTION      = "ELECTRONIC_PROTECTION"
    ELECTRONIC_WARFARE_SUPPORT = "ELECTRONIC_WARFARE_SUPPORT"


class CyberCapability(BaseModel):
    """
    Doctrinal cyber capability descriptor per FM 3-12.
    Represents publicly-described unclassified capability classes only.
    """
    name: str
    domain: str = Field(default="CYBERSPACE", description="Operational domain per JP 3-0")
    capability_class: str
    supported_effects: List[CyberEffectType]
    target_categories: List[str]
    planning_considerations: List[str]
    coordination_requirements: List[str]
    limitations: List[str]
    citations: List[DoctrineCitation]


class EWCapability(BaseModel):
    """
    Doctrinal electronic warfare capability descriptor per ATP 3-36.
    """
    system: str
    ew_type: EWOperationType
    frequency_range: Optional[str] = None
    effective_range_km: Optional[float] = None
    mission_profiles: List[str]
    planning_considerations: List[str]
    limitations: List[str]
    citations: List[DoctrineCitation]


# ── Cyber — Offensive Cyber Operations (OCO) ───────────────────────────────

OFFENSIVE_CYBER_OPERATIONS: CyberCapability = CyberCapability(
    name="Offensive Cyber Operations (OCO)",
    capability_class="Offensive",
    supported_effects=[
        CyberEffectType.DEGRADE,
        CyberEffectType.DISRUPT,
        CyberEffectType.DESTROY,
        CyberEffectType.DENY,
        CyberEffectType.DECEIVE,
    ],
    target_categories=[
        "Enemy C2 networks",
        "Industrial control systems (ICS/SCADA)",
        "Air defense system networks",
        "Logistics and sustainment networks",
        "Enemy communications infrastructure",
        "Financial systems supporting adversary",
    ],
    planning_considerations=[
        "All OCO require Title 10 / Title 50 legal authority and NSC-level approval",
        "Fires clearance equivalent required — deconflict with kinetic targeting",
        "Collateral damage estimate (CDE) mandatory for all OCO per DoD Law of War Manual",
        "Effect may not be immediately observable — BDA requires dedicated collection",
        "Time-sensitive actions require pre-planned access and pre-positioned tools",
        "Coordinate with J6 / G6 for fratricide prevention on shared networks",
        "Authorities delegation varies by effect type and geographic location",
    ],
    coordination_requirements=[
        "Joint Force Commander approval for effects beyond tactical boundary",
        "CCMD coordination for effects in cyberspace outside AO",
        "Deconfliction with NSA, CIA, and other IC members if applicable",
        "Intelligence community support for target development",
    ],
    limitations=[
        "Effects are not always reversible — assess permanence before execution",
        "Access development requires significant lead time (weeks to months)",
        "Sophisticated adversaries may detect and attribute operations",
        "Effects can propagate unintentionally across connected systems",
        "Not a substitute for kinetic effects against hardened physical targets",
    ],
    citations=[
        DoctrineCitation(
            pub="FM 3-12",
            paragraph="1-1",
            title="Cyberspace and Electronic Warfare Operations",
            url=None,
        ),
        DoctrineCitation(
            pub="JP 3-0",
            paragraph="III-14",
            title="Joint Operations — Cyberspace Operations",
            url=DOCTRINE_CITATIONS["JP_3_0"]["url"],
        ),
    ],
)

# ── Cyber — Defensive Cyber Operations (DCO) ───────────────────────────────

DEFENSIVE_CYBER_OPERATIONS: CyberCapability = CyberCapability(
    name="Defensive Cyber Operations (DCO)",
    capability_class="Defensive",
    supported_effects=[
        CyberEffectType.DENY,
        CyberEffectType.DEGRADE,
    ],
    target_categories=[
        "Own-force network infrastructure",
        "C2 systems and NIPRNET/SIPRNET segments",
        "Industrial control systems supporting installation",
        "Tactical data links and radios",
    ],
    planning_considerations=[
        "DCO-IDM (Internal Defensive Measures) is continuous and authoritative",
        "DCO-RA (Response Actions) requires JFC authorization",
        "Hunt-forward operations may require host-nation agreement",
        "Network defense frameworks must align with FRAGO and ISR taskings",
        "Cyber resilience planning integrates with PACE communications plan",
        "Zero-trust architecture principles apply at all classification levels",
    ],
    coordination_requirements=[
        "G6 / J6 network operations center (NOC) coordination",
        "ARCYBER situational awareness reporting (SIGACTS)",
        "ISAC / JCISA information sharing for threat indicators",
    ],
    limitations=[
        "Insider threat vectors may not be detectable before exploitation",
        "Legacy system vulnerabilities may not be patchable in operational timeframe",
        "Hunt operations require dedicated analyst resources",
    ],
    citations=[
        DoctrineCitation(
            pub="FM 3-12",
            paragraph="2-1",
            title="Cyberspace and Electronic Warfare Operations — DCO",
            url=None,
        ),
        DoctrineCitation(
            pub="TRADOC Pam 525-3-1",
            paragraph="3-2",
            title="The U.S. Army in Multi-Domain Operations",
            url=DOCTRINE_CITATIONS["TRADOC_P525_3_1"]["url"],
        ),
    ],
)

# ── EW — AN/MLQ-44 Prophet (SIGINT/EW) ─────────────────────────────────────

AN_MLQ44_PROPHET: EWCapability = EWCapability(
    system="AN/MLQ-44 Prophet Enhanced",
    ew_type=EWOperationType.ELECTRONIC_WARFARE_SUPPORT,
    frequency_range="2 MHz — 3 GHz",
    effective_range_km=50.0,
    mission_profiles=[
        "SIGINT collection",
        "Direction finding (DF)",
        "Electronic order of battle (EOB) development",
        "Spectrum management support",
        "EW support to maneuver",
    ],
    planning_considerations=[
        "Ground-based system requires terrain masking for survivability",
        "Line-of-sight limitation reduces effective range in complex terrain",
        "Requires frequency coordination with G6 and fires to prevent fratricide",
        "Collection priorities tied to commander's critical information requirements (CCIR)",
        "Data feeds to MI battalion processing element",
    ],
    limitations=[
        "LOS system — degraded capability in dense urban or mountainous terrain",
        "Requires dedicated spectrum access — coordinate with EW officer",
        "Ground-mounted platform vulnerable to counter-battery fire if detected",
    ],
    citations=[
        DoctrineCitation(
            pub="ATP 3-36",
            paragraph="2-1",
            title="Electronic Warfare Techniques",
            url=None,
        ),
        DoctrineCitation(
            pub="FM 3-12",
            paragraph="3-15",
            title="Cyberspace and Electronic Warfare Operations — EW",
            url=None,
        ),
    ],
)

# ── EW — AN/TLQ-17A Traffic Jam (Electronic Attack) ────────────────────────

AN_TLQ17_TRAFFIC_JAM: EWCapability = EWCapability(
    system="AN/TLQ-17A Traffic Jam",
    ew_type=EWOperationType.ELECTRONIC_ATTACK,
    frequency_range="20 MHz — 80 MHz",
    effective_range_km=25.0,
    mission_profiles=[
        "Electronic jamming of enemy VHF communications",
        "Deny enemy tactical radio communications",
        "Degrade enemy C2 in support of maneuver",
        "EW support to deception operations",
    ],
    planning_considerations=[
        "Jamming signature is detectable — plan for operator survival",
        "Fratricide risk: own-force VHF must be deconflicted before activation",
        "Employment requires EW officer integration into targeting process",
        "Coordinate with fires to prevent jamming own force fire net",
        "Employment authority at BCT level; effects at company and below",
    ],
    limitations=[
        "Detectable — emitter location exploitable by enemy DF and counterfire",
        "Effectiveness degrades with distance and terrain masking",
        "Spectrum-specific: not effective against satellite or frequency-hopping radios",
    ],
    citations=[
        DoctrineCitation(
            pub="ATP 3-36",
            paragraph="3-1",
            title="Electronic Warfare Techniques — Electronic Attack",
            url=None,
        ),
    ],
)


CYBER_LIBRARY = {
    "OCO": OFFENSIVE_CYBER_OPERATIONS,
    "DCO": DEFENSIVE_CYBER_OPERATIONS,
}

EW_LIBRARY = {
    "Prophet":     AN_MLQ44_PROPHET,
    "Traffic_Jam": AN_TLQ17_TRAFFIC_JAM,
}


def get_cyber_capability(name: str) -> Optional[CyberCapability]:
    """Return the doctrinal cyber capability descriptor."""
    return CYBER_LIBRARY.get(name)


def get_ew_capability(name: str) -> Optional[EWCapability]:
    """Return the doctrinal EW capability descriptor."""
    return EW_LIBRARY.get(name)


def cyber_effect_matrix() -> dict:
    """
    Cyber effect type to target category matrix per FM 3-12.
    Returns a mapping of effect types to their most suitable target categories.
    """
    return {
        CyberEffectType.DEGRADE: ["C2 networks", "Air defense systems", "Logistics networks"],
        CyberEffectType.DISRUPT: ["Communications", "Financial systems", "ISR capabilities"],
        CyberEffectType.DESTROY: ["ICS/SCADA systems", "Data repositories"],
        CyberEffectType.DENY:    ["Network services", "Access credentials", "Data availability"],
        CyberEffectType.DECEIVE: ["Sensor feeds", "Situational awareness systems", "Navigation data"],
        CyberEffectType.EXPLOIT: ["Target development", "Intelligence collection", "Key leaders"],
    }
