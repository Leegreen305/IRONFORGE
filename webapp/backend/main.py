"""
IRONFORGE FastAPI Backend

Exposes REST endpoints for MDMP pipeline, AI engine, fires, and PDF generation.
"""

import os
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ironforge.base_classes import Scenario
from mdmp.pipeline import MDMPPipeline, MDMPRun
from mdmp.models import MDMPOutput
from fires.targeting import TargetingEngine, TargetNomination
from webapp.backend.pdf_generator import generate_mdmp_pdf

app = FastAPI(
    title="IRONFORGE API",
    description="AI-powered Military Decision Making Process engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScenarioInput(BaseModel):
    scenario: dict


class RefineRequest(BaseModel):
    session_id: str
    user_request: str


class TargetNominationInput(BaseModel):
    target_data: dict


@app.get("/")
def root():
    return {"status": "IRONFORGE operational", "version": "1.0.0"}


@app.post("/api/scenario")
def ingest_scenario(payload: ScenarioInput):
    """Ingest a scenario and kick off the MDMP pipeline."""
    try:
        scenario = Scenario(**payload.scenario)
    except Exception as e:
        raise HTTPException(
            status_code=422, detail=f"Invalid scenario: {str(e)}")
    run = MDMPPipeline.start_run(scenario)
    output = run.execute()
    return {"run_id": run.run_id, "status": "complete", "output": output.model_dump()}


@app.get("/api/mdmp/{run_id}/status")
def get_status(run_id: str):
    """Get pipeline step status for a run."""
    run = MDMPPipeline.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return {
        "run_id": run_id,
        "completed_steps": [s.value for s in run.completed_steps],
        "is_complete": len(run.completed_steps) == 7,
    }


@app.get("/api/mdmp/{run_id}/coas")
def get_coas(run_id: str):
    """Retrieve three COAs with wargaming results."""
    run = MDMPPipeline.get_run(run_id)
    if not run or not run.output:
        raise HTTPException(
            status_code=404, detail="Run not found or incomplete")
    return {
        "run_id": run_id,
        "coas": [c.model_dump() for c in run.output.coas],
        "analyses": [a.model_dump() for a in run.output.coa_analyses],
    }


@app.get("/api/mdmp/{run_id}/recommendation")
def get_recommendation(run_id: str):
    """Get recommended COA with doctrine citations."""
    run = MDMPPipeline.get_run(run_id)
    if not run or not run.output:
        raise HTTPException(
            status_code=404, detail="Run not found or incomplete")
    return {
        "run_id": run_id,
        "approval": run.output.approval.model_dump(),
        "comparisons": [c.model_dump() for c in run.output.coa_comparisons],
    }


@app.get("/api/mdmp/{run_id}/opord")
def get_opord(run_id: str):
    """Get structured OPORD fragment."""
    run = MDMPPipeline.get_run(run_id)
    if not run or not run.output:
        raise HTTPException(
            status_code=404, detail="Run not found or incomplete")
    return {
        "run_id": run_id,
        "opord": run.output.opord.model_dump(),
    }


@app.post("/api/mdmp/{run_id}/refine")
def refine_run(run_id: str, req: RefineRequest):
    """Iterative refinement via AI engine (requires ANTHROPIC_API_KEY)."""
    try:
        from ai_engine import AIEngine
        engine = AIEngine()
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    session = engine.get_session(req.session_id)
    if not session:
        session = engine.start_session(req.session_id)
    response = engine.refine(req.session_id, req.user_request)
    return {"session_id": req.session_id, "response": response}


@app.post("/api/fires/targets")
def nominate_target(payload: TargetNominationInput):
    """Fires target nomination endpoint."""
    engine = TargetingEngine()
    target = engine.nominate(payload.target_data)
    return target.model_dump()


@app.get("/api/mdmp/{run_id}/report.pdf")
def get_report_pdf(run_id: str):
    """Download PDF report for a completed MDMP run."""
    run = MDMPPipeline.get_run(run_id)
    if not run or not run.output:
        raise HTTPException(
            status_code=404, detail="Run not found or incomplete")
    pdf_bytes = generate_mdmp_pdf(run.output)
    from fastapi.responses import Response
    return Response(content=pdf_bytes, media_type="application/pdf", headers={
        "Content-Disposition": f"attachment; filename=ironforge_report_{run_id}.pdf"
    })


@app.get("/api/scenarios")
def list_scenarios():
    """List available pre-built scenarios."""
    from scenarios import list_scenarios as ls
    return ls()


@app.get("/api/scenarios/{name}")
def get_scenario(name: str):
    """Load a pre-built scenario by name."""
    from scenarios import load_scenario
    try:
        scenario = load_scenario(name)
        return scenario.model_dump()
    except Exception as e:
        raise HTTPException(
            status_code=404, detail=f"Scenario not found: {str(e)}")
