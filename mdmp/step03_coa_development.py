"""
Step 3: COA Development

Generates three distinct Courses of Action per FM 6-0, para 9-78.
"""

from typing import List
from ironforge.base_classes import Scenario, DoctrineCitation
from ironforge.constants import DOCTRINE_CITATIONS
from ironforge.enums import COAStatus
from mdmp.models import COA


def coa_development(scenario: Scenario) -> List[COA]:
    """
    Generate three doctrinally sound COAs based on mission type and forces available.
    """
    mt = scenario.mission_type.value
    if mt == "OFFENSE":
        return _coas_offense(scenario)
    elif mt == "DEFENSE":
        return _coas_defense(scenario)
    elif mt == "TARGETING":
        return _coas_targeting(scenario)
    else:
        return _coas_generic(scenario)


def _citation() -> List[DoctrineCitation]:
    return [
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="9-78",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
        DoctrineCitation(
            pub="FM 6-0",
            paragraph="9-84",
            title="Commander and Staff Organization and Operations",
            url=DOCTRINE_CITATIONS["FM_6_0"]["url"],
        ),
    ]


def _coas_offense(scenario: Scenario) -> List[COA]:
    coa1 = COA(
        coa_id="COA-A",
        name="Frontal Attack with Fires Supremacy",
        description="Mass all available combat power along a single axis with priority of fires to suppress enemy strongpoints. Rapid breach and exploitation.",
        type="offense",
        decisive_operation="Main effort battalion conducts frontal assault on enemy center of gravity.",
        shaping_operations=[
            "Reconnaissance troop screens flanks.",
            "Artillery delivers counterfire and suppression.",
        ],
        sustaining_operation="Sustainment convoy follows main effort to rearm and refuel.",
        risk_assessment="High risk due to frontal exposure. Mitigated by fires supremacy and speed.",
        status=COAStatus.DRAFT,
        citations=_citation(),
    )
    coa2 = COA(
        coa_id="COA-B",
        name="Penetration with Exploitation Force",
        description="Concentrate combat power at a weak point in enemy defenses, penetrate, and pass exploitation force through the gap.",
        type="offense",
        decisive_operation="Combined arms breach team creates gap; armored company passes through and attacks depth.",
        shaping_operations=[
            "Fix enemy with feint on alternate axis.",
            "Aviation conducts armed reconnaissance forward of breach.",
        ],
        sustaining_operation="Brigade support area displaces forward to sustain exploitation force.",
        risk_assessment="Moderate risk. Requires precise synchronization of breach and pass-through.",
        status=COAStatus.DRAFT,
        citations=_citation(),
    )
    coa3 = COA(
        coa_id="COA-C",
        name="Flanking Envelopment",
        description="Fix enemy with supporting attack while main effort conducts wide envelopment to seize objective from unprotected flank.",
        type="offense",
        decisive_operation="Cavalry squadron conducts wide envelopment to seize objective from flank/rear.",
        shaping_operations=[
            "Infantry battalion fixes enemy with supporting attack.",
            "Engineers reduce mobility obstacles on envelopment route.",
        ],
        sustaining_operation="Forward arming and refueling point established at intermediate objective.",
        risk_assessment="Moderate risk. Envelopment route must remain unobserved; vulnerable to counterattack if detected early.",
        status=COAStatus.DRAFT,
        citations=_citation(),
    )
    return [coa1, coa2, coa3]


def _coas_defense(scenario: Scenario) -> List[COA]:
    coa1 = COA(
        coa_id="COA-A",
        name="Defense in Depth",
        description="Establish successive battle positions to absorb and wear down enemy attack before decisive counterattack.",
        type="defense",
        decisive_operation="Reserve battalion conducts counterattack into flank of committed enemy force.",
        shaping_operations=[
            "Security force delays and identifies enemy main effort.",
            "Obstacles and indirect fires channel enemy into engagement areas.",
        ],
        sustaining_operation="Sustainment operates from brigade support area behind main battle area.",
        risk_assessment="Moderate risk. Sacrifices terrain initially; requires disciplined retrograde.",
        status=COAStatus.DRAFT,
        citations=_citation(),
    )
    coa2 = COA(
        coa_id="COA-B",
        name="Strongpoint Defense",
        description="Concentrate combat power on key terrain with mutually supporting positions and heavy obstacles.",
        type="defense",
        decisive_operation="Main effort company team holds key terrain with all available direct and indirect fires.",
        shaping_operations=[
            "Engineers emplace complex obstacle belts forward of strongpoint.",
            "Artillery plans final protective fires around strongpoint.",
        ],
        sustaining_operation="Prestocked ammunition and medical support inside strongpoint.",
        risk_assessment="High risk if enemy bypasses strongpoint or massed artillery suppresses defenders.",
        status=COAStatus.DRAFT,
        citations=_citation(),
    )
    coa3 = COA(
        coa_id="COA-C",
        name="Mobile Defense",
        description="Use fixing force to hold enemy while striking force maneuvers to attack enemy flank or rear.",
        type="defense",
        decisive_operation="Armor-heavy striking force attacks enemy flank as they become fixed by obstacle belt.",
        shaping_operations=[
            "Fixing force occupies battle positions with priority of obstacles and fires.",
            "Aviation provides screen and early warning along avenues of approach.",
        ],
        sustaining_operation="Forward logistics element prepositioned near striking force assembly area.",
        risk_assessment="Moderate risk. Requires precise timing between fixing and striking forces.",
        status=COAStatus.DRAFT,
        citations=_citation(),
    )
    return [coa1, coa2, coa3]


def _coas_targeting(scenario: Scenario) -> List[COA]:
    coa1 = COA(
        coa_id="COA-A",
        name="Kinetic Strike with Precision Munitions",
        description="Locate, fix, and destroy high-value target with standoff precision fires.",
        type="targeting",
        decisive_operation="Joint fires element delivers precision munition on target coordinates.",
        shaping_operations=[
            "ISR assets maintain eyes on target.",
            "Electronic warfare denies target early warning.",
        ],
        sustaining_operation="BDA collection and reattack assessment.",
        risk_assessment="Low collateral risk with precision. Requires positive identification and deconfliction.",
        status=COAStatus.DRAFT,
        citations=_citation(),
    )
    coa2 = COA(
        coa_id="COA-B",
        name="Raid with Ground Maneuver Force",
        description="Infiltrate ground force to physically secure target and exfiltrate with intelligence.",
        type="targeting",
        decisive_operation="Special operations or infantry company conducts direct action raid on target location.",
        shaping_operations=[
            "Aviation provides exfiltration and close air support.",
            "Cyber element disrupts target communications during raid.",
        ],
        sustaining_operation="Casualty evacuation and intelligence exploitation team on standby.",
        risk_assessment="High risk to ground force. Requires surprise and rapid exfiltration.",
        status=COAStatus.DRAFT,
        citations=_citation(),
    )
    coa3 = COA(
        coa_id="COA-C",
        name="Non-Kinetic Isolation and Capture",
        description="Isolate target using cyber and EW effects, then capture via host nation or partner force.",
        type="targeting",
        decisive_operation="Host nation security force effects capture once target is isolated electronically.",
        shaping_operations=[
            "Cyber operations degrade target mobility and communications.",
            "EW denies unmanned system support to target.",
        ],
        sustaining_operation="Legal and diplomatic support for detainee transfer.",
        risk_assessment="Moderate risk. Dependent on partner force reliability and legal framework.",
        status=COAStatus.DRAFT,
        citations=_citation(),
    )
    return [coa1, coa2, coa3]


def _coas_generic(scenario: Scenario) -> List[COA]:
    coa1 = COA(
        coa_id="COA-A",
        name="Doctrinal Option Alpha",
        description="Direct application of force along most likely axis of advance.",
        type="generic",
        decisive_operation="Main body conducts primary operation along axis of advance.",
        shaping_operations=["Security element secures flanks.",
                            "Support element provides sustainment."],
        risk_assessment="Moderate risk.",
        status=COAStatus.DRAFT,
        citations=_citation(),
    )
    coa2 = COA(
        coa_id="COA-B",
        name="Doctrinal Option Bravo",
        description="Maneuver-focused option with indirect approach.",
        type="generic",
        decisive_operation="Maneuver element attacks from unexpected direction.",
        shaping_operations=["Fixing element holds enemy attention.",
                            "Fires support shapes enemy movement."],
        risk_assessment="Moderate risk.",
        status=COAStatus.DRAFT,
        citations=_citation(),
    )
    coa3 = COA(
        coa_id="COA-C",
        name="Doctrinal Option Charlie",
        description="Balanced option emphasizing flexibility and reserve.",
        type="generic",
        decisive_operation="Committed force seizes initial objective; reserve exploits success.",
        shaping_operations=["Reconnaissance develops the situation.",
                            "Fires disrupt enemy counter-maneuver."],
        risk_assessment="Low risk, lower initial tempo.",
        status=COAStatus.DRAFT,
        citations=_citation(),
    )
    return [coa1, coa2, coa3]
