'use client'

import { useState } from 'react'
import type { OPORDFragment, OPORDParagraph } from '@/types'

interface Props {
  opord: OPORDFragment
}

const PARA_GROUPS: { key: keyof OPORDFragment; num: string; title: string; color: string }[] = [
  { key: 'situation',          num: '1', title: 'Situation',          color: '#3b82f6' },
  { key: 'mission',            num: '2', title: 'Mission',            color: '#c8a84b' },
  { key: 'execution',          num: '3', title: 'Execution',          color: '#16b960' },
  { key: 'sustainment',        num: '4', title: 'Sustainment',        color: '#b8cede' },
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
      {/* Header */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e2d3d', background: '#0a1018' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="tac-panel-label">Operations Order (Fragment)</div>
            <div style={{ color: '#4a6880', fontSize: '0.78rem', marginTop: 2 }}>
              FM 6-0 Appendix C // FM 6-99 // UNCLASSIFIED
            </div>
          </div>
          <div
            className="px-3 py-1"
            style={{ border: '1px solid #004400', background: '#001a00', color: '#00cc00', fontSize: '0.75rem', letterSpacing: '0.15em' }}
          >
            UNCLASSIFIED
          </div>
        </div>

        {/* OPORD header block */}
        <div className="mt-3 p-3" style={{ background: '#080d18', border: '1px solid #1e2d3d', fontSize: '0.82rem' }}>
          <OPORDHeaderLine label="CLASSIFICATION" value="UNCLASSIFIED" />
          <OPORDHeaderLine label="DTG"            value={new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12) + 'Z'} />
          <OPORDHeaderLine label="FROM"           value="IRONFORGE MDMP ENGINE" />
          <OPORDHeaderLine label="TO"             value="ALL UNITS" />
          <OPORDHeaderLine label="REF"            value="FM 6-0 (May 2014), FM 6-99 (Aug 2006)" />
        </div>
      </div>

      {/* OPORD body */}
      <div className="p-4 space-y-2">
        {PARA_GROUPS.map((group) => {
          const paragraphs = opord[group.key] as OPORDParagraph[]
          const isOpen = expanded.has(group.num)

          return (
            <div key={group.key}>
              <button
                onClick={() => toggle(group.num)}
                className="w-full flex items-center justify-between py-3 px-4 text-left"
                style={{
                  background: isOpen ? 'rgba(200,168,75,0.04)' : 'transparent',
                  border: '1px solid',
                  borderColor: isOpen ? `${group.color}35` : '#1e2d3d',
                  cursor: 'pointer',
                }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ color: group.color, fontSize: '1rem', fontWeight: 'bold', minWidth: 24 }}>
                    {group.num}.
                  </span>
                  <span style={{ color: '#daeaf8', fontSize: '0.88rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {group.title}
                  </span>
                </div>
                <span style={{ color: '#7a9ab8', fontSize: '0.8rem' }}>
                  {isOpen ? '▲' : '▼'}
                </span>
              </button>

              {isOpen && (
                <div
                  className="px-5 py-3 space-y-4"
                  style={{ background: '#080d18', border: '1px solid #1e2d3d', borderTop: 'none' }}
                >
                  {(paragraphs || []).map((para, i) => (
                    <div key={i}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="opord-para-num" style={{ fontSize: '0.85rem' }}>{para.paragraph_num}</span>
                        <span className="opord-para-title" style={{ fontSize: '0.85rem' }}>{para.title}</span>
                      </div>
                      <div className="opord-para-text">{para.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-2" style={{ borderTop: '1px solid #1e2d3d' }}>
        <div style={{ color: '#3a5a7a', fontSize: '0.72rem', letterSpacing: '0.06em' }}>
          DOCTRINE BASIS: {opord.citations.map((c) => `${c.pub} §${c.paragraph}`).join(' · ')}
        </div>
        <div style={{ color: '#3a5a7a', fontSize: '0.7rem', marginTop: 2 }}>
          UNCLASSIFIED // IRONFORGE TRAINING AID // NOT FOR OPERATIONAL USE
        </div>
      </div>
    </div>
  )
}

function OPORDHeaderLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 mb-1">
      <span style={{ color: '#7a9ab8', minWidth: 110, fontSize: '0.82rem' }}>{label}:</span>
      <span style={{ color: '#b8cede', fontSize: '0.82rem' }}>{value}</span>
    </div>
  )
}
