'use client'

import { useState } from 'react'
import type { COA, COAAnalysisResult, COAComparisonResult } from '@/types'

const COA_COLORS: Record<string, { accent: string; dimAccent: string; label: string }> = {
  'COA-A': { accent: '#3b82f6', dimAccent: '#1e3a5f', label: 'ALPHA' },
  'COA-B': { accent: '#c8a84b', dimAccent: '#7a6420', label: 'BRAVO' },
  'COA-C': { accent: '#16b960', dimAccent: '#0a3020', label: 'CHARLIE' },
}

interface Props {
  coa: COA
  analysis?: COAAnalysisResult
  comparison?: COAComparisonResult
  isRecommended?: boolean
}

export function COACard({ coa, analysis, comparison, isRecommended }: Props) {
  const [tab, setTab] = useState<'concept' | 'wargame' | 'scores'>('concept')
  const colors = COA_COLORS[coa.coa_id] || { accent: '#c8a84b', dimAccent: '#7a6420', label: coa.coa_id }

  return (
    <div
      className="coa-card flex flex-col"
      style={{
        borderTopColor: colors.accent,
        borderTopWidth: 2,
        ...(isRecommended ? { borderColor: '#c8a84b', boxShadow: '0 0 16px rgba(200,168,75,0.12)' } : {}),
      }}
    >
      {/* Card Header */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ background: '#0a1018', borderBottom: '1px solid #1e2d3d' }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: colors.accent, fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
            ◈ {coa.coa_id}
          </span>
          <span style={{ color: '#4a6680', fontSize: '0.62rem' }}>//</span>
          <span style={{ color: colors.accent, fontSize: '0.62rem', letterSpacing: '0.08em' }}>
            {colors.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isRecommended && (
            <span
              className="px-2 py-0.5 text-xs tracking-wider"
              style={{ border: '1px solid #c8a84b', color: '#c8a84b', fontSize: '0.58rem', letterSpacing: '0.15em' }}
            >
              RECOMMENDED
            </span>
          )}
          <span
            className="px-1.5 py-0.5 text-xs"
            style={{ background: `${colors.accent}18`, color: colors.accent, fontSize: '0.58rem', border: `1px solid ${colors.dimAccent}` }}
          >
            {coa.status}
          </span>
        </div>
      </div>

      {/* COA Name */}
      <div className="px-3 pt-2 pb-1">
        <div style={{ color: '#c8dae8', fontSize: '0.78rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>
          {coa.name.toUpperCase()}
        </div>
        <div style={{ color: '#4a6680', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {coa.type} operation
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex px-3 gap-0" style={{ borderBottom: '1px solid #1e2d3d' }}>
        {(['concept', 'wargame', 'scores'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-1.5 text-xs tracking-wider uppercase border-b-2 transition-colors"
            style={{
              borderBottomColor: tab === t ? colors.accent : 'transparent',
              color: tab === t ? colors.accent : '#4a6680',
              background: 'transparent',
              fontSize: '0.62rem',
              letterSpacing: '0.12em',
            }}
          >
            {t === 'concept' ? 'Concept' : t === 'wargame' ? 'Wargame' : 'Scores'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 p-3 overflow-y-auto" style={{ maxHeight: 360 }}>
        {tab === 'concept' && (
          <ConceptTab coa={coa} accentColor={colors.accent} />
        )}
        {tab === 'wargame' && analysis && (
          <WargameTab analysis={analysis} accentColor={colors.accent} />
        )}
        {tab === 'scores' && comparison && (
          <ScoresTab comparison={comparison} accentColor={colors.accent} />
        )}
        {tab === 'wargame' && !analysis && (
          <PlaceholderMessage msg="Wargaming data not available." />
        )}
        {tab === 'scores' && !comparison && (
          <PlaceholderMessage msg="Comparison scores not available." />
        )}
      </div>

      {/* Card Footer */}
      {comparison && (
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ borderTop: '1px solid #1e2d3d', background: '#0a1018' }}
        >
          <span style={{ color: '#4a6680', fontSize: '0.62rem' }}>TOTAL WEIGHTED SCORE</span>
          <span style={{ color: colors.accent, fontSize: '0.8rem', fontWeight: 'bold' }}>
            {comparison.total_score.toFixed(2)} / 5.00
          </span>
          <span
            className="px-2 py-0.5"
            style={{ border: `1px solid ${colors.dimAccent}`, color: colors.accent, fontSize: '0.62rem' }}
          >
            RANK #{comparison.rank}
          </span>
        </div>
      )}
    </div>
  )
}

function ConceptTab({ coa, accentColor }: { coa: COA; accentColor: string }) {
  return (
    <div className="space-y-3">
      <DataBlock label="Concept of Operations" text={coa.description} accentColor={accentColor} />
      <DataBlock label="Decisive Operation" text={coa.decisive_operation} accentColor={accentColor} highlight />
      <div>
        <SectionLabel label="Shaping Operations" accentColor={accentColor} />
        <ul className="space-y-1 mt-1">
          {coa.shaping_operations.map((op, i) => (
            <li key={i} className="flex gap-2" style={{ fontSize: '0.72rem' }}>
              <span style={{ color: '#4a6680' }}>•</span>
              <span style={{ color: '#a0b4c8' }}>{op}</span>
            </li>
          ))}
        </ul>
      </div>
      {coa.sustaining_operation && (
        <DataBlock label="Sustaining Operation" text={coa.sustaining_operation} accentColor={accentColor} />
      )}
      <div>
        <SectionLabel label="Risk Assessment" accentColor="#ef4444" />
        <div style={{ color: '#ef7777', fontSize: '0.72rem', lineHeight: 1.6, marginTop: 4 }}>
          ⚠ {coa.risk_assessment}
        </div>
      </div>
    </div>
  )
}

function WargameTab({ analysis, accentColor }: { analysis: COAAnalysisResult; accentColor: string }) {
  return (
    <div className="space-y-3">
      {analysis.wargame_sequences.map((seq) => (
        <div key={seq.sequence_num} className="space-y-1.5" style={{ border: '1px solid #1e2d3d', padding: 8 }}>
          <div style={{ color: accentColor, fontSize: '0.62rem', letterSpacing: '0.1em', marginBottom: 4 }}>
            SEQ {seq.sequence_num}{seq.key_decision ? ' — DECISION POINT' : ''}
          </div>
          <WargameRow label="FRIENDLY ACT" text={seq.friendly_action} color="#3b82f6" />
          <WargameRow label="ENEMY REACT"  text={seq.enemy_reaction}   color="#ef4444" />
          <WargameRow label="COUNTER ACT"  text={seq.friendly_counteraction} color="#16b960" />
          <div style={{ color: '#4a6680', fontSize: '0.65rem', borderTop: '1px solid #1e2d3d', paddingTop: 4, marginTop: 4 }}>
            OUTCOME: <span style={{ color: '#a0b4c8' }}>{seq.outcome}</span>
          </div>
          {seq.key_decision && (
            <div style={{ color: '#c8a84b', fontSize: '0.65rem' }}>
              ◈ DECISION: {seq.key_decision}
            </div>
          )}
        </div>
      ))}

      {/* Assessment */}
      <div style={{ borderTop: '1px solid #1e2d3d', paddingTop: 8 }}>
        <SectionLabel label="Overall Assessment" accentColor={accentColor} />
        <p style={{ color: '#a0b4c8', fontSize: '0.72rem', lineHeight: 1.6, marginTop: 4 }}>
          {analysis.overall_assessment}
        </p>
      </div>

      {/* Strengths / Weaknesses */}
      <div className="grid grid-cols-2 gap-2">
        <ListBlock label="Strengths" items={analysis.strengths} color="#16b960" />
        <ListBlock label="Weaknesses" items={analysis.weaknesses} color="#ef4444" />
      </div>
      {analysis.hazards.length > 0 && (
        <ListBlock label="Hazards" items={analysis.hazards} color="#f59e0b" />
      )}
    </div>
  )
}

function ScoresTab({ comparison, accentColor }: { comparison: COAComparisonResult; accentColor: string }) {
  return (
    <div className="space-y-2">
      {comparison.scores.map((s) => (
        <div key={s.criterion}>
          <div className="flex items-center justify-between mb-0.5">
            <span style={{ color: '#a0b4c8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {s.criterion}
            </span>
            <div className="flex items-center gap-2">
              <span style={{ color: '#4a6680', fontSize: '0.6rem' }}>w={s.weight.toFixed(2)}</span>
              <span style={{ color: accentColor, fontSize: '0.72rem', fontWeight: 'bold' }}>
                {s.raw_score}/5
              </span>
            </div>
          </div>
          {/* Score bar */}
          <div className="flex items-center gap-2">
            <div className="score-bar-track flex-1">
              <div
                className="score-bar-fill"
                style={{ width: `${(s.raw_score / 5) * 100}%`, background: accentColor }}
              />
            </div>
            <span style={{ color: '#4a6680', fontSize: '0.62rem', minWidth: 32, textAlign: 'right' }}>
              {s.weighted_score.toFixed(2)}
            </span>
          </div>
          <div style={{ color: '#2d4a6a', fontSize: '0.6rem', marginTop: 2 }}>{s.rationale}</div>
        </div>
      ))}
    </div>
  )
}

/* ── sub-components ───────────────────────────────────────────────── */

function DataBlock({ label, text, accentColor, highlight }: { label: string; text: string; accentColor: string; highlight?: boolean }) {
  return (
    <div>
      <SectionLabel label={label} accentColor={accentColor} />
      <div
        className="mt-1 px-2 py-1.5 text-xs leading-relaxed"
        style={{
          color: highlight ? '#c8dae8' : '#a0b4c8',
          background: highlight ? `${accentColor}08` : 'transparent',
          border: highlight ? `1px solid ${accentColor}30` : 'none',
        }}
      >
        {text}
      </div>
    </div>
  )
}

function SectionLabel({ label, accentColor }: { label: string; accentColor: string }) {
  return (
    <div style={{ color: accentColor, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
      {label}
    </div>
  )
}

function WargameRow({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <div className="flex gap-2" style={{ borderLeft: `2px solid ${color}`, paddingLeft: 6 }}>
      <span style={{ color, fontSize: '0.58rem', minWidth: 72, letterSpacing: '0.08em' }}>{label}</span>
      <span style={{ color: '#a0b4c8', fontSize: '0.68rem', lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}

function ListBlock({ label, items, color }: { label: string; items: string[]; color: string }) {
  return (
    <div>
      <div style={{ color, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <ul className="space-y-0.5">
        {items.map((it, i) => (
          <li key={i} style={{ color: '#a0b4c8', fontSize: '0.68rem' }}>
            <span style={{ color }}>▸</span> {it}
          </li>
        ))}
      </ul>
    </div>
  )
}

function PlaceholderMessage({ msg }: { msg: string }) {
  return <div style={{ color: '#4a6680', fontSize: '0.72rem' }}>{msg}</div>
}
