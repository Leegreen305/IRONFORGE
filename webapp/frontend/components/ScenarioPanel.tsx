'use client'

import { useEffect, useState } from 'react'
import { listScenarios, loadScenario } from '@/lib/api'
import { MDMPStepTracker } from './MDMPStepTracker'

const SCENARIO_KEYS: Record<string, string> = {
  time_sensitive_targeting:    'Time Sensitive Targeting',
  brigade_defense_peer_threat: 'Brigade Defense — Peer Threat',
  cyber_physical_fob:          'Cyber-Physical FOB Attack',
  contested_airspace_cas:      'Contested Airspace CAS',
  multi_domain_strike:         'Multi-Domain Strike',
}

interface Props {
  isRunning: boolean
  completedSteps: number
  onSubmit: (data: Record<string, unknown>) => void
}

export function ScenarioPanel({ isRunning, completedSteps, onSubmit }: Props) {
  const [mode, setMode] = useState<'prebuilt' | 'custom'>('prebuilt')
  const [selected, setSelected] = useState('')
  const [customJson, setCustomJson] = useState('')
  const [loadError, setLoadError] = useState('')
  const [loadingScenario, setLoadingScenario] = useState(false)

  const handleExecute = async () => {
    setLoadError('')
    if (mode === 'prebuilt') {
      if (!selected) { setLoadError('Select a scenario first.'); return }
      setLoadingScenario(true)
      try {
        const data = await loadScenario(selected)
        onSubmit(data)
      } catch (e: unknown) {
        setLoadError(e instanceof Error ? e.message : 'Load failed')
      } finally {
        setLoadingScenario(false)
      }
    } else {
      try {
        const parsed = JSON.parse(customJson)
        onSubmit(parsed)
      } catch {
        setLoadError('Invalid JSON in custom scenario.')
      }
    }
  }

  const busy = isRunning || loadingScenario

  return (
    <aside
      className="flex flex-col gap-3 p-3 overflow-y-auto shrink-0"
      style={{
        width: 280,
        background: '#090e1a',
        borderRight: '1px solid #1e2d3d',
        minHeight: '100%',
      }}
    >
      {/* ── Scenario Input ── */}
      <div className="tac-panel p-3 relative">
        <div className="corner-bracket corner-tl" />
        <div className="corner-bracket corner-tr" />
        <div className="corner-bracket corner-bl" />
        <div className="corner-bracket corner-br" />

        <div className="tac-section-header">Scenario Parameters</div>

        {/* Mode toggle */}
        <div className="flex gap-1 mb-3">
          {(['prebuilt', 'custom'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-1 text-xs tracking-wider uppercase border transition-colors ${
                mode === m
                  ? 'border-tac-gold text-tac-gold bg-tac-gold-dim'
                  : 'border-tac-border text-tac-dim hover:border-tac-text hover:text-tac-text'
              }`}
              style={{ background: mode === m ? 'rgba(200,168,75,0.08)' : 'transparent' }}
            >
              {m === 'prebuilt' ? 'Pre-built' : 'Custom JSON'}
            </button>
          ))}
        </div>

        {mode === 'prebuilt' ? (
          <div>
            <div className="tac-panel-label mb-1" style={{ fontSize: '0.62rem' }}>
              Select Scenario
            </div>
            <select
              className="tac-select mb-2"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">-- SELECT --</option>
              {Object.entries(SCENARIO_KEYS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            {selected && (
              <div className="text-xs mt-1 px-2 py-1" style={{ color: '#4a6680', background: '#080d18', border: '1px solid #1e2d3d' }}>
                {ScenarioDescriptions[selected] || ''}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="tac-panel-label mb-1" style={{ fontSize: '0.62rem' }}>
              Paste Scenario JSON
            </div>
            <textarea
              className="tac-textarea text-xs"
              style={{ minHeight: 140, fontSize: '0.65rem' }}
              placeholder={JSON_PLACEHOLDER}
              value={customJson}
              onChange={(e) => setCustomJson(e.target.value)}
            />
          </div>
        )}

        {loadError && (
          <div className="text-xs mt-2 px-2 py-1 border" style={{ color: '#ef4444', borderColor: '#4a1010', background: '#1a0808' }}>
            ⚠ {loadError}
          </div>
        )}

        <button
          className="btn-execute w-full mt-3"
          onClick={handleExecute}
          disabled={busy}
        >
          {busy ? '▶ EXECUTING MDMP...' : '▶ EXECUTE MDMP PIPELINE'}
        </button>
      </div>

      {/* ── MDMP Step Tracker ── */}
      <MDMPStepTracker completedSteps={completedSteps} isRunning={isRunning} />

      {/* ── Doctrine Quick Ref ── */}
      <div className="tac-panel p-3">
        <div className="tac-section-header">Doctrine References</div>
        <div className="space-y-1.5">
          {DOCTRINE_REFS.map((r) => (
            <div key={r.pub} className="flex justify-between gap-2">
              <span style={{ color: '#c8a84b', fontSize: '0.62rem' }}>{r.pub}</span>
              <span style={{ color: '#4a6680', fontSize: '0.62rem', textAlign: 'right' }}>{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── System note ── */}
      <div className="text-center" style={{ color: '#2d4a6a', fontSize: '0.58rem', letterSpacing: '0.1em' }}>
        UNCLASSIFIED // TRAINING AID ONLY<br />
        ALL REFERENCES PUBLICLY AVAILABLE
      </div>
    </aside>
  )
}

const ScenarioDescriptions: Record<string, string> = {
  time_sensitive_targeting:    'TF Hunter conducts TST against HVI logistics coordinator. 4-hour window. Urban environment.',
  brigade_defense_peer_threat: '2d BCT defends sector against mechanized peer-threat BTG. 18-hour planning cycle.',
  cyber_physical_fob:          'Threat actor conducts combined cyber and physical attack against FOB C2 node.',
  contested_airspace_cas:      'A-10 CAS mission in contested airspace with degraded comms. JTAC coordination.',
  multi_domain_strike:         'Joint multi-domain strike against IADS. Kinetic, cyber, EW, and space integration.',
}

const DOCTRINE_REFS = [
  { pub: 'FM 6-0',     desc: 'MDMP' },
  { pub: 'FM 2-01.3',  desc: 'IPB' },
  { pub: 'FM 3-60',    desc: 'Targeting' },
  { pub: 'FM 3-09',    desc: 'Fire Support' },
  { pub: 'ADRP 5-0',   desc: 'Ops Process' },
  { pub: 'JP 3-0',     desc: 'Joint Ops' },
  { pub: 'JP 3-60',    desc: 'Joint Targeting' },
  { pub: 'ADP 3-0',    desc: 'Operations' },
]

const JSON_PLACEHOLDER = `{
  "title": "...",
  "mission_type": "OFFENSE",
  "friendly_force": [...],
  "enemy_force": [...],
  "terrain": [...],
  "weather": {...},
  "time_available": "12 hours"
}`
