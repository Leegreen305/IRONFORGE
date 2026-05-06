# IRONFORGE Roadmap

## Current Release — v1.0.0

**Operational Status: Mission Capable**

The following capabilities are present in the current release and are considered stable:

### Core MDMP Pipeline
- [x] Step 1 — Receipt of Mission: classification (hasty / deliberate / crisis action), key task extraction
- [x] Step 2 — Mission Analysis: full METT-TC extraction, specified / implied / essential task identification, restated mission
- [x] Step 3 — COA Development: three distinct COAs for offense, defense, targeting, and stability mission types
- [x] Step 4 — COA Analysis: structured action / reaction / counteraction wargaming per FM 6-0 §9-105
- [x] Step 5 — COA Comparison: six-criterion weighted decision matrix per FM 6-0 §9-117
- [x] Step 6 — COA Approval: recommended COA with justification and risk acceptance
- [x] Step 7 — Orders Production: five-paragraph OPORD fragment per FM 6-0 Appendix C

### Intelligence Module
- [x] IPB four-step process per FM 2-01.3
- [x] OCOKA terrain analysis framework
- [x] Weather effects analysis
- [x] Threat template library (peer, near-peer, irregular, hybrid)
- [x] Named Area of Interest (NAI) generator

### Fires Module
- [x] F2T2EA targeting cycle per FM 3-60
- [x] High Payoff Target List (HPTL) management
- [x] Attack Guidance Matrix (AGM) generation
- [x] Fire Support Coordination Measures (FSCM) framework

### AI Engine
- [x] Claude claude-sonnet-4-20250514 integration
- [x] Doctrine-grounded system prompt
- [x] Session-based conversational refinement
- [x] Structured JSON I/O with Pydantic v2 validation

### Web Application
- [x] FastAPI REST API backend
- [x] Next.js 15 frontend with military terminal aesthetic
- [x] Seven-step pipeline visualization
- [x] Three COA cards with wargaming results and scoring
- [x] OPORD five-paragraph formatted output
- [x] Fires integration panel with HPTL, AGM, FSCM, and target nomination
- [x] PDF OPORD generation via ReportLab

### Demonstration Scenarios
- [x] Time Sensitive Targeting — HVI logistics coordinator
- [x] Brigade Defense — Peer threat mechanized assault
- [x] Cyber-Physical Attack — FOB C2 node
- [x] Contested Airspace CAS — Degraded communications
- [x] Multi-Domain Strike — Integrated Air Defense System

---

## v1.1.0 — Planned

### Enhanced Intelligence
- [ ] Modified Combined Obstacle Overlay (MCOO) logic per FM 2-01.3 §3-1
- [ ] Enemy course of action templating with peer / near-peer / irregular templates
- [ ] High Value Target (HVT) list automatic generation from scenario data
- [ ] Integration of SIGINT and HUMINT source weighting

### Enhanced Fires
- [ ] Ammunition allocation planning per FM 3-09 planning tables
- [ ] Coordinated fire line automatic positioning based on scheme of maneuver
- [ ] Counterfire target acquisition integration
- [ ] Joint terminal attack controller (JTAC) 9-line CAS request generation per AFTTP 3-2.6

### COA Enhancement
- [ ] Doctrinal task template integration (attack, defend, delay formations)
- [ ] Task and purpose structure per ADP 3-0
- [ ] Commander's critical information requirements (CCIR) auto-generation
- [ ] Branch plan and sequel development per FM 6-0 §9-113

### UI Improvements
- [ ] Exportable scenario templates with unit drag-and-drop
- [ ] Interactive COA map overlay (terrain-aware)
- [ ] Printable OPORD formatted per FM 6-99 Report Formats
- [ ] Real-time pipeline step timestamps

---

## v1.2.0 — Future

### Multi-Domain Operations
- [ ] Space domain integration per JP 3-14
- [ ] Cyber operations planning framework per FM 3-12
- [ ] Electronic warfare effects modeling per ATP 3-36
- [ ] Multi-domain task force (MDTF) mission type support per TRADOC Pam 525-3-1

### Joint Operations
- [ ] Joint operations planning per JP 5-0
- [ ] Combined arms maneuver and wide area security frameworks per ADP 3-0
- [ ] Coalition / multinational planning constraints
- [ ] Joint Intelligence Preparation of the Operational Environment (JIPOE)

### Advanced AI
- [ ] Iterative MDMP refinement with commander's guidance incorporation
- [ ] Multiple enemy COA wargaming (most likely AND most dangerous simultaneously)
- [ ] Historical doctrine precedent citation with case study references
- [ ] Red team analysis against own COA vulnerabilities

### Infrastructure
- [ ] Docker compose deployment configuration
- [ ] PostgreSQL persistence for run history
- [ ] User authentication and session management
- [ ] API rate limiting and audit logging

---

## Doctrine Coverage Target

As capabilities expand, IRONFORGE aims to achieve comprehensive coverage of:

| Publication | Status |
|---|---|
| FM 6-0 — Commander and Staff Organization and Operations | v1.0 — Core MDMP |
| FM 2-01.3 — Intelligence Preparation of the Battlefield | v1.0 — IPB core |
| FM 3-60 — The Targeting Process | v1.0 — F2T2EA |
| FM 3-09 — Fire Support and Field Artillery Operations | v1.0 — FSCM/HPTL |
| ADRP 5-0 — The Operations Process | v1.0 — Pipeline structure |
| JP 3-0 — Joint Operations | v1.0 — Planning fundamentals |
| JP 3-60 — Joint Targeting | v1.0 — Target cycle |
| ADP 3-0 — Operations | v1.0 — ULO doctrine |
| FM 6-99 — U.S. Army Report and Message Formats | v1.0 — OPORD format |
| TRADOC Pam 525-3-1 — MDO | v1.0 — Referenced |
| JP 5-0 — Joint Planning | v1.2 — Planned |
| FM 3-12 — Cyber Operations | v1.2 — Planned |
| ATP 3-36 — Electronic Warfare | v1.2 — Planned |
| JP 3-14 — Space Operations | v1.2 — Planned |

---

*Roadmap subject to revision. Contributions welcome — see CONTRIBUTING.md.*
