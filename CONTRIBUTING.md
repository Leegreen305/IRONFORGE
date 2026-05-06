# Contributing to IRONFORGE

IRONFORGE is an open-source project. Contributions that advance the fidelity, doctrine accuracy, and capability of the framework are welcome.

---

## The Non-Negotiable Standard

**Every contribution must be traceable to a real, citable, publicly available source.**

This means:

- Every algorithm, planning factor, decision criterion, or model must cite a specific FM, ADRP, JP, ADP, or TRADOC publication by number, date, chapter, and paragraph.
- If you cannot cite it, it does not ship.
- No speculation. No fabrication. No "doctrinal-sounding" content without a real reference.

This constraint is the entire point of the project.

---

## Acceptable Doctrine Sources

Contributions may only reference:

- **U.S. Army Field Manuals (FM)** — armypubs.army.mil
- **Army Doctrine Reference Publications (ADRP)** — armypubs.army.mil
- **Army Doctrine Publications (ADP)** — armypubs.army.mil
- **Army Techniques Publications (ATP)** — armypubs.army.mil
- **Joint Publications (JP)** — jcs.mil
- **TRADOC Pamphlets** — adminpubs.tradoc.army.mil
- **Declassified RAND research** — rand.org

No classified material. No FOUO material. No speculation beyond the published doctrine.

---

## Before You Contribute

1. **Read the DISCLAIMER.md** — understand the scope and limitations.
2. **Check the ROADMAP.md** — see if your idea is already planned.
3. **Open an issue first** — describe the doctrine gap you're filling and cite the specific publication. Wait for feedback before writing code.

---

## Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/ironforge.git
cd ironforge

# Create Python virtual environment
python -m venv .venv
source .venv/bin/activate        # Linux / macOS
.venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run backend
python -m uvicorn webapp.backend.main:app --reload

# Run frontend (separate terminal)
cd webapp/frontend
npm install
npm run dev
```

---

## Code Standards

### Python
- Python 3.10+ syntax only.
- Pydantic v2 for all data models.
- Every function that implements a doctrine concept must include an inline comment citing the source publication and paragraph.
- Docstrings are concise — one sentence stating the doctrine source, nothing more.
- No commented-out code. No TODOs without a linked issue.

### TypeScript / React
- Strict TypeScript. No `any` without justification.
- All components are functional. No class components.
- Military terminal aesthetic is non-negotiable — no consumer UI patterns, no default Tailwind card styles, no Bootstrap.
- Color palette is fixed: `#080d18` background, `#c8a84b` gold, `#3b82f6` blue, `#ef4444` red, `#16b960` green.

### Doctrine Citation Format

Python:
```python
DoctrineCitation(
    pub="FM 6-0",
    paragraph="9-105",
    title="Commander and Staff Organization and Operations",
    url="https://armypubs.army.mil/epubs/DR_pubs/DR_a/pdf/web/fm6_0.pdf",
)
```

TypeScript (inline):
```tsx
<span style={{ color: '#2d4a6a', fontSize: '0.6rem' }}>FM 6-0 §9-105</span>
```

---

## Submitting a Pull Request

1. Fork the repository and create a branch from `main`.
2. Branch naming: `feature/fm-3-09-counterfire`, `fix/step04-wargame-edge-case`, `doc/jp-3-60-cycle`.
3. Write tests for any new logic in `tests/`. All tests must pass before submitting.
4. Run `pytest tests/` locally and confirm all tests pass.
5. Update `docs/bibliography.md` if you add a new doctrine reference.
6. Update `ROADMAP.md` if you complete a planned item.
7. Write a clear PR description: what doctrine gap it addresses, which publication it cites.

---

## What Will Be Rejected

- Contributions without doctrine citations.
- Fabricated or speculative planning factors.
- Consumer UI aesthetics in the frontend.
- Code that degrades test coverage.
- Classified or FOUO references of any kind.
- Marketing language, blog-post phrasing, or "AI assistant" framing anywhere in the codebase or documentation.

---

## Questions

Open a GitHub Issue with the tag `[doctrine question]` or `[architecture question]`.

---

*IRONFORGE is an unclassified training aid. All contributions must remain within that scope.*
