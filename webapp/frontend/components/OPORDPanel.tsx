'use client'

import { useState } from 'react'
import type { OPORDFragment, OPORDParagraph } from '@/types'

interface Props {
  opord: OPORDFragment
}

const PARA_GROUPS: { key: keyof OPORDFragment; num: string; title: string; color: string }[] = [
  { key: 'situation',        num: '1', title: 'Situation',        color: '#3b82f6' },
  { key: 'mission',          num: '2', title: 'Mission',          color: '#c8a84b' },
  { key: 'execution',        num: '3', title: 'Execution',        color: '#16b960' },
  { key: 'sustainment',      num: '4', title: 'Sustainment',      color: '#a0b4c8' },
  { key: 'command_and_signal', num: '5', title: 'Command and Signal', color: '#f59e0b' },
]

export function OPORDPanel({ opord }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['1', '2', '3']))

  const toggle = (num: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(num)) next.delete(num)
      else next.add(num)
      return next
    })
  }

  return (
    <div className="tac-panel fade-in">
      {/* OPORD Header */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: '1px solid #1e2d3d', background: '#0a1018' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="tac-panel-label">Operations Order (Fragment)</div>
            <div style={{ color: '#2d4a6a', fontSize: '0.62rem', marginTop: 2 }}>
              FM 6-0 Appendix C // FM 6-99 Report Formats // UNCLASSIFIED
            </div>
          </div>
          <div
            className="px-3 py-1"
            style={{ border: '1px solid #004400', background: '#001a00', color: '#00cc00', fontSize: '0.62rem', letterSpacing: '0.2em' }}
          >
            UNCLASSIFIED
          </div>
        </div>

        {/* OPORD header block */}
        <div className="mt-3 p-2 font-mono text-xs" style={{ background: '#080d18', border: '1px solid #1e2d3d' }}>
          <OPORDHeaderLine label="CLASSIFICATION" value="UNCLASSIFIED" />
          <OPORDHeaderLine label="DTG" value={new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12) + 'Z'} />
          <OPORDHeaderLine label="FROM" value="IRONFORGE MDMP ENGINE" />
          <OPORDHeaderLine label="TO" value="ALL UNITS" />
          <OPORDHeaderLine label="REF" value="FM 6-0 (May 2014), FM 6-99 (Aug 2006)" />
        </div>
      </div>

      {/* OPORD body */}
      <div className="p-4 space-y-1">
        {PARA_GROUPS.map((group) => {
          const paragraphs = opord[group.key] as OPORDParagraph[]
          const isOpen = expanded.has(group.num)

          return (
            <div key={group.key}>
              {/* Paragraph group header (clickable) */}
              <button
                onClick={() => toggle(group.num)}
                className="w-full flex items-center justify-between py-2 px-3 text-left"
                style={{
                  background: isOpen ? 'rgba(200,168,75,0.04)' : 'transparent',
                  border: '1px solid #1e2d3d',
                  borderColor: isOpen ? `${group.color}30` : '#1e2d3d',
                  cursor: 'pointer',
                }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ color: group.color, fontSize: '0.8rem', fontWeight: 'bold', minWidth: 20 }}>
                    {group.num}.
                  </span>
                  <span style={{ color: '#c8dae8', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {group.title}
                  </span>
                </div>
                <span style={{ color: '#4a6680', fontSize: '0.65rem' }}>
                  {isOpen ? '▲' : '▼'}
                </span>
              </button>

              {/* Paragraphs */}
              {isOpen && (
                <div
                  className="px-4 py-2 space-y-3"
                  style={{ background: '#080d18', border: '1px solid #1e2d3d', borderTop: 'none' }}
                >
                  {(paragraphs || []).map((para, i) => (
                    <div key={i}>
                      <div className="flex items-baseline gap-2">
                        <span className="opord-para-num">{para.paragraph_num}</span>
                        <span className="opord-para-title" style={{ fontSize: '0.72rem' }}>{para.title}</span>
                      </div>
                      <div className="opord-para-text mt-1">{para.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Citations footer */}
      <div className="px-4 pb-4 pt-2" style={{ borderTop: '1px solid #1e2d3d' }}>
        <div style={{ color: '#2d4a6a', fontSize: '0.6rem', letterSpacing: '0.08em' }}>
          DOCTRINE BASIS: {opord.citations.map((c) => `${c.pub} §${c.paragraph}`).join(' · ')}
        </div>
        <div style={{ color: '#2d4a6a', fontSize: '0.58rem', marginTop: 2 }}>
          UNCLASSIFIED // IRONFORGE TRAINING AID // NOT FOR OPERATIONAL USE
        </div>
      </div>
    </div>
  )
}

function OPORDHeaderLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span style={{ color: '#4a6680', minWidth: 100 }}>{label}:</span>
      <span style={{ color: '#a0b4c8' }}>{value}</span>
    </div>
  )
}
