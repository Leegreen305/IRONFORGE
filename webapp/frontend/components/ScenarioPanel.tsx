'use client'

import { useState } from 'react'
import { loadScenario } from '@/lib/api'
import { MDMPStepTracker } from './MDMPStepTracker'

const SCENARIOS: Record<string, { label: string; summary: string }> = {
  time_sensitive_targeting:    { label: 'Time Sensitive Targeting',       summary: 'TF Hunter · HVI logistics coordinator · 4-hr window · Urban' },
  brigade_defense_peer_threat: { label: 'Brigade Defense — Peer Threat',  summary: '2d BCT · Peer mechanized BTG · 18-hr deliberate MDMP' },
  cyber_physical_fob:          { label: 'Cyber-Physical FOB Attack',      summary: 'Combined cyber + physical threat · FOB C2 degradation' },
  contested_airspace_cas:      { label: 'Contested Airspace CAS',         summary: 'A-10 CAS · Degraded comms · JTAC coordination' },
  multi_domain_strike:         { label: 'Multi-Domain Strike',            summary: 'Joint kinetic + cyber + EW + space · IADS defeat' },
}

const REFS = [
  { pub: 'FM 6-0',    desc: 'MDMP' },
  { pub: 'FM 2-01.3', desc: 'IPB' },
  { pub: 'FM 3-60',   desc: 'Targeting' },
  { pub: 'FM 3-09',   desc: 'Fire Support' },
  { pub: 'ADRP 5-0',  desc: 'Ops Process' },
  { pub: 'JP 3-0',    desc: 'Joint Ops' },
  { pub: 'JP 3-60',   desc: 'Joint Targeting' },
  { pub: 'ADP 3-0',   desc: 'Operations' },
]

export function ScenarioPanel({ isRunning, completedSteps, onSubmit }: {
  isRunning: boolean
  completedSteps: number
  onSubmit: (data: Record<string, unknown>) => void
}) {
  const [mode, setMode]         = useState<'prebuilt' | 'custom'>('prebuilt')
  const [selected, setSelected] = useState('')
  const [customJson, setCustomJson] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const execute = async () => {
    setError('')
    if (mode === 'prebuilt') {
      if (!selected) { setError('Select a scenario.'); return }
      setLoading(true)
      try { onSubmit(await loadScenario(selected)) }
      catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed') }
      finally { setLoading(false) }
    } else {
      try { onSubmit(JSON.parse(customJson)) }
      catch { setError('Invalid JSON.') }
    }
  }

  const busy = isRunning || loading

  return (
    <aside style={{
      width: 288,
      flexShrink: 0,
      background: '#080b11',
      borderRight: '1px solid #171f2b',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>

      {/* ── Scenario selection ── */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          color: '#8099b0',
          marginBottom: 10,
        }}>
          Scenario
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
          {(['prebuilt', 'custom'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: '6px 0',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.75rem',
                fontWeight: mode === m ? 600 : 400,
                background: mode === m ? '#111820' : 'transparent',
                color: mode === m ? '#ddeeff' : '#8099b0',
                border: '1px solid',
                borderColor: mode === m ? '#1f2d3e' : '#171f2b',
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
            >
              {m === 'prebuilt' ? 'Pre-built' : 'Custom JSON'}
            </button>
          ))}
        </div>

        {mode === 'prebuilt' ? (
          <div>
            <select
              className="tac-select"
              style={{ marginBottom: 8 }}
              value={selected}
              onChange={e => setSelected(e.target.value)}
            >
              <option value="">Select scenario…</option>
              {Object.entries(SCENARIOS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>

            {selected && (
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.78rem',
                color: '#8099b0',
                lineHeight: 1.55,
                padding: '8px 10px',
                background: '#07090f',
                border: '1px solid #171f2b',
                marginBottom: 4,
              }}>
                {SCENARIOS[selected]?.summary}
              </div>
            )}
          </div>
        ) : (
          <textarea
            className="tac-textarea"
            style={{ fontSize: '0.75rem', minHeight: 130 }}
            placeholder={'{\n  "title": "...",\n  "mission_type": "OFFENSE"\n}'}
            value={customJson}
            onChange={e => setCustomJson(e.target.value)}
          />
        )}

        {error && (
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.78rem',
            color: '#e84545',
            padding: '6px 10px',
            background: '#160a0a',
            border: '1px solid #3a1010',
            marginTop: 6,
          }}>
            {error}
          </div>
        )}

        <button
          className="btn-execute"
          style={{ marginTop: 12, marginBottom: 20 }}
          onClick={execute}
          disabled={busy}
        >
          {busy ? 'EXECUTING…' : 'EXECUTE MDMP'}
        </button>
      </div>

      <div style={{ height: 1, background: '#171f2b' }} />

      {/* ── MDMP steps ── */}
      <div style={{ padding: '16px 16px 0' }}>
        <MDMPStepTracker completedSteps={completedSteps} isRunning={isRunning} />
      </div>

      <div style={{ height: 1, background: '#171f2b', marginTop: 16 }} />

      {/* ── Doctrine refs ── */}
      <div style={{ padding: '14px 16px', flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          color: '#8099b0',
          marginBottom: 10,
        }}>
          Doctrine
        </div>
        {REFS.map(r => (
          <div key={r.pub} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            padding: '4px 0',
            borderBottom: '1px solid #171f2b',
          }}>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.72rem', color: '#b4c8d8' }}>{r.pub}</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#3a5060' }}>{r.desc}</span>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid #171f2b',
        fontFamily: 'var(--font-data)',
        fontSize: '0.62rem',
        color: '#1f2d3e',
        letterSpacing: '0.06em',
        lineHeight: 1.6,
      }}>
        UNCLASSIFIED // TRAINING AID<br />
        ALL REFERENCES PUBLICLY AVAILABLE
      </div>
    </aside>
  )
}
