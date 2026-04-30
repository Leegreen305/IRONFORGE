'use client'

import type { MDMPStepInfo } from '@/types'

const STEPS: Omit<MDMPStepInfo, 'status'>[] = [
  { id: 1, key: 'RECEIPT_OF_MISSION',  label: 'Receipt of Mission',  docRef: 'FM 6-0 §9-20' },
  { id: 2, key: 'MISSION_ANALYSIS',    label: 'Mission Analysis',    docRef: 'FM 6-0 §9-29' },
  { id: 3, key: 'COA_DEVELOPMENT',     label: 'COA Development',     docRef: 'FM 6-0 §9-78' },
  { id: 4, key: 'COA_ANALYSIS',        label: 'COA Analysis',        docRef: 'FM 6-0 §9-96' },
  { id: 5, key: 'COA_COMPARISON',      label: 'COA Comparison',      docRef: 'FM 6-0 §9-117' },
  { id: 6, key: 'COA_APPROVAL',        label: 'COA Approval',        docRef: 'FM 6-0 §9-123' },
  { id: 7, key: 'ORDERS_PRODUCTION',   label: 'Orders Production',   docRef: 'FM 6-0 App C' },
]

interface Props {
  completedSteps: number
  isRunning: boolean
}

export function MDMPStepTracker({ completedSteps, isRunning }: Props) {
  return (
    <div className="tac-panel p-3">
      <div className="tac-section-header">MDMP Pipeline // FM 6-0 Ch.9</div>

      <div className="space-y-0">
        {STEPS.map((step, idx) => {
          const isComplete = completedSteps >= step.id
          const isActive   = isRunning && completedSteps === step.id - 1

          return (
            <div key={step.key}>
              <div
                className={`flex items-start gap-2 py-2 px-1 transition-colors ${
                  isComplete ? 'step-complete' : isActive ? 'step-active' : 'step-pending'
                }`}
              >
                <div className="flex flex-col items-center" style={{ minWidth: 22 }}>
                  <span className="step-dot text-base leading-none select-none">
                    {isComplete ? '◈' : isActive ? '▶' : '○'}
                  </span>
                  {idx < STEPS.length - 1 && (
                    <div
                      className="step-connector"
                      style={{ background: isComplete ? '#16b960' : '#1e2d3d' }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0 pb-1">
                  <div
                    className="tracking-wide truncate"
                    style={{
                      fontSize: '0.82rem',
                      color: isComplete ? '#16b960' : isActive ? '#c8a84b' : '#7a9ab8',
                    }}
                  >
                    {String(step.id).padStart(2, '0')}. {step.label.toUpperCase()}
                  </div>
                  <div style={{ color: '#3a5a7a', fontSize: '0.7rem', marginTop: 1 }}>
                    {step.docRef}
                  </div>
                </div>

                {isComplete && (
                  <span style={{ color: '#16b960', fontSize: '0.72rem', flexShrink: 0 }}>DONE</span>
                )}
                {isActive && (
                  <span className="cursor-blink" style={{ color: '#c8a84b', fontSize: '0.72rem', flexShrink: 0 }}>RUN▌</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {completedSteps >= 7 && (
        <div className="mt-3 pt-2" style={{ borderTop: '1px solid #1e2d3d' }}>
          <div className="text-center" style={{ color: '#16b960', fontSize: '0.82rem', letterSpacing: '0.12em' }}>
            ◈ ALL STEPS COMPLETE ◈
          </div>
        </div>
      )}
    </div>
  )
}
