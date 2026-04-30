'use client'

import type { MissionAnalysisResult } from '@/types'

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
    <div className="tac-panel fade-in">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid #1e2d3d', background: '#0a1018' }}
      >
        <div className="flex items-center gap-3">
          <span className="tac-panel-label">Mission Analysis</span>
          <span style={{ color: '#4a6880', fontSize: '0.78rem' }}>FM 6-0 §9-29 to §9-77</span>
        </div>
        <div className="flex items-center gap-2">
          {receipt && (
            <span
              className="px-2 py-1"
              style={{ border: '1px solid #1e3a5f', color: '#3b82f6', fontSize: '0.75rem', letterSpacing: '0.08em' }}
            >
              {receipt.classification.toUpperCase()}
            </span>
          )}
          <span className="status-dot status-dot-green" />
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Restated Mission */}
        <div className="lg:col-span-2">
          <div className="tac-section-header">Restated Mission</div>
          <div
            className="px-4 py-3 leading-relaxed"
            style={{ background: '#080d18', border: '1px solid #1e3a5f', color: '#daeaf8', fontSize: '0.95rem', lineHeight: 1.7 }}
          >
            {restated_mission}
          </div>
        </div>

        {/* METT-TC grid */}
        <div className="lg:col-span-2">
          <div className="tac-section-header">METT-TC Analysis // FM 6-0 §9-32</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {METTTC_FIELDS.map(({ key, label }) => (
              <div
                key={key}
                className="p-3"
                style={{ background: '#080d18', border: '1px solid #1e2d3d' }}
              >
                <div style={{ color: '#c8a84b', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 'bold' }}>
                  {label}
                </div>
                <div style={{ color: '#b8cede', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {mett_tc[key as keyof typeof mett_tc]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div>
          <div className="tac-section-header">Specified Tasks</div>
          <TaskList tasks={specified_tasks} color="#3b82f6" />
        </div>

        <div>
          <div className="tac-section-header">Implied Tasks</div>
          <TaskList tasks={implied_tasks} color="#c8a84b" />
        </div>

        <div className="lg:col-span-2">
          <div className="tac-section-header">Essential Tasks</div>
          <TaskList tasks={essential_tasks} color="#16b960" horizontal />
        </div>

        {/* Initial Assessment */}
        {receipt && (
          <div className="lg:col-span-2">
            <div className="tac-section-header">Initial Assessment // FM 6-0 §9-20</div>
            <div style={{ color: '#b8cede', fontSize: '0.85rem', lineHeight: 1.7 }}>
              {receipt.initial_assessment}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TaskList({ tasks, color, horizontal }: { tasks: string[]; color: string; horizontal?: boolean }) {
  return (
    <ul className={`space-y-2 ${horizontal ? 'flex flex-wrap gap-3' : ''}`}>
      {tasks.map((t, i) => (
        <li
          key={i}
          className={horizontal ? 'flex items-start gap-2 px-3 py-1.5' : 'flex items-start gap-2'}
          style={horizontal ? { border: `1px solid ${color}25`, fontSize: '0.85rem' } : { fontSize: '0.85rem' }}
        >
          <span style={{ color, marginTop: 2 }}>▸</span>
          <span style={{ color: '#b8cede' }}>{t}</span>
        </li>
      ))}
    </ul>
  )
}

const METTTC_FIELDS = [
  { key: 'mission',                     label: 'M — Mission' },
  { key: 'enemy',                       label: 'E — Enemy' },
  { key: 'terrain_and_weather',         label: 'T — Terrain & Weather' },
  { key: 'troops_and_support_available', label: 'T — Troops & Support' },
  { key: 'time_available',              label: 'T — Time Available' },
  { key: 'civil_considerations',        label: 'C — Civil Considerations' },
]
