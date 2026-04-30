'use client'

import { useEffect, useRef, useState } from 'react'
import { nominateTarget } from '@/lib/api'

/* ── Types ────────────────────────────────────────────────────────── */

type TabType = 'hptl' | 'agm' | 'tst' | 'board' | 'fscm' | 'nominate'

type NominateFormState = {
  name: string
  target_type: string
  priority: string
  location_description: string
  desired_effect: string
  recommended_engagement: string
  engagement_authority: string
  cde_category: string
  roe_reference: string
  pid_confirmed: string
  tst_eligible: string
}

/* ── Static data ──────────────────────────────────────────────────── */

const F2T2EA_STAGES = ['FIND', 'FIX', 'TRACK', 'TARGET', 'ENGAGE', 'ASSESS']

const CDE_COLORS: Record<string, string> = {
  'CAT I':   '#16b960',
  'CAT II':  '#c8a84b',
  'CAT III': '#f59e0b',
  'CAT IV':  '#ef4444',
}

const DECISION_COLORS: Record<string, string> = {
  'APPROVED':              '#16b960',
  'DEFERRED':              '#f59e0b',
  'REMOVED FROM LIST':     '#ef4444',
  'CONTINUE COLLECTION':   '#3b82f6',
}

const HPTL_DATA = [
  {
    id: 'HPT-001', name: 'Enemy AD Radar // 9S18 Kupol',
    type: 'Air Defense System', priority: 'HPT', effect: 'Destroy',
    engagement: 'ATACMS / Joint Strike', status: 'TARGET', authority: 'JFC',
    cde: 'CAT I', bda: '—', pid: 'CONFIRMED', roe: 'SROE Ch.3', tst: true,
  },
  {
    id: 'HPT-002', name: 'Enemy BTG TAC CP',
    type: 'Command and Control', priority: 'HPT', effect: 'Destroy',
    engagement: 'HIMARS GMLRS', status: 'TARGET', authority: 'CDR DIV',
    cde: 'CAT II', bda: '—', pid: 'CONFIRMED', roe: 'SROE Ch.3', tst: false,
  },
  {
    id: 'HPT-003', name: 'Bridge VIC ROUTE HAWK',
    type: 'LOC / Infrastructure', priority: 'HVT', effect: 'Interdict',
    engagement: 'M109A7 Paladin', status: 'TRACK', authority: 'CDR BCT',
    cde: 'CAT III', bda: '—', pid: 'CONFIRMED', roe: 'LOAC', tst: false,
  },
  {
    id: 'HPT-004', name: 'Enemy CSSP Fuel Point',
    type: 'Logistics Node', priority: 'HVT', effect: 'Destroy',
    engagement: 'M109A7 Paladin', status: 'FIX', authority: 'CDR BCT',
    cde: 'CAT II', bda: '—', pid: 'UNCONFIRMED', roe: 'LOAC', tst: false,
  },
  {
    id: 'TAI-005', name: 'Enemy ATGM PLT Vicin GRID 38SMB 789',
    type: 'Anti-Armor System', priority: 'TAI', effect: 'Suppress',
    engagement: 'M109A7 / AH-64E', status: 'FIND', authority: 'CDR BCT',
    cde: 'CAT II', bda: '—', pid: 'UNCONFIRMED', roe: 'LOAC', tst: false,
  },
]

const AGM_DATA = [
  {
    priority: 'P1', target_type: 'Air Defense Systems',
    when: 'On order', effect: 'Destroy', means: 'Joint Strike / ATACMS',
    authority: 'JFC', cde_req: 'CAT I',
    restrict: 'PID req; NSL deconfliction; CJCSI 3160.01A',
  },
  {
    priority: 'P2', target_type: 'Enemy C2 Nodes',
    when: 'H-hour to H+4', effect: 'Destroy', means: 'HIMARS GMLRS',
    authority: 'CDR DIV', cde_req: 'CAT II',
    restrict: 'No fires NFA TOWN BRAVO; PID required',
  },
  {
    priority: 'P3', target_type: 'Enemy Maneuver Forces',
    when: 'On contact in EAs', effect: 'Suppress / Neutralize', means: 'M109A7 (6-tube volley)',
    authority: 'CDR BCT', cde_req: 'CAT II',
    restrict: 'FSCM compliance; ROE proportionality',
  },
  {
    priority: 'P4', target_type: 'Enemy Logistics Nodes',
    when: 'As acquired beyond CFL', effect: 'Interdict', means: 'MLRS / HIMARS',
    authority: 'CDR BCT', cde_req: 'CAT III',
    restrict: '1000m min from civilian areas; legal review req',
  },
]

const FSCM_DATA = [
  { measure: 'Fire Support Coordination Line (FSCL)', location: 'PL PHANTOM', authority: 'JFC', ref: 'FM 3-09 §5-12' },
  { measure: 'Coordinated Fire Line (CFL)',            location: 'PL DRAGON',  authority: 'CDR BCT', ref: 'FM 3-09 §5-8' },
  { measure: 'No-Fire Area (NFA) — Hospital TOWN B',  location: '500m radius GRID 38SMB 234 567', authority: 'CDR BCT', ref: 'FM 3-09 §5-14' },
  { measure: 'Restrictive Fire Line (RFL)',            location: 'PL SPECTER', authority: 'CDR DIV', ref: 'FM 3-09 §5-10' },
  { measure: 'No-Strike List (NSL)',                   location: 'IAW CJCSI 3160.01A Annex A', authority: 'JFC / Legal', ref: 'JP 3-60 §III-6' },
]

const TST_TRACK = {
  id: 'TST-ALPHA-001',
  target: 'HPT-001 // Enemy AD Radar // 9S18 Kupol',
  sroe: 'SROE Chapter 3',
  authority: 'JFC',
  cde: 'CAT I',
  pid: 'CONFIRMED',
  engagement_means: 'ATACMS Block IIA',
  window_seconds_start: 37 * 60 + 22,
  approval_chain: [
    { step: 'Fires Cell — Target nominated to TST track', dtg: '042148APR26', status: 'COMPLETE' },
    { step: 'S3 — Engagement criteria confirmed / PID confirmed', dtg: '042152APR26', status: 'COMPLETE' },
    { step: 'SJA — CDE CAT I legal review complete', dtg: '042155APR26', status: 'COMPLETE' },
    { step: 'CDR BCT — Authority delegated to CDR DIV', dtg: '042157APR26', status: 'COMPLETE' },
    { step: 'CDR DIV — Authority delegated to JFC', dtg: '042159APR26', status: 'COMPLETE' },
    { step: 'JFC — Engagement authority granted', dtg: '—', status: 'PENDING' },
  ],
  criteria: [
    { label: 'Positive Identification (PID)', met: true,  ref: 'FM 3-60 §4-8',     note: 'Multi-source: SIGINT + pattern of life + visual' },
    { label: 'CDE Category I — Minimal risk', met: true,  ref: 'CJCSI 3160.01A',   note: 'No civilian structures within 500m' },
    { label: 'No-Strike List deconfliction',  met: true,  ref: 'JP 3-60 §III-6',   note: 'NSL checked — NOT on restricted list' },
    { label: 'SROE Ch.3 compliance',          met: true,  ref: 'CJCSI 5810.01D',   note: 'Lawful military objective confirmed' },
    { label: 'Engagement authority (JFC req)', met: false, ref: 'JP 3-60 §III-4',  note: 'ATACMS employment requires JFC authority — AWAITING' },
  ],
}

const BOARD_DATA = {
  meeting: 'DAILY TARGETING MEETING',
  dtg: '042200APR26',
  cycle: 'DELIBERATE',
  chair: 'CDR BCT / FSO',
  ref: 'JP 3-60 §II-7',
  targets: [
    { id: 'HPT-001', name: 'Enemy AD Radar',      priority: 'HPT', f2t2ea: 'TARGET', cde: 'CAT I',   auth: 'JFC',     recommendation: 'STRIKE',              decision: 'APPROVED',            tst: true },
    { id: 'HPT-002', name: 'Enemy BTG TAC CP',    priority: 'HPT', f2t2ea: 'TARGET', cde: 'CAT II',  auth: 'CDR DIV', recommendation: 'STRIKE',              decision: 'APPROVED',            tst: false },
    { id: 'HPT-003', name: 'Bridge ROUTE HAWK',   priority: 'HVT', f2t2ea: 'TRACK',  cde: 'CAT III', auth: 'CDR BCT', recommendation: 'HOLD — CDE review req', decision: 'DEFERRED',           tst: false },
    { id: 'HPT-004', name: 'Enemy CSSP',          priority: 'HVT', f2t2ea: 'FIX',    cde: 'CAT II',  auth: 'CDR BCT', recommendation: 'CONTINUE COLLECTION', decision: 'CONTINUE COLLECTION', tst: false },
    { id: 'TAI-005', name: 'Enemy ATGM PLT',      priority: 'TAI', f2t2ea: 'FIND',   cde: 'CAT II',  auth: 'CDR BCT', recommendation: 'CONTINUE COLLECTION', decision: 'CONTINUE COLLECTION', tst: false },
  ],
}

/* ── Main FiresPanel component ────────────────────────────────────── */

export function FiresPanel() {
  const [tab, setTab] = useState<TabType>('hptl')
  const [nominateForm, setNominateForm] = useState<NominateFormState>({
    name: '', target_type: '', priority: 'High Payoff Target',
    location_description: '', desired_effect: 'Destroy',
    recommended_engagement: 'Field Artillery',
    engagement_authority: 'CDR BCT', cde_category: 'CAT II',
    roe_reference: 'SROE Chapter 3', pid_confirmed: 'false',
    tst_eligible: 'false',
  })
  const [nominateResult, setNominateResult] = useState<Record<string, unknown> | null>(null)
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
        pid_confirmed: nominateForm.pid_confirmed === 'true',
        tst_eligible: nominateForm.tst_eligible === 'true',
        cde_category: nominateForm.cde_category,
        roe_restrictions: [],
      })
      setNominateResult(result as Record<string, unknown>)
    } catch (e: unknown) {
      setNominateError(e instanceof Error ? e.message : 'Nomination failed')
    } finally {
      setSubmitting(false)
    }
  }

  const TABS: { key: TabType; label: string }[] = [
    { key: 'hptl',     label: 'HPTL' },
    { key: 'agm',      label: 'AGM' },
    { key: 'tst',      label: 'TST' },
    { key: 'board',    label: 'BOARD' },
    { key: 'fscm',     label: 'FSCM' },
    { key: 'nominate', label: 'Nominate' },
  ]

  return (
    <div className="tac-panel fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1e2d3d', background: '#0a1018' }}>
        <div className="flex items-center gap-3">
          <span className="tac-panel-label">Fires Integration // Targeting</span>
          <span style={{ color: '#4a6880', fontSize: '0.78rem' }}>FM 3-09 · FM 3-60 · JP 3-60 · CJCSI 3160.01A</span>
        </div>
        <div style={{ color: '#7a9ab8', fontSize: '0.78rem' }}>F2T2EA KILL CHAIN</div>
      </div>

      {/* F2T2EA tracker strip */}
      <div className="px-4 py-2 flex items-center gap-2 flex-wrap" style={{ borderBottom: '1px solid #1e2d3d', background: '#080d18' }}>
        <span style={{ color: '#7a9ab8', fontSize: '0.75rem', marginRight: 4 }}>F2T2EA:</span>
        {F2T2EA_STAGES.map((s, i) => (
          <span
            key={s}
            className="f2t2ea-stage"
            style={{
              borderColor: i < 4 ? '#16b960' : i === 4 ? '#c8a84b' : '#1e2d3d',
              color: i < 4 ? '#16b960' : i === 4 ? '#c8a84b' : '#4a6880',
              background: i < 4 ? 'rgba(22,185,96,0.06)' : i === 4 ? 'rgba(200,168,75,0.06)' : 'transparent',
            }}
          >
            {s}
          </span>
        ))}
        <span style={{ color: '#3a5a7a', fontSize: '0.72rem', marginLeft: 8 }}>FM 3-60 §2-1 (Nov 2023)</span>
        <span style={{ marginLeft: 'auto', color: '#c8a84b', fontSize: '0.75rem' }}>
          TST TRACK: ALPHA-001 ACTIVE
        </span>
      </div>

      {/* Tab nav */}
      <div className="flex px-4 gap-0 flex-wrap" style={{ borderBottom: '1px solid #1e2d3d' }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 border-b-2 transition-colors"
            style={{
              borderBottomColor: tab === t.key ? '#c8a84b' : 'transparent',
              color: tab === t.key ? '#c8a84b' : '#7a9ab8',
              background: 'transparent',
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
            }}
          >
            {t.label}
            {t.key === 'tst' && <span style={{ marginLeft: 4, color: '#ef4444', fontSize: '0.65rem' }}>●</span>}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === 'hptl'     && <HPTLView />}
        {tab === 'agm'      && <AGMView />}
        {tab === 'tst'      && <TSTView />}
        {tab === 'board'    && <TargetingBoardView />}
        {tab === 'fscm'     && <FSCMView />}
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

/* ── HPTL ─────────────────────────────────────────────────────────── */

function HPTLView() {
  const stageIdx = (s: string) => F2T2EA_STAGES.indexOf(s)

  return (
    <div>
      <SectionHeader label="High Payoff Target List" ref_="FM 3-60 §4-1" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#0a1018' }}>
              {['ID', 'TARGET', 'TYPE', 'PRI', 'EFFECT', 'MEANS', 'PID', 'CDE', 'AUTH', 'ROE', 'F2T2EA', 'BDA'].map(h => (
                <th key={h} style={thS}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HPTL_DATA.map((t, i) => {
              const si = stageIdx(t.status)
              return (
                <tr key={t.id} style={{ background: i % 2 === 0 ? '#0d1420' : '#080d18', borderBottom: '1px solid #1e2d3d' }}>
                  <td style={tdS}>
                    <span style={{ color: '#c8a84b', fontWeight: 'bold' }}>{t.id}</span>
                    {t.tst && <span style={{ display: 'block', color: '#ef4444', fontSize: '0.65rem', letterSpacing: '0.08em' }}>TST</span>}
                  </td>
                  <td style={{ ...tdS, color: '#daeaf8', maxWidth: 180 }}>{t.name}</td>
                  <td style={{ ...tdS, color: '#b8cede' }}>{t.type}</td>
                  <td style={tdS}>
                    <span style={{ color: t.priority === 'HPT' ? '#ef4444' : t.priority === 'HVT' ? '#f59e0b' : '#7a9ab8', fontSize: '0.78rem', fontWeight: 'bold' }}>
                      {t.priority}
                    </span>
                  </td>
                  <td style={{ ...tdS, color: '#b8cede' }}>{t.effect}</td>
                  <td style={{ ...tdS, color: '#b8cede' }}>{t.engagement}</td>
                  <td style={tdS}>
                    <span style={{ color: t.pid === 'CONFIRMED' ? '#16b960' : '#ef4444', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {t.pid === 'CONFIRMED' ? '✓ PID' : '✗ PID'}
                    </span>
                  </td>
                  <td style={tdS}>
                    <span style={{ color: CDE_COLORS[t.cde] || '#7a9ab8', fontWeight: 'bold', fontSize: '0.78rem' }}>{t.cde}</span>
                  </td>
                  <td style={{ ...tdS, color: '#b8cede', fontSize: '0.75rem' }}>{t.authority}</td>
                  <td style={{ ...tdS, color: '#7a9ab8', fontSize: '0.72rem' }}>{t.roe}</td>
                  <td style={tdS}>
                    <div className="flex gap-0.5 items-center">
                      {F2T2EA_STAGES.map((_, fi) => (
                        <div key={fi} style={{ width: 8, height: 8, background: fi <= si ? '#16b960' : '#1e2d3d' }} />
                      ))}
                      <span style={{ color: si >= 3 ? '#c8a84b' : '#7a9ab8', fontSize: '0.7rem', marginLeft: 4, fontWeight: 'bold' }}>
                        {t.status}
                      </span>
                    </div>
                  </td>
                  <td style={{ ...tdS, color: '#4a6880', fontSize: '0.72rem' }}>{t.bda}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div style={{ color: '#3a5a7a', fontSize: '0.72rem', marginTop: 10 }}>
        HPT = High Payoff Target · HVT = High Value Target · TAI = Target Area of Interest · PID = Positive Identification · CDE = Collateral Damage Estimate
      </div>
    </div>
  )
}

/* ── AGM ──────────────────────────────────────────────────────────── */

function AGMView() {
  return (
    <div>
      <SectionHeader label="Attack Guidance Matrix" ref_="FM 3-60 §4-12 — CDR APPROVED 042200APR26" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#0a1018' }}>
              {['PRI', 'TARGET TYPE', 'WHEN', 'EFFECT', 'MEANS', 'AUTHORITY', 'CDE REQ', 'RESTRICTIONS'].map(h => (
                <th key={h} style={thS}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AGM_DATA.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#0d1420' : '#080d18', borderBottom: '1px solid #1e2d3d' }}>
                <td style={{ ...tdS, color: '#c8a84b', fontWeight: 'bold', fontSize: '0.9rem' }}>{row.priority}</td>
                <td style={{ ...tdS, color: '#daeaf8', fontWeight: 'bold' }}>{row.target_type}</td>
                <td style={{ ...tdS, color: '#b8cede' }}>{row.when}</td>
                <td style={{ ...tdS, color: '#ef7777' }}>{row.effect}</td>
                <td style={{ ...tdS, color: '#b8cede' }}>{row.means}</td>
                <td style={tdS}>
                  <span style={{ color: row.authority === 'JFC' ? '#ef4444' : row.authority === 'CDR DIV' ? '#f59e0b' : '#c8a84b', fontWeight: 'bold', fontSize: '0.78rem' }}>
                    {row.authority}
                  </span>
                </td>
                <td style={tdS}>
                  <span style={{ color: CDE_COLORS[row.cde_req] || '#7a9ab8', fontWeight: 'bold', fontSize: '0.78rem' }}>{row.cde_req}</span>
                </td>
                <td style={{ ...tdS, color: '#7a9ab8', fontSize: '0.75rem' }}>{row.restrict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ color: '#3a5a7a', fontSize: '0.72rem', marginTop: 10 }}>
        All engagements require ROE compliance · CDE per CJCSI 3160.01A · NSL deconfliction per JP 3-60 §III-6 · LOAC / SROE Ch.3 apply throughout
      </div>
    </div>
  )
}

/* ── TST ──────────────────────────────────────────────────────────── */

function TSTView() {
  const [seconds, setSeconds] = useState(TST_TRACK.window_seconds_start)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds(s => Math.max(0, s - 1))
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  const urgency = seconds < 600 ? '#ef4444' : seconds < 1200 ? '#f59e0b' : '#c8a84b'

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <SectionHeader label="Time-Sensitive Targeting" ref_="FM 3-60 §5-1 · JP 3-60" />
        <div
          style={{ border: '1px solid #ef4444', background: 'rgba(239,68,68,0.08)', padding: '2px 10px' }}
        >
          <span style={{ color: '#ef4444', fontSize: '0.72rem', letterSpacing: '0.12em' }}>● TST ACTIVE</span>
        </div>
      </div>

      {/* Track ID bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <InfoBlock label="TST TRACK" value={TST_TRACK.id} color="#ef4444" />
        <InfoBlock label="SROE AUTHORITY" value={TST_TRACK.sroe} color="#c8a84b" />
        <InfoBlock label="ENGAGEMENT AUTH" value={TST_TRACK.authority} color="#c8a84b" />
        <div style={{ background: '#080d18', border: `1px solid ${urgency}`, padding: '8px 12px' }}>
          <div style={{ color: '#7a9ab8', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: 4 }}>WINDOW REMAINING</div>
          <div style={{ color: urgency, fontSize: '1.6rem', fontWeight: 'bold', letterSpacing: '0.1em', fontFamily: 'monospace' }}>
            {mm}:{ss}
          </div>
        </div>
      </div>

      {/* Target */}
      <div style={{ background: '#080d18', border: '1px solid #1e3a5f', padding: '12px 16px' }}>
        <div style={{ color: '#7a9ab8', fontSize: '0.72rem', letterSpacing: '0.1em', marginBottom: 4 }}>DESIGNATED TARGET</div>
        <div style={{ color: '#daeaf8', fontSize: '0.95rem', fontWeight: 'bold' }}>{TST_TRACK.target}</div>
        <div className="flex gap-6 mt-2 flex-wrap">
          <span style={{ color: '#7a9ab8', fontSize: '0.78rem' }}>CDE: <span style={{ color: CDE_COLORS[TST_TRACK.cde] }}>{TST_TRACK.cde}</span></span>
          <span style={{ color: '#7a9ab8', fontSize: '0.78rem' }}>PID: <span style={{ color: '#16b960' }}>{TST_TRACK.pid}</span></span>
          <span style={{ color: '#7a9ab8', fontSize: '0.78rem' }}>MEANS: <span style={{ color: '#b8cede' }}>{TST_TRACK.engagement_means}</span></span>
        </div>
      </div>

      {/* Approval chain */}
      <div>
        <div className="tac-section-header">Approval Chain Status // JP 3-60 §III-4</div>
        <div className="space-y-2">
          {TST_TRACK.approval_chain.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-3 py-2"
              style={{
                background: step.status === 'COMPLETE' ? 'rgba(22,185,96,0.04)' : 'rgba(200,168,75,0.04)',
                border: `1px solid ${step.status === 'COMPLETE' ? '#0a3020' : '#7a6420'}`,
              }}
            >
              <span style={{ fontSize: '0.9rem', color: step.status === 'COMPLETE' ? '#16b960' : '#c8a84b', marginTop: 1 }}>
                {step.status === 'COMPLETE' ? '◈' : '▶'}
              </span>
              <div className="flex-1">
                <div style={{ color: step.status === 'COMPLETE' ? '#b8cede' : '#daeaf8', fontSize: '0.85rem' }}>{step.step}</div>
              </div>
              <div style={{ color: step.status === 'COMPLETE' ? '#16b960' : '#c8a84b', fontSize: '0.75rem', flexShrink: 0, fontWeight: 'bold' }}>
                {step.dtg}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement criteria */}
      <div>
        <div className="tac-section-header">Engagement Criteria Checklist</div>
        <div className="space-y-2">
          {TST_TRACK.criteria.map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <span style={{ color: c.met ? '#16b960' : '#ef4444', fontSize: '0.9rem', flexShrink: 0, marginTop: 1 }}>
                {c.met ? '✓' : '✗'}
              </span>
              <div className="flex-1">
                <div style={{ color: c.met ? '#b8cede' : '#ef7777', fontSize: '0.85rem' }}>{c.label}</div>
                <div style={{ color: '#4a6880', fontSize: '0.72rem', marginTop: 1 }}>{c.note}</div>
              </div>
              <div style={{ color: '#3a5a7a', fontSize: '0.72rem', flexShrink: 0 }}>{c.ref}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ color: '#3a5a7a', fontSize: '0.72rem', borderTop: '1px solid #1e2d3d', paddingTop: 8 }}>
        TST process per FM 3-60 §5-1 · Engagement authority per JP 3-60 §III-4 · ROE: SROE Chapter 3 · LOAC applies throughout
      </div>
    </div>
  )
}

/* ── TARGETING BOARD ──────────────────────────────────────────────── */

function TargetingBoardView() {
  const approved   = BOARD_DATA.targets.filter(t => t.decision === 'APPROVED')
  const deferred   = BOARD_DATA.targets.filter(t => t.decision === 'DEFERRED')
  const collecting = BOARD_DATA.targets.filter(t => t.decision === 'CONTINUE COLLECTION')

  return (
    <div className="space-y-4">
      {/* Board header */}
      <div style={{ background: '#080d18', border: '1px solid #1e3a5f', padding: '12px 16px' }}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div style={{ color: '#c8a84b', fontSize: '0.82rem', fontWeight: 'bold', letterSpacing: '0.1em' }}>
              {BOARD_DATA.meeting}
            </div>
            <div style={{ color: '#7a9ab8', fontSize: '0.78rem', marginTop: 2 }}>
              {BOARD_DATA.dtg} · CHAIR: {BOARD_DATA.chair} · CYCLE: {BOARD_DATA.cycle}
            </div>
          </div>
          <div style={{ color: '#3a5a7a', fontSize: '0.72rem' }}>{BOARD_DATA.ref}</div>
        </div>
      </div>

      <SectionHeader label="Target Review Table" ref_="JP 3-60 §II-7 · Daily Targeting Cycle" />

      {/* Board table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#0a1018' }}>
              {['ID', 'TARGET', 'PRI', 'F2T2EA', 'CDE', 'AUTH', 'RECOMMENDATION', 'BOARD DECISION'].map(h => (
                <th key={h} style={thS}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BOARD_DATA.targets.map((t, i) => (
              <tr
                key={t.id}
                style={{
                  background: t.decision === 'APPROVED' ? 'rgba(22,185,96,0.04)' : i % 2 === 0 ? '#0d1420' : '#080d18',
                  borderBottom: '1px solid #1e2d3d',
                }}
              >
                <td style={tdS}>
                  <span style={{ color: '#c8a84b', fontWeight: 'bold' }}>{t.id}</span>
                  {t.tst && <span style={{ display: 'block', color: '#ef4444', fontSize: '0.65rem' }}>TST</span>}
                </td>
                <td style={{ ...tdS, color: '#daeaf8' }}>{t.name}</td>
                <td style={tdS}>
                  <span style={{ color: t.priority === 'HPT' ? '#ef4444' : t.priority === 'HVT' ? '#f59e0b' : '#7a9ab8', fontWeight: 'bold', fontSize: '0.78rem' }}>
                    {t.priority}
                  </span>
                </td>
                <td style={{ ...tdS, color: t.f2t2ea === 'TARGET' ? '#c8a84b' : '#b8cede', fontWeight: t.f2t2ea === 'TARGET' ? 'bold' : 'normal' }}>
                  {t.f2t2ea}
                </td>
                <td style={tdS}>
                  <span style={{ color: CDE_COLORS[t.cde] || '#7a9ab8', fontWeight: 'bold', fontSize: '0.78rem' }}>{t.cde}</span>
                </td>
                <td style={{ ...tdS, color: '#b8cede', fontSize: '0.78rem' }}>{t.auth}</td>
                <td style={{ ...tdS, color: '#b8cede', fontSize: '0.78rem' }}>{t.recommendation}</td>
                <td style={tdS}>
                  <span style={{ color: DECISION_COLORS[t.decision] || '#7a9ab8', fontWeight: 'bold', fontSize: '0.78rem' }}>
                    {t.decision === 'APPROVED' ? '✓ ' : t.decision === 'DEFERRED' ? '⟳ ' : '→ '}
                    {t.decision}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* JIPTL status */}
      <div style={{ background: '#0a1018', border: '1px solid #1e2d3d', padding: '12px 16px' }}>
        <div style={{ color: '#c8a84b', fontSize: '0.78rem', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 'bold' }}>
          JIPTL STATUS // JP 3-60 §II-1
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <JIPTLStat label="APPROVED FOR ENGAGEMENT" value={approved.length} color="#16b960" />
          <JIPTLStat label="DEFERRED — REVIEW REQ"   value={deferred.length}   color="#f59e0b" />
          <JIPTLStat label="CONTINUE COLLECTION"     value={collecting.length} color="#3b82f6" />
          <JIPTLStat label="TST TRACKS ACTIVE"       value={BOARD_DATA.targets.filter(t => t.tst).length} color="#ef4444" />
        </div>
        <div style={{ color: '#3a5a7a', fontSize: '0.72rem', marginTop: 8 }}>
          Board authority: CDR BCT for CAT I/II · CDR DIV for CAT III · JFC for strategic/ATACMS · Next board: 052200APR26
        </div>
      </div>
    </div>
  )
}

/* ── FSCM ─────────────────────────────────────────────────────────── */

function FSCMView() {
  return (
    <div>
      <SectionHeader label="Fire Support Coordination Measures" ref_="FM 3-09 Ch.5" />
      <div className="space-y-2">
        {FSCM_DATA.map((item, i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-4 p-3"
            style={{ background: '#080d18', border: '1px solid #1e2d3d' }}
          >
            <div className="flex-1">
              <div style={{ color: '#c8a84b', fontSize: '0.82rem', letterSpacing: '0.04em', fontWeight: 'bold' }}>{item.measure}</div>
              <div style={{ color: '#7a9ab8', fontSize: '0.75rem', marginTop: 2 }}>Auth: {item.authority}</div>
            </div>
            <div className="shrink-0 text-right">
              <div style={{ color: '#3b82f6', fontSize: '0.82rem', fontWeight: 'bold' }}>{item.location}</div>
              <div style={{ color: '#3a5a7a', fontSize: '0.7rem', marginTop: 2 }}>{item.ref}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ color: '#3a5a7a', fontSize: '0.72rem', marginTop: 10 }}>
        All FSCM must be published in the Fire Support Annex and reflected in the AFATDS database before execution.
      </div>
    </div>
  )
}

/* ── NOMINATE ─────────────────────────────────────────────────────── */

interface NominateViewProps {
  form: NominateFormState
  setForm: (f: NominateFormState) => void
  onSubmit: () => void
  result: Record<string, unknown> | null
  error: string
  submitting: boolean
}

function NominateView({ form, setForm, onSubmit, result, error, submitting }: NominateViewProps) {
  const f = (key: keyof NominateFormState, label: string, type: 'input' | 'select' = 'input', opts?: string[]) => (
    <div key={key}>
      <div style={{ color: '#c8a84b', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 4 }}>
        {label}
      </div>
      {type === 'input' ? (
        <input className="tac-input" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
      ) : (
        <select className="tac-select" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}>
          {opts!.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
    </div>
  )

  return (
    <div>
      <SectionHeader label="Target Nomination // F2T2EA" ref_="FM 3-60 §2-1 · JP 3-60 §III-4" />

      <div className="grid grid-cols-2 gap-3 mb-4">
        {f('name',                  'Target Name')}
        {f('target_type',           'Target Type')}
        {f('priority',              'Priority',             'select', ['High Payoff Target', 'High Value Target', 'TAI'])}
        {f('desired_effect',        'Desired Effect',       'select', ['Destroy', 'Suppress', 'Neutralize', 'Interdict', 'Disrupt', 'Delay'])}
        {f('recommended_engagement','Recommended Means',    'select', ['Field Artillery', 'HIMARS GMLRS', 'ATACMS', 'Joint Strike', 'Aviation / CCA', 'Cyber', 'EW', 'Special Operations'])}
        {f('location_description',  'Location / MGRS')}
        {f('engagement_authority',  'Engagement Authority', 'select', ['CDR BCT', 'CDR DIV', 'CDR Corps', 'JFC', 'SecDef / POTUS'])}
        {f('cde_category',          'CDE Category',         'select', ['CAT I — Minimal risk (BCT auth)', 'CAT II — Low risk (DIV auth)', 'CAT III — Significant risk (JFC auth)', 'CAT IV — High risk (SecDef auth)'])}
        {f('roe_reference',         'ROE Reference',        'select', ['SROE Chapter 3', 'LOAC — Proportionality', 'Mission-specific ROE', 'SOFA restrictions apply'])}
        {f('pid_confirmed',         'PID Confirmed',        'select', ['false', 'true'])}
        {f('tst_eligible',          'TST Eligible',         'select', ['false', 'true'])}
      </div>

      <div
        className="mb-4 p-3"
        style={{ background: '#080d18', border: '1px solid #1e2d3d', fontSize: '0.78rem', color: '#7a9ab8' }}
      >
        <span style={{ color: '#c8a84b', fontWeight: 'bold' }}>⚠ LEGAL NOTE: </span>
        All nominations require PID confirmation (FM 3-60 §4-8), CDE assessment (CJCSI 3160.01A), and NSL/RTL deconfliction (JP 3-60 §III-6) before progression to TARGET status.
      </div>

      <button className="btn-execute" onClick={onSubmit} disabled={submitting || !form.name}>
        {submitting ? '▶ NOMINATING...' : '▶ NOMINATE TARGET'}
      </button>

      {error && (
        <div className="mt-3 p-3" style={{ color: '#ef4444', border: '1px solid #4a1010', background: '#1a0808', fontSize: '0.82rem' }}>
          ⚠ {error}
        </div>
      )}

      {result && (
        <div className="mt-3 p-4 space-y-2" style={{ background: '#080d18', border: '1px solid #1e3a5f' }}>
          <div style={{ color: '#16b960', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 'bold' }}>
            ◈ TARGET NOMINATED — ID: {String(result.target_id)}
          </div>
          <div style={{ color: '#b8cede', fontSize: '0.85rem' }}>
            {String(result.name)} // {String(result.target_type)} // Status: <strong>{String(result.f2t2ea_status)}</strong>
          </div>
          <div style={{ color: '#7a9ab8', fontSize: '0.78rem' }}>
            Authority: {String(result.engagement_authority)} · ROE: {String(result.roe_reference)}
          </div>
          {result.citation != null && (
            <div style={{ color: '#3a5a7a', fontSize: '0.72rem' }}>
              Doctrine: {String((result.citation as { pub: string; paragraph: string }).pub)} §{String((result.citation as { pub: string; paragraph: string }).paragraph)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────────────── */

function SectionHeader({ label, ref_ }: { label: string; ref_: string }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <div className="tac-section-header" style={{ marginBottom: 0, borderBottom: 'none' }}>{label}</div>
      <div style={{ color: '#3a5a7a', fontSize: '0.72rem' }}>{ref_}</div>
    </div>
  )
}

function InfoBlock({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: '#080d18', border: '1px solid #1e2d3d', padding: '8px 12px' }}>
      <div style={{ color: '#7a9ab8', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
      <div style={{ color, fontSize: '0.88rem', fontWeight: 'bold' }}>{value}</div>
    </div>
  )
}

function JIPTLStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color, fontSize: '1.8rem', fontWeight: 'bold', lineHeight: 1.1 }}>{value}</div>
      <div style={{ color: '#7a9ab8', fontSize: '0.7rem', marginTop: 3, letterSpacing: '0.06em' }}>{label}</div>
    </div>
  )
}

const thS: React.CSSProperties = {
  padding: '8px 12px', textAlign: 'left', color: '#7a9ab8',
  fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase',
  borderBottom: '1px solid #1e2d3d', fontWeight: 'normal', whiteSpace: 'nowrap',
}

const tdS: React.CSSProperties = {
  padding: '8px 12px', fontSize: '0.82rem', verticalAlign: 'top',
}
