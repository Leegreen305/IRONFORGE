'use client'

import { useState } from 'react'
import { ClassificationBanner } from '@/components/ClassificationBanner'
import { SystemHeader }          from '@/components/SystemHeader'
import { ScenarioPanel }         from '@/components/ScenarioPanel'
import { MissionAnalysisPanel }  from '@/components/MissionAnalysisPanel'
import { COASection }            from '@/components/COASection'
import { RecommendationPanel }   from '@/components/RecommendationPanel'
import { OPORDPanel }            from '@/components/OPORDPanel'
import { FiresPanel }            from '@/components/FiresPanel'
import { DisclaimerModal }       from '@/components/DisclaimerModal'
import { submitScenario }        from '@/lib/api'
import type { MDMPOutput }       from '@/types'

type AppStatus = 'idle' | 'running' | 'complete' | 'error'

const SECTIONS = [
  { id: 'mission', label: 'Mission Analysis' },
  { id: 'coa',     label: 'Courses of Action' },
  { id: 'rec',     label: 'Recommendation' },
  { id: 'opord',   label: 'OPORD' },
  { id: 'fires',   label: 'Fires & Targeting' },
]

export default function IronForgeDashboard() {
  const [status, setStatus]   = useState<AppStatus>('idle')
  const [output, setOutput]   = useState<MDMPOutput | null>(null)
  const [runId, setRunId]     = useState<string | null>(null)
  const [error, setError]     = useState<string | null>(null)
  const [step, setStep]       = useState(0)
  const [section, setSection] = useState('mission')

  const handleSubmit = async (scenarioData: Record<string, unknown>) => {
    setStatus('running')
    setError(null)
    setOutput(null)
    setRunId(null)
    let s = 0
    const tick = setInterval(() => { s = Math.min(s + 1, 6); setStep(s) }, 380)
    try {
      const res = await submitScenario(scenarioData)
      clearInterval(tick)
      setStep(7)
      setRunId(res.run_id)
      setOutput(res.output)
      setStatus('complete')
      setSection('mission')
    } catch (e: unknown) {
      clearInterval(tick)
      setError(e instanceof Error ? e.message : 'Pipeline failed.')
      setStatus('error')
      setStep(0)
    }
  }

  return (
    <>
      <DisclaimerModal />

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <ClassificationBanner />
        <SystemHeader isOnline={status !== 'error'} />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <ScenarioPanel
            isRunning={status === 'running'}
            completedSteps={step}
            onSubmit={handleSubmit}
          />

          {/* Main */}
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Section nav — only when output exists */}
            {output && (
              <div className="tab-bar" style={{ paddingLeft: 4, flexShrink: 0 }}>
                {SECTIONS.map(s => (
                  <button
                    key={s.id}
                    className={`tab-btn ${section === s.id ? 'active' : ''}`}
                    onClick={() => setSection(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
                <div style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '0 16px',
                  fontFamily: 'var(--font-data)',
                  fontSize: '0.68rem',
                  color: '#3a5060',
                }}>
                  {runId && <span>RUN {runId.slice(0, 8).toUpperCase()}</span>}
                  <span className="dot dot-green" />
                  <span style={{ color: '#1acd6e', letterSpacing: '0.05em' }}>COMPLETE</span>
                </div>
              </div>
            )}

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

              {status === 'idle' && <SplashScreen />}

              {status === 'running' && <RunningScreen step={step} />}

              {status === 'error' && error && (
                <div style={{
                  padding: 16,
                  background: '#130808',
                  border: '1px solid #3a1010',
                  color: '#e84545',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.85rem',
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                    Pipeline Error
                  </div>
                  {error}
                  <div style={{ color: '#3a5060', fontSize: '0.75rem', marginTop: 8 }}>
                    Verify ANTHROPIC_API_KEY and that the backend is running on port 8000.
                  </div>
                </div>
              )}

              {output && (
                <div className="fade-in">
                  {section === 'mission' && (
                    <MissionAnalysisPanel missionAnalysis={output.mission_analysis} receipt={output.receipt} />
                  )}
                  {section === 'coa' && (
                    <COASection
                      coas={output.coas}
                      analyses={output.coa_analyses}
                      comparisons={output.coa_comparisons}
                      recommendedCoaId={output.approval.recommended_coa_id}
                    />
                  )}
                  {section === 'rec' && (
                    <RecommendationPanel approval={output.approval} coas={output.coas} runId={runId ?? undefined} />
                  )}
                  {section === 'opord' && <OPORDPanel opord={output.opord} />}
                  {section === 'fires' && <FiresPanel />}
                </div>
              )}
            </div>
          </main>
        </div>

        <ClassificationBanner />
      </div>
    </>
  )
}

/* ── Splash ──────────────────────────────────────────────────────── */
function SplashScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: '0.75rem',
          color: '#1acd6e',
          letterSpacing: '0.2em',
          marginBottom: 12,
        }}>
          SYSTEM READY
        </div>

        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '1.8rem',
          fontWeight: 700,
          color: '#ddeeff',
          lineHeight: 1.2,
          marginBottom: 20,
        }}>
          IRONFORGE
        </div>

        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '1rem',
          color: '#8099b0',
          fontStyle: 'italic',
          lineHeight: 1.6,
          paddingLeft: 16,
          borderLeft: '2px solid #c8a84b',
          marginBottom: 32,
        }}>
          The hardest problem in warfare is not firepower.<br />
          It is the decision.
        </div>

        <div style={{ borderTop: '1px solid #171f2b', paddingTop: 20 }}>
          {[
            'Select a scenario in the left panel',
            'Execute the seven-step MDMP pipeline',
            'Review three generated Courses of Action',
            'Examine wargaming results and decision matrix',
            'Retrieve formatted OPORD fragment',
            'Access fires targeting workflow — HPTL, AGM, TST',
          ].map((t, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: 12,
              padding: '5px 0',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.85rem',
              color: '#3a5060',
            }}>
              <span style={{ fontFamily: 'var(--font-data)', color: '#1f2d3e', minWidth: 20 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {t}
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 24,
          fontFamily: 'var(--font-data)',
          fontSize: '0.65rem',
          color: '#1f2d3e',
          letterSpacing: '0.08em',
        }}>
          FM 6-0 · FM 2-01.3 · FM 3-60 · FM 3-09 · ADRP 5-0 · JP 3-0 · JP 3-60 · CJCSI 3160.01A
        </div>
      </div>
    </div>
  )
}

/* ── Running ─────────────────────────────────────────────────────── */
function RunningScreen({ step }: { step: number }) {
  const steps = [
    'Receipt of Mission',
    'Mission Analysis',
    'COA Development',
    'COA Analysis — Wargaming',
    'COA Comparison',
    'COA Approval',
    'Orders Production',
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: '0.72rem',
          color: '#c8a84b',
          letterSpacing: '0.15em',
          marginBottom: 20,
        }}>
          MDMP PIPELINE EXECUTING
        </div>

        {steps.map((name, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 12px',
              marginBottom: 4,
              background: i < step ? 'rgba(26,205,110,0.04)' : i === step ? 'rgba(200,168,75,0.06)' : 'transparent',
              border: '1px solid',
              borderColor: i < step ? '#1a3520' : i === step ? '#4a3a10' : '#171f2b',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-data)',
              fontSize: '0.7rem',
              color: i < step ? '#1acd6e' : i === step ? '#c8a84b' : '#1f2d3e',
              minWidth: 20,
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.85rem',
              color: i < step ? '#3a5060' : i === step ? '#ddeeff' : '#1f2d3e',
              fontWeight: i === step ? 600 : 400,
            }}>
              {name}
            </span>
            {i === step && (
              <span style={{
                marginLeft: 'auto',
                fontFamily: 'var(--font-data)',
                fontSize: '0.65rem',
                color: '#c8a84b',
                animation: 'blink 1s step-end infinite',
              }}>
                PROCESSING
              </span>
            )}
            {i < step && (
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-data)', fontSize: '0.65rem', color: '#1acd6e' }}>
                DONE
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
