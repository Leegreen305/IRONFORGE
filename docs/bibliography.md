# IRONFORGE Doctrine Bibliography

All doctrine references used in this framework are publicly available, unclassified U.S. Army and Joint publications. Each entry includes the specific chapters and paragraphs cited in the codebase.

---

## U.S. Army Field Manuals

### FM 6-0 — Commander and Staff Organization and Operations
**Publication Date:** May 2014  
**Publisher:** Headquarters, Department of the Army  
**Available at:** https://armypubs.army.mil/epubs/DR_pubs/DR_a/pdf/web/fm6_0.pdf

**Sections cited in IRONFORGE:**

| Chapter/Para | Topic | IRONFORGE Module |
|---|---|---|
| Chapter 9 | Military Decision Making Process — overview | `mdmp/pipeline.py` |
| §9-20 to §9-27 | Receipt of Mission — classification, initial key tasks | `mdmp/step01_receipt.py` |
| §9-29 to §9-77 | Mission Analysis — METT-TC, task types, restated mission | `mdmp/step02_mission_analysis.py` |
| §9-32 | METT-TC factors definition | `mdmp/models.py` — `METTTC` class |
| §9-78 to §9-95 | COA Development — criteria for viable COA | `mdmp/step03_coa_development.py` |
| §9-84 | COA validity criteria (suitable, feasible, acceptable, distinguishable, complete) | `mdmp/step03_coa_development.py` |
| §9-96 to §9-116 | COA Analysis (Wargaming) | `mdmp/step04_coa_analysis.py` |
| §9-105 | Action / Reaction / Counteraction wargaming method | `mdmp/step04_coa_analysis.py` |
| §9-108 | Wargaming techniques | `mdmp/step04_coa_analysis.py` |
| §9-113 | Branch plans and sequels | `mdmp/step04_coa_analysis.py` |
| §9-117 to §9-122 | COA Comparison — decision criteria matrix | `mdmp/step05_coa_comparison.py` |
| §9-123 to §9-128 | COA Approval | `mdmp/step06_coa_approval.py` |
| Appendix C | Operations Order (OPORD) format | `mdmp/step07_orders_production.py` |
| Table 9-2 | Decision criteria and weights | `ironforge/constants.py` — `DEFAULT_WEIGHTS` |

---

### FM 2-01.3 — Intelligence Preparation of the Battlefield (IPB)
**Publication Date:** July 2009  
**Publisher:** Headquarters, Department of the Army  
**Available at:** https://armypubs.army.mil/epubs/DR_pubs/DR_a/pdf/web/fm2_01x3.pdf

**Sections cited in IRONFORGE:**

| Chapter/Para | Topic | IRONFORGE Module |
|---|---|---|
| Chapter 1 | IPB overview and purpose | `intelligence/ipb.py` |
| §2-1 to §2-12 | Step 1: Define the Operational Environment | `intelligence/ipb.py` |
| §2-4 | OCOKA framework (Observation, Cover, Obstacles, Key terrain, Avenues of approach) | `intelligence/terrain.py` |
| §2-13 to §2-30 | Step 2: Describe Environmental Effects on Operations | `intelligence/terrain.py`, `intelligence/weather_effects.py` |
| Appendix B | Weather and terrain effects on military operations | `intelligence/weather_effects.py`, `ironforge/constants.py` |
| §3-1 to §3-25 | Step 3: Evaluate the Threat | `intelligence/threat_templates.py` |
| §3-26 to §3-60 | Step 4: Determine Threat Courses of Action | `intelligence/threat_templates.py` |
| §3-45 | Named Area of Interest (NAI) definition and development | `intelligence/nai_generator.py` |

---

### FM 3-60 — The Targeting Process
**Publication Date:** November 2023  
**Publisher:** Headquarters, Department of the Army  
**Available at:** https://armypubs.army.mil/epubs/DR_pubs/DR_a/pdf/web/fm3_60.pdf

**Sections cited in IRONFORGE:**

| Chapter/Para | Topic | IRONFORGE Module |
|---|---|---|
| Chapter 2 | Targeting methodology overview | `fires/targeting.py` |
| §2-1 | F2T2EA (Find, Fix, Track, Target, Engage, Assess) cycle definition | `fires/targeting.py` |
| Chapter 4 | High Payoff Target development | `fires/hptl.py` |
| §4-1 | High Payoff Target List (HPTL) — definition and development | `fires/hptl.py` |
| §4-12 | Attack Guidance Matrix (AGM) construction | `fires/hptl.py` |

---

### FM 3-09 — Fire Support and Field Artillery Operations
**Publication Date:** April 2023  
**Publisher:** Headquarters, Department of the Army  
**Available at:** https://armypubs.army.mil/epubs/DR_pubs/DR_a/pdf/web/fm3_09.pdf

**Sections cited in IRONFORGE:**

| Chapter/Para | Topic | IRONFORGE Module |
|---|---|---|
| Chapter 5 | Fire Support Coordination Measures (FSCM) | `fires/fscm.py` |
| §5-1 | FSCL, CFL, NFA, RFL, FFA definitions | `fires/fscm.py` |
| Planning Tables | Artillery planning factors — rounds per tube per day | `ironforge/constants.py` — `PLANNING_FACTORS` |

---

### FM 6-99 — U.S. Army Report and Message Formats
**Publication Date:** August 2006  
**Publisher:** Headquarters, Department of the Army  
**Available at:** https://armypubs.army.mil/epubs/DR_pubs/DR_a/pdf/web/fm6_99.pdf

**Sections cited in IRONFORGE:**

| Chapter/Para | Topic | IRONFORGE Module |
|---|---|---|
| Chapter 3 | Operations Order (OPORD) — paragraph structure and numbering | `mdmp/step07_orders_production.py` |
| §3-1 | Five-paragraph OPORD format | `mdmp/models.py` — `OPORDFragment` |

---

## Army Doctrine Reference Publications

### ADRP 5-0 — The Operations Process
**Publication Date:** May 2012  
**Publisher:** Headquarters, Department of the Army  
**Available at:** https://armypubs.army.mil/epubs/DR_pubs/DR_a/pdf/web/adrp5_0.pdf

**Sections cited in IRONFORGE:**

| Chapter/Para | Topic | IRONFORGE Module |
|---|---|---|
| Chapter 2 | The operations process — plan, prepare, execute, assess | `mdmp/pipeline.py` |
| §2-1 | Commander's decision cycle | `ai_engine/system_prompt.py` |
| Mission Types | Offense, Defense, Stability, DSCA mission types | `ironforge/enums.py` — `MissionType` |

---

## Army Doctrine Publications

### ADP 3-0 — Operations
**Publication Date:** July 2019  
**Publisher:** Headquarters, Department of the Army  
**Available at:** https://armypubs.army.mil/epubs/DR_pubs/DR_a/pdf/web/ARN18010_ADP%203-0%20FINAL%20WEB.pdf

**Sections cited in IRONFORGE:**

| Chapter/Para | Topic | IRONFORGE Module |
|---|---|---|
| Chapter 3 | Combined arms maneuver and wide area security | `mdmp/step03_coa_development.py` |
| §3-1 | Offense, defense, and stability framework | `ironforge/enums.py` |

---

## Joint Publications

### JP 3-0 — Joint Operations
**Publication Date:** June 2022  
**Publisher:** Joint Chiefs of Staff  
**Available at:** https://www.jcs.mil/Doctrine/Joint-Publications/JP-3-0/

**Sections cited in IRONFORGE:**

| Chapter/Para | Topic | IRONFORGE Module |
|---|---|---|
| Chapter III | Joint planning fundamentals | `ai_engine/system_prompt.py` |
| §III-1 | Operational art and design | `mdmp/step02_mission_analysis.py` |
| Echelon definitions | Corps, JTF, Army-level planning echelons | `ironforge/enums.py` — `Echelon` |

---

### JP 3-60 — Joint Targeting
**Publication Date:** April 2018  
**Publisher:** Joint Chiefs of Staff  
**Available at:** https://www.jcs.mil/Doctrine/Joint-Publications/JP-3-60/

**Sections cited in IRONFORGE:**

| Chapter/Para | Topic | IRONFORGE Module |
|---|---|---|
| Chapter II | Joint targeting cycle | `fires/targeting.py` |
| §II-1 | Joint targeting objectives | `fires/hptl.py` |
| Chapter III | Target development | `fires/targeting.py` |

---

## TRADOC Publications

### TRADOC Pamphlet 525-3-1 — The U.S. Army in Multi-Domain Operations 2028
**Publication Date:** December 2018  
**Publisher:** U.S. Army Training and Doctrine Command  
**Available at:** https://adminpubs.tradoc.army.mil/pamphlets/TP525-3-1.pdf

**Sections cited in IRONFORGE:**

| Chapter/Para | Topic | IRONFORGE Module |
|---|---|---|
| Chapter 3 | Multi-domain operations framework | `scenarios/multi_domain_strike.json` |
| Appendix A | Multi-domain task force capabilities | `assets/cyber.py`, `assets/aviation.py` |

---

## Planning Factors — Source Table

The following doctrinal planning factors are embedded in `ironforge/constants.py`:

| Factor | Value | Source |
|--------|-------|--------|
| Dismounted infantry movement rate | 4 km/hr | FM 6-0 App B |
| Mounted infantry movement (road) | 40 km/hr | FM 6-0 App B |
| Armor movement (road) | 50 km/hr | FM 6-0 App B |
| Armor movement (cross-country) | 30 km/hr | FM 6-0 App B |
| Helicopter cruise speed | 120 knots | FM 3-04.000 |
| Artillery rounds per tube/day | 200 | FM 3-09 |
| Small arms rounds per soldier/day | 150 | FM 6-0 |
| Tank main gun rounds/day | 40 | FM 6-0 |
| MDMP hasty planning threshold | ≤2 hours | FM 6-0 §9-20 |
| MDMP deliberate planning threshold | ≥24 hours | FM 6-0 §9-20 |
| Clear visibility | 10 km | FM 2-01.3 App B |
| Fog visibility | 1 km | FM 2-01.3 App B |

---

## Access

All publications listed above are available through official U.S. Government channels at no cost to the public:

- **Army Publishing Directorate:** https://armypubs.army.mil
- **Joint Electronic Library:** https://www.jcs.mil/Doctrine/Joint-Doctrinal-Publications/
- **TRADOC Publications:** https://adminpubs.tradoc.army.mil

No restricted, FOUO, or classified material has been incorporated into IRONFORGE.
