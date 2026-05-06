'use client'

import { useEffect, useState } from 'react'

export function DisclaimerModal() {
  const [visible, setVisible] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const acknowledged = sessionStorage.getItem('ironforge-disclaimer-ack')
    if (!acknowledged) setVisible(true)
  }, [])

  const handleAcknowledge = () => {
    if (!checked) return
    sessionStorage.setItem('ironforge-disclaimer-ack', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(4, 8, 18, 0.96)' }}
    >
      <div
        className="relative w-full max-w-2xl mx-4"
        style={{ border: '1px solid #c8a84b', background: '#0d1420' }}
      >
        {/* Gold top bar */}
        <div style={{ height: 3, background: '#c8a84b', width: '100%' }} />

        {/* Classification header */}
        <div
          className="text-center py-2"
          style={{ background: '#003d00', color: '#00ee00', fontSize: '0.78rem', letterSpacing: '0.3em', fontFamily: 'monospace' }}
        >
          ▌ UNCLASSIFIED ▌ UNCLASSIFIED ▌ UNCLASSIFIED ▌
        </div>

        {/* Modal content */}
        <div className="p-8">
          {/* System title */}
          <div className="text-center mb-6">
            <div
              style={{ color: '#c8a84b', fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '0.3em', fontFamily: 'monospace' }}
            >
              ◈ IRONFORGE
            </div>
            <div
              style={{ color: '#7a9ab8', fontSize: '0.78rem', letterSpacing: '0.15em', marginTop: 4, fontFamily: 'monospace' }}
            >
              AI-POWERED MILITARY DECISION MAKING PROCESS ENGINE
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #7a6420', marginBottom: 24 }} />

          {/* Warning header */}
          <div
            className="flex items-center gap-3 mb-5"
            style={{ color: '#c8a84b', fontSize: '0.82rem', letterSpacing: '0.1em', fontFamily: 'monospace' }}
          >
            <span style={{ fontSize: '1.1rem' }}>⚠</span>
            <span>SYSTEM ACCESS NOTICE — READ BEFORE PROCEEDING</span>
          </div>

          {/* Notice body */}
          <div className="space-y-4" style={{ fontFamily: 'monospace' }}>
            <NoticeBlock
              label="CLASSIFICATION"
              text="This system is UNCLASSIFIED. It does not process, store, transmit, or produce classified information at any level. All outputs are UNCLASSIFIED."
              color="#16b960"
            />
            <NoticeBlock
              label="PURPOSE"
              text="IRONFORGE is an academic simulation and training aid. It models the U.S. Army Military Decision Making Process and joint targeting cycle for educational and research purposes only."
              color="#3b82f6"
            />
            <NoticeBlock
              label="DOCTRINE SOURCES"
              text="All planning factors, models, and decision criteria are derived exclusively from publicly available, declassified U.S. Army and Joint publications available through armypubs.army.mil and jcs.mil."
              color="#c8a84b"
            />
            <NoticeBlock
              label="LIMITATIONS"
              text="This system does not represent actual classified capabilities, real unit data, live operational systems, or any government-sponsored tool. It is not connected to any government network, targeting system, or classified database."
              color="#ef4444"
            />
            <NoticeBlock
              label="PROHIBITED USE"
              text="This system must not be used for actual military planning, operational targeting, or any purpose that would require classified information or government authorization."
              color="#ef4444"
            />
          </div>

          {/* Doctrine refs */}
          <div
            className="mt-5 pt-4 text-center"
            style={{ borderTop: '1px solid #1e2d3d', color: '#4a6880', fontSize: '0.72rem', fontFamily: 'monospace', letterSpacing: '0.06em' }}
          >
            FM 6-0 · FM 2-01.3 · FM 3-60 · FM 3-09 · ADRP 5-0 · JP 3-0 · JP 3-60 · CJCSI 3160.01A
          </div>

          {/* Checkbox and button */}
          <div className="mt-6 space-y-4">
            <label
              className="flex items-start gap-3 cursor-pointer"
              style={{ fontFamily: 'monospace' }}
            >
              <div
                onClick={() => setChecked(!checked)}
                className="shrink-0 mt-0.5 cursor-pointer flex items-center justify-center"
                style={{
                  width: 18,
                  height: 18,
                  border: `1px solid ${checked ? '#c8a84b' : '#1e2d3d'}`,
                  background: checked ? 'rgba(200,168,75,0.15)' : 'transparent',
                  color: '#c8a84b',
                  fontSize: '0.75rem',
                }}
              >
                {checked && '✓'}
              </div>
              <span style={{ color: '#b8cede', fontSize: '0.82rem', lineHeight: 1.6 }}>
                I acknowledge that IRONFORGE is an unclassified academic training aid. I will not use it for actual military operations, targeting, or any purpose requiring classified information. I understand all outputs are UNCLASSIFIED.
              </span>
            </label>

            <button
              onClick={handleAcknowledge}
              disabled={!checked}
              className="w-full py-3"
              style={{
                background: checked ? 'rgba(200,168,75,0.08)' : 'transparent',
                border: `1px solid ${checked ? '#c8a84b' : '#1e2d3d'}`,
                color: checked ? '#c8a84b' : '#4a6880',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                letterSpacing: '0.15em',
                cursor: checked ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
              }}
            >
              {checked ? '▶ ACKNOWLEDGE AND ENTER SYSTEM' : 'READ AND CHECK THE BOX ABOVE TO CONTINUE'}
            </button>
          </div>
        </div>

        {/* Classification footer */}
        <div
          className="text-center py-2"
          style={{ background: '#003d00', color: '#00ee00', fontSize: '0.78rem', letterSpacing: '0.3em', fontFamily: 'monospace' }}
        >
          ▌ UNCLASSIFIED ▌ TRAINING AID ONLY ▌ NOT FOR OPERATIONAL USE ▌
        </div>
      </div>
    </div>
  )
}

function NoticeBlock({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <div className="flex gap-3">
      <div
        style={{
          color,
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          minWidth: 110,
          paddingTop: 2,
          fontWeight: 'bold',
        }}
      >
        {label}:
      </div>
      <div style={{ color: '#b8cede', fontSize: '0.82rem', lineHeight: 1.65 }}>
        {text}
      </div>
    </div>
  )
}
