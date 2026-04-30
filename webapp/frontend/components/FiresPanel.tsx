'use client'

import { useState } from 'react'
import { nominateTarget } from '@/lib/api'

const F2T2EA_STAGES = ['FIND', 'FIX', 'TRACK', 'TARGET', 'ENGAGE', 'ASSESS']

const DEMO_HPTL = [
  {
    id: 'HPT-001',
    name: 'Enemy AD Radar',
    type: 'Air Defense System',
    priority: 'High Payoff Target',
    effect: 'Suppress/Destroy',
    engagement: 'ATACMS / Joint Strike',
    status: 'TRACK',
  },
  {
    id: 'HPT-002',
    name: 'Enemy C2 Node',
    type: 'Command and Control',
    priority: 'High Payoff Target',
    effect: 'Destroy/Disrupt',
    engagement: 'Precision Strike / Cyber',
    status: 'TARGET',
  },
  {
    id: 'HPT-003',
    name: 'Enemy LOC Bridge',
    type: 'Infrastructure',
    priority: 'High Value Target',
    effect: 'Interdict',
    engagement: 'Field Artillery / Aviation',
    status: 'FIX',
  },
  {
    id: 'HPT-004',
    name: 'Enemy Fuel Depot',
    type: 'Logistics Node',
    priority: 'High Value Target',
    effect: 'Destroy',
    engagement: 'Field Artillery',
    status: 'FIND',
  },
]

const AGM_ROWS = [
  { priority: 'P1', target_type: 'Air Defense Systems',   when: 'On order',         effect: 'Destroy',   who: 'Joint Fires / ATACMS', restrict: 'PID required' },
  { priority: 'P2', target_type: 'C2 Nodes',              when: 'H-hour to H+4',    effect: 'Destroy',   who: 'JDAM / HIMARS',        restrict: 'No populated areas' },
  { priority: 'P3', target_type: 'Enemy Maneuver Forces', when: 'On contact',       effect: 'Suppress',  who: 'Field Artillery',      restrict: 'FSCM compliance' },
  { priority: 'P4', target_type: 'Logistics Nodes',       when: 'As acquired',      effect: 'Interdict', who: 'MLRS / HIMARS',        restrict: '1000m from civilians' },
]

const FSCM_ITEMS = [
  { measure: 'Fire Support Coordination Line (FSCL)',  location: 'PL PHANTOM',    authority: 'Joint Force Commander' },
  { measure: 'Coordinated Fire Line (CFL)',             location: 'PL DRAGON',     authority: 'Brigade Commander' },
  { measure: 'No-Fire Area (NFA)',                      location: 'GRID 38SMB123456', authority: 'Commander' },
  { measure: 'Restrictive Fire Line (RFL)',              location: 'PL SPECTER',    authority: 'Division Commander' },
  { measure: 'Free Fire Area (FFA)',                    location: 'GRID 38SMB789012', authority: 'Brigade Commander' },
]

type TabType = 'hptl' | 'agm' | 'fscm' | 'nominate'

export function FiresPanel() {
  const [tab, setTab] = useState<TabType>('hptl')
  const [nominateForm, setNominateForm] = useState({
    name: '', target_type: '', priority: 'High Payoff Target', location_description: '',
    desired_effect: 'Destroy', recommended_engagement: 'Field Artillery',
  })
  const [nominateResult, setNominateResult] = useState<null | Record<string, unknown>>(null)
  const [nominateError, setNominateError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleNominate = async () => {
    setSubmitting(true)
    setNominateError('')
    setNominateResult(null)
    try {
      const result = await nominateTarget({
        target_id: `T-${Date.now().toString().slice(-6)}`,
        ...nominateForm,
      })
      setNominateResult(result as Record<string, unknown>)
    } catch (e: unknown) {
      setNominateError(e instanceof Error ? e.message : 'Nomination failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="tac-panel fade-in">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: '1px solid #1e2d3d', background: '#0a1018' }}
      >
        <div className="flex items-center gap-3">
          <span className="tac-panel-label">Fires Integration // Targeting</span>
          <span style={{ color: '#2d4a6a', fontSize: '0.65rem' }}>FM 3-09 · FM 3-60 · JP 3-60</span>
        </div>
        <div style={{ color: '#4a6680', fontSize: '0.62rem' }}>F2T2EA KILL CHAIN TRACKER</div>
      </div>

      {/* F2T2EA tracker strip */}
      <div className="px-4 py-2 flex items-center gap-1" style={{ borderBottom: '1px solid #1e2d3d', background: '#080d18' }}>
        <span style={{ color: '#4a6680', fontSize: '0.6rem', marginRight: 8 }}>F2T2EA:</span>
        {F2T2EA_STAGES.map((s) => (
          <span key={s} className="f2t2ea-stage">
            {s}
          </span>
        ))}
        <span style={{ color: '#2d4a6a', fontSize: '0.58rem', marginLeft: 8 }}>FM 3-60 §2-1</span>
      </div>

      {/* Tab nav */}
      <div className="flex px-4 gap-0" style={{ borderBottom: '1px solid #1e2d3d' }}>
        {([
          { key: 'hptl', label: 'HPTL' },
          { key: 'agm',  label: 'AGM' },
          { key: 'fscm', label: 'FSCM' },
          { key: 'nominate', label: 'Nominate' },
        ] as { key: TabType; label: string }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 text-xs tracking-wider uppercase border-b-2 transition-colors"
            style={{
              borderBottomColor: tab === t.key ? '#c8a84b' : 'transparent',
              color: tab === t.key ? '#c8a84b' : '#4a6680',
              background: 'transparent',
              fontSize: '0.65rem',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === 'hptl' && <HPTLView />}
        {tab === 'agm'  && <AGMView />}
        {tab === 'fscm' && <FSCMView />}
        {tab === 'nominate' && (
          <NominateView
            form={nominateForm}
            setForm={setNominateForm}
            onSubmit={handleNominate}
            result={nominateResult}
            error={nominateError}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  )
}

/* ── HPTL ───────────────────────────────────────────────────────── */
function HPTLView() {
  return (
    <div>
      <div className="tac-section-header">High Payoff Target List // FM 3-60 §4-1</div>
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.68rem' }}>
          <thead>
            <tr style={{ background: '#0a1018' }}>
              {['ID', 'TARGET', 'TYPE', 'PRIORITY', 'EFFECT', 'ENGAGEMENT', 'F2T2EA'].map((h) => (
                <th key={h} style={thS}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEMO_HPTL.map((t, i) => {
              const stageIdx = F2T2EA_STAGES.indexOf(t.status)
              return (
                <tr key={t.id} style={{ background: i % 2 === 0 ? '#0d1420' : '#080d18', borderBottom: '1px solid #1e2d3d' }}>
                  <td style={tdS}><span style={{ color: '#c8a84b' }}>{t.id}</span></td>
                  <td style={{ ...tdS, color: '#c8dae8' }}>{t.name}</td>
                  <td style={{ ...tdS, color: '#a0b4c8' }}>{t.type}</td>
                  <td style={tdS}>
                    <span style={{ color: t.priority.includes('High Payoff') ? '#ef4444' : '#f59e0b', fontSize: '0.62rem' }}>
                      {t.priority}
                    </span>
                  </td>
                  <td style={{ ...tdS, color: '#a0b4c8' }}>{t.effect}</td>
                  <td style={{ ...tdS, color: '#a0b4c8' }}>{t.engagement}</td>
                  <td style={tdS}>
                    <div className="flex gap-0.5">
                      {F2T2EA_STAGES.map((s, si) => (
                        <span
                          key={s}
                          style={{
                            width: 8, height: 8, display: 'inline-block',
                            background: si <= stageIdx ? '#16b960' : '#1e2d3d',
                          }}
                          title={s}
                        />
                      ))}
                      <span style={{ color: '#16b960', fontSize: '0.6rem', marginLeft: 4 }}>{t.status}</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── AGM ────────────────────────────────────────────────────────── */
function AGMView() {
  return (
    <div>
      <div className="tac-section-header">Attack Guidance Matrix // FM 3-60 §4-12</div>
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.68rem' }}>
          <thead>
            <tr style={{ background: '#0a1018' }}>
              {['PRI', 'TARGET TYPE', 'WHEN', 'EFFECT', 'MEANS', 'RESTRICTIONS'].map((h) => (
                <th key={h} style={thS}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AGM_ROWS.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#0d1420' : '#080d18', borderBottom: '1px solid #1e2d3d' }}>
                <td style={{ ...tdS, color: '#c8a84b', fontWeight: 'bold' }}>{row.priority}</td>
                <td style={{ ...tdS, color: '#c8dae8' }}>{row.target_type}</td>
                <td style={{ ...tdS, color: '#a0b4c8' }}>{row.when}</td>
                <td style={{ ...tdS, color: '#ef7777' }}>{row.effect}</td>
                <td style={{ ...tdS, color: '#a0b4c8' }}>{row.who}</td>
                <td style={{ ...tdS, color: '#4a6680', fontSize: '0.62rem' }}>{row.restrict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── FSCM ───────────────────────────────────────────────────────── */
function FSCMView() {
  return (
    <div>
      <div className="tac-section-header">Fire Support Coordination Measures // FM 3-09 Ch.5</div>
      <div className="space-y-2">
        {FSCM_ITEMS.map((item, i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-4 p-2"
            style={{ background: '#080d18', border: '1px solid #1e2d3d' }}
          >
            <div>
              <div style={{ color: '#c8a84b', fontSize: '0.68rem', letterSpacing: '0.05em' }}>{item.measure}</div>
              <div style={{ color: '#4a6680', fontSize: '0.62rem' }}>Auth: {item.authority}</div>
            </div>
            <div
              className="px-2 py-1 shrink-0"
              style={{ border: '1px solid #1e3a5f', color: '#3b82f6', fontSize: '0.62rem', letterSpacing: '0.08em' }}
            >
              {item.location}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Target Nomination form ─────────────────────────────────────── */
interface NominateViewProps {
  form: Record<string, string>
  setForm: (f: Record<string, string>) => void
  onSubmit: () => void
  result: Record<string, unknown> | null
  error: string
  submitting: boolean
}

function NominateView({ form, setForm, onSubmit, result, error, submitting }: NominateViewProps) {
  const field = (key: string, label: string, type: 'input' | 'select' = 'input', opts?: string[]) => (
    <div key={key}>
      <div style={{ color: '#c8a84b', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>
        {label}
      </div>
      {type === 'input' ? (
        <input
          className="tac-input"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ) : (
        <select
          className="tac-select"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        >
          {opts!.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
    </div>
  )

  return (
    <div>
      <div className="tac-section-header">Target Nomination // FM 3-60 §2-1 (F2T2EA)</div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {field('name', 'Target Name')}
        {field('target_type', 'Target Type')}
        {field('priority', 'Priority', 'select', ['High Payoff Target', 'High Value Target', 'TAI'])}
        {field('desired_effect', 'Desired Effect', 'select', ['Destroy', 'Suppress', 'Neutralize', 'Interdict', 'Disrupt'])}
        {field('recommended_engagement', 'Recommended Means', 'select', ['Field Artillery', 'HIMARS / MLRS', 'ATACMS', 'Joint Strike', 'Aviation', 'Cyber', 'EW', 'Special Operations'])}
        {field('location_description', 'Location Description')}
      </div>

      <button className="btn-execute" onClick={onSubmit} disabled={submitting || !form.name}>
        {submitting ? '▶ NOMINATING...' : '▶ NOMINATE TARGET'}
      </button>

      {error && (
        <div className="mt-3 p-2 text-xs" style={{ color: '#ef4444', border: '1px solid #4a1010', background: '#1a0808' }}>
          ⚠ {error}
        </div>
      )}

      {result && (
        <div className="mt-3 p-3" style={{ background: '#080d18', border: '1px solid #1e3a5f' }}>
          <div style={{ color: '#16b960', fontSize: '0.62rem', letterSpacing: '0.12em', marginBottom: 6 }}>
            ◈ TARGET NOMINATED — ID: {result.target_id as string}
          </div>
          <div style={{ color: '#a0b4c8', fontSize: '0.7rem' }}>
            {result.name as string} // {result.target_type as string} // Status: {result.f2t2ea_status as string}
          </div>
          {result.citation && (
            <div style={{ color: '#2d4a6a', fontSize: '0.6rem', marginTop: 4 }}>
              Doctrine: {(result.citation as { pub: string; paragraph: string }).pub} §{(result.citation as { pub: string; paragraph: string }).paragraph}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const thS: React.CSSProperties = {
  padding: '6px 10px',
  textAlign: 'left',
  color: '#4a6680',
  fontSize: '0.6rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  borderBottom: '1px solid #1e2d3d',
  fontWeight: 'normal',
  whiteSpace: 'nowrap',
}

const tdS: React.CSSProperties = {
  padding: '5px 10px',
  fontSize: '0.68rem',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
}
