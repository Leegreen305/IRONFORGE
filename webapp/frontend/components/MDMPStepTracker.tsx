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
      <div className="tac-section-header mb-3">MDMP Pipeline // FM 6-0 Ch.9</div>

      <div className="space-y-0">
        {STEPS.map((step, idx) => {
          const isComplete = completedSteps >= step.id
          const isActive   = isRunning && completedSteps === step.id - 1
          const isPending  = !isComplete && !isActive

          return (
            <div key={step.key}>
              <div
                className={`flex items-start gap-2 py-1.5 px-1 transition-colors ${
                  isComplete ? 'step-complete' : isActive ? 'step-active' : 'step-pending'
                }`}
              >
                {/* Step indicator */}
                <div className="flex flex-col items-center" style={{ minWidth: 20 }}>
                  <span className="step-dot text-base leading-none select-none">
                    {isComplete ? '◈' : isActive ? '▶' : '○'}
                  </span>
                  {idx < STEPS.length - 1 && (
                    <div
                      className="step-connector"
                      style={{
                        background: isComplete ? 'var(--tac-green)' : 'var(--tac-border)',
                      }}
                    />
                  )}
                </div>

                {/* Step info */}
                <div className="flex-1 min-w-0 pb-1">
                  <div
                    className="text-xs tracking-wide truncate"
                    style={{
                      color: isComplete
                        ? '#16b960'
                        : isActive
                        ? '#c8a84b'
                        : '#4a6680',
                    }}
                  >
                    {String(step.id).padStart(2, '0')}. {step.label.toUpperCase()}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#2d4a6a', fontSize: '0.6rem' }}>
                    {step.docRef}
                  </div>
                </div>

                {/* Status badge */}
                {isComplete && (
                  <span className="text-xs shrink-0" style={{ color: '#16b960', fontSize: '0.62rem' }}>
                    DONE
                  </span>
                )}
                {isActive && (
                  <span className="text-xs shrink-0 cursor-blink" style={{ color: '#c8a84b', fontSize: '0.62rem' }}>
                    RUN▌
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {completedSteps >= 7 && (
        <div className="mt-3 pt-2 border-t border-tac-border">
          <div className="text-center text-xs tracking-wider" style={{ color: '#16b960' }}>
            ◈ ALL STEPS COMPLETE ◈
          </div>
        </div>
      )}
    </div>
  )
}
