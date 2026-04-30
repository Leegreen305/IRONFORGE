'use client'

import type { MissionAnalysisResult } from '@/types'

const METTTC_FIELDS = [
  { key: 'mission',                     label: 'M — Mission' },
  { key: 'enemy',                       label: 'E — Enemy' },
  { key: 'terrain_and_weather',         label: 'T — Terrain & Weather' },
  { key: 'troops_and_support_available', label: 'T — Troops & Support' },
  { key: 'time_available',              label: 'T — Time Available' },
  { key: 'civil_considerations',        label: 'C — Civil Considerations' },
]

interface Props {
  missionAnalysis: MissionAnalysisResult
  receipt?: {
    mission_type: string
    classification: string
    time_available_hours: number | null
    initial_assessment: string
    key_tasks_identified: string[]
  }
}

export function MissionAnalysisPanel({ missionAnalysis, receipt }: Props) {
  const { mett_tc, restated_mission, specified_tasks, implied_tasks, essential_tasks } = missionAnalysis

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Restated mission — primary element, biggest, most visible */}
      <div>
        <PanelLabel>Restated Mission</PanelLabel>
        <div style={{
          padding: '14px 18px',
          background: '#0c1118',
          border: '1px solid #1f2d3e',
          fontFamily: 'var(--font-ui)',
          fontSize: '1rem',
          fontWeight: 500,
          color: '#ddeeff',
          lineHeight: 1.65,
        }}>
          {restated_mission}
        </div>
      </div>

      {/* METT-TC grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <PanelLabel>METT-TC Analysis</PanelLabel>
          <RefTag>FM 6-0 §9-32</RefTag>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {METTTC_FIELDS.map(({ key, label }) => (
            <div key={key} style={{
              padding: '12px 14px',
              background: '#07090f',
              border: '1px solid #171f2b',
            }}>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                color: '#c8a84b',
                marginBottom: 8,
              }}>
                {label}
              </div>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.85rem',
                color: '#b4c8d8',
                lineHeight: 1.6,
              }}>
                {mett_tc[key as keyof typeof mett_tc]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks — three columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <TaskList title="Specified Tasks" tasks={specified_tasks} ref_="FM 6-0 §9-53" accentColor="#4a8fff" />
        <TaskList title="Implied Tasks"   tasks={implied_tasks}   ref_="FM 6-0 §9-54" accentColor="#c8a84b" />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <PanelLabel>Essential Tasks</PanelLabel>
          <RefTag>FM 6-0 §9-57</RefTag>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
          {essential_tasks.map((t, i) => (
            <div key={i} style={{
              padding: '6px 12px',
              background: 'rgba(26,205,110,0.06)',
              border: '1px solid rgba(26,205,110,0.2)',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.85rem',
              color: '#b4c8d8',
            }}>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Initial assessment */}
      {receipt && (
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <PanelLabel>Initial Assessment</PanelLabel>
            <div style={{ display: 'flex', gap: 12 }}>
              <RefTag>FM 6-0 §9-20</RefTag>
              <span style={{
                fontFamily: 'var(--font-data)',
                fontSize: '0.72rem',
                color: '#4a8fff',
                border: '1px solid #1e3a5f',
                padding: '1px 8px',
              }}>
                {receipt.classification.toUpperCase()}
              </span>
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.85rem',
            color: '#8099b0',
            lineHeight: 1.65,
          }}>
            {receipt.initial_assessment}
          </div>
        </div>
      )}
    </div>
  )
}

function TaskList({ title, tasks, ref_, accentColor }: { title: string; tasks: string[]; ref_: string; accentColor: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <PanelLabel>{title}</PanelLabel>
        <RefTag>{ref_}</RefTag>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
        {tasks.map((t, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: 10,
            padding: '6px 0',
            borderBottom: '1px solid #171f2b',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.85rem',
            color: '#b4c8d8',
          }}>
            <span style={{ color: accentColor, flexShrink: 0, marginTop: 1 }}>▸</span>
            {t}
          </div>
        ))}
      </div>
    </div>
  )
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-ui)',
      fontSize: '0.68rem',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      color: '#8099b0',
      marginBottom: 10,
    }}>
      {children}
    </div>
  )
}

function RefTag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: 'var(--font-data)',
      fontSize: '0.65rem',
      color: '#2a3a4a',
      letterSpacing: '0.04em',
    }}>
      {children}
    </span>
  )
}
