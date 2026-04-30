'use client'

import { useState } from 'react'
import { ClassificationBanner } from '@/components/ClassificationBanner'
import { SystemHeader } from '@/components/SystemHeader'
import { ScenarioPanel } from '@/components/ScenarioPanel'
import { MissionAnalysisPanel } from '@/components/MissionAnalysisPanel'
import { COASection } from '@/components/COASection'
import { RecommendationPanel } from '@/components/RecommendationPanel'
import { OPORDPanel } from '@/components/OPORDPanel'
import { FiresPanel } from '@/components/FiresPanel'
import { submitScenario } from '@/lib/api'
import type { MDMPOutput } from '@/types'

type AppStatus = 'idle' | 'running' | 'complete' | 'error'

export default function IronForgeDashboard() {
  const [status, setStatus]   = useState<AppStatus>('idle')
  const [output, setOutput]   = useState<MDMPOutput | null>(null)
  const [runId, setRunId]     = useState<string | null>(null)
  const [error, setError]     = useState<string | null>(null)
  const [step, setStep]       = useState(0)
  const [activeSection, setActiveSection] = useState<string>('mission')

  const handleSubmit = async (scenarioData: Record<string, unknown>) => {
    setStatus('running')
    setError(null)
    setOutput(null)
    setRunId(null)

    // Animate step counter while pipeline runs
    let s = 0
    const tick = setInterval(() => {
      s = Math.min(s + 1, 6)
      setStep(s)
    }, 400)

    try {
      const res = await submitScenario(scenarioData)
      clearInterval(tick)
      setStep(7)
      setRunId(res.run_id)
      setOutput(res.output)
      setStatus('complete')
      setActiveSection('mission')
    } catch (e: unknown) {
      clearInterval(tick)
      setError(e instanceof Error ? e.message : 'Pipeline execution failed.')
      setStatus('error')
      setStep(0)
    }
  }

  const sections = [
    { id: 'mission', label: 'Mission Analysis' },
    { id: 'coa',     label: 'Courses of Action' },
    { id: 'rec',     label: 'Recommendation' },
    { id: 'opord',   label: 'OPORD' },
    { id: 'fires',   label: 'Fires' },
  ]

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: '#080d18', color: '#a0b4c8' }}
    >
      {/* ── Classification banner top ── */}
      <ClassificationBanner />

      {/* ── System header ── */}
      <SystemHeader isOnline={status !== 'error'} />

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 52px)' }}>

        {/* Left sidebar */}
        <ScenarioPanel
          isRunning={status === 'running'}
          completedSteps={step}
          onSubmit={handleSubmit}
        />

        {/* Right main panel */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Section nav tabs (only when output exists) */}
          {output && (
            <div
              className="flex items-center gap-0 px-4 shrink-0"
              style={{ background: '#090e1a', borderBottom: '1px solid #1e2d3d' }}
            >
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className="px-4 py-2 text-xs tracking-wider uppercase border-b-2 transition-colors"
                  style={{
                    borderBottomColor: activeSection === s.id ? '#c8a84b' : 'transparent',
                    color: activeSection === s.id ? '#c8a84b' : '#4a6680',
                    background: 'transparent',
                    fontSize: '0.65rem',
                  }}
                >
                  {s.label}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-3 text-xs" style={{ color: '#2d4a6a', fontSize: '0.62rem' }}>
                {runId && <span>RUN: {runId.slice(0, 8).toUpperCase()}</span>}
                <span className="status-dot status-dot-green" />
                <span style={{ color: '#16b960' }}>PIPELINE COMPLETE</span>
              </div>
            </div>
          )}

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {/* ── Idle splash ── */}
            {status === 'idle' && (
              <SplashScreen />
            )}

            {/* ── Running state ── */}
            {status === 'running' && (
              <RunningOverlay step={step} />
            )}

            {/* ── Error state ── */}
            {status === 'error' && error && (
              <div
                className="p-4"
                style={{ border: '1px solid #4a1010', background: '#1a0808', color: '#ef4444' }}
              >
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', marginBottom: 4 }}>
                  ⚠ PIPELINE EXECUTION ERROR
                </div>
                <div style={{ fontSize: '0.8rem' }}>{error}</div>
                <div style={{ color: '#4a6680', fontSize: '0.65rem', marginTop: 8 }}>
                  Verify ANTHROPIC_API_KEY is set and backend is reachable at {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
                </div>
              </div>
            )}

            {/* ── Output sections ── */}
            {output && (
              <>
                {activeSection === 'mission' && (
                  <MissionAnalysisPanel
                    missionAnalysis={output.mission_analysis}
                    receipt={output.receipt}
                  />
                )}

                {activeSection === 'coa' && (
                  <COASection
                    coas={output.coas}
                    analyses={output.coa_analyses}
                    comparisons={output.coa_comparisons}
                    recommendedCoaId={output.approval.recommended_coa_id}
                  />
                )}

                {activeSection === 'rec' && (
                  <RecommendationPanel
                    approval={output.approval}
                    coas={output.coas}
                    runId={runId ?? undefined}
                  />
                )}

                {activeSection === 'opord' && (
                  <OPORDPanel opord={output.opord} />
                )}

                {activeSection === 'fires' && (
                  <FiresPanel />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* ── Classification banner bottom ── */}
      <ClassificationBanner />
    </div>
  )
}

/* ── Sub-components ─────────────────────────────────────────────── */

function SplashScreen() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: '60vh' }}
    >
      <div
        className="text-center p-8"
        style={{ border: '1px solid #1e2d3d', background: '#0d1420', maxWidth: 520 }}
      >
        <div style={{ color: '#c8a84b', fontSize: '2rem', marginBottom: 16, letterSpacing: '0.3em' }}>
          ◈ IRONFORGE
        </div>
        <div style={{ color: '#4a6680', fontSize: '0.7rem', letterSpacing: '0.2em', marginBottom: 24, textTransform: 'uppercase' }}>
          AI-Powered Military Decision Making Process Engine
        </div>
        <div
          style={{
            color: '#a0b4c8',
            fontSize: '0.8rem',
            lineHeight: 1.8,
            fontStyle: 'italic',
            borderLeft: '2px solid #c8a84b',
            paddingLeft: 16,
            marginBottom: 24,
            textAlign: 'left',
          }}
        >
          The hardest problem in warfare is not firepower.<br />
          It is the decision.
        </div>
        <div className="space-y-2 text-left">
          {[
            'Select a scenario from the left panel',
            'Execute the seven-step MDMP pipeline',
            'Review three generated Courses of Action',
            'Examine wargaming results and scoring matrix',
            'Retrieve formatted OPORD fragment',
            'Integrate fires targeting workflow',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2" style={{ fontSize: '0.68rem', color: '#4a6680' }}>
              <span style={{ color: '#1e2d3d' }}>{String(i + 1).padStart(2, '0')}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4" style={{ borderTop: '1px solid #1e2d3d', color: '#2d4a6a', fontSize: '0.62rem' }}>
          FM 6-0 · FM 2-01.3 · FM 3-60 · FM 3-09 · ADRP 5-0 · JP 3-0 · JP 3-60 · ADP 3-0
        </div>
      </div>
    </div>
  )
}

function RunningOverlay({ step }: { step: number }) {
  const stepNames = [
    'Receipt of Mission',
    'Mission Analysis',
    'COA Development',
    'COA Analysis (Wargaming)',
    'COA Comparison',
    'COA Approval',
    'Orders Production',
  ]

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: '60vh' }}
    >
      <div className="p-8 text-center" style={{ border: '1px solid #1e3a5f', background: '#0d1420', maxWidth: 440 }}>
        <div style={{ color: '#3b82f6', fontSize: '0.72rem', letterSpacing: '0.2em', marginBottom: 16 }}>
          ▶ MDMP PIPELINE EXECUTING
        </div>

        <div className="space-y-2 mb-6">
          {stepNames.map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-left px-2 py-1"
              style={{
                background: i < step ? 'rgba(22,185,96,0.05)' : i === step ? 'rgba(59,130,246,0.08)' : 'transparent',
                border: i === step ? '1px solid #1e3a5f' : '1px solid transparent',
              }}
            >
              <span style={{
                color: i < step ? '#16b960' : i === step ? '#c8a84b' : '#2d4a6a',
                fontSize: '0.75rem',
              }}>
                {i < step ? '◈' : i === step ? '▶' : '○'}
              </span>
              <span style={{
                color: i < step ? '#16b960' : i === step ? '#c8dae8' : '#2d4a6a',
                fontSize: '0.68rem',
              }}>
                {String(i + 1).padStart(2, '0')}. {name.toUpperCase()}
              </span>
              {i === step && (
                <span className="cursor-blink ml-auto" style={{ color: '#c8a84b', fontSize: '0.65rem' }}>▌</span>
              )}
            </div>
          ))}
        </div>

        <div style={{ color: '#4a6680', fontSize: '0.62rem', letterSpacing: '0.12em' }}>
          Consulting doctrine · Generating COAs · Wargaming responses
        </div>
      </div>
    </div>
  )
}
