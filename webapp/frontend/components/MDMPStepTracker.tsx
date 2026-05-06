'use client'

const STEPS = [
  { id: 1, label: 'Receipt of Mission',  ref: 'FM 6-0 §9-20' },
  { id: 2, label: 'Mission Analysis',    ref: 'FM 6-0 §9-29' },
  { id: 3, label: 'COA Development',     ref: 'FM 6-0 §9-78' },
  { id: 4, label: 'COA Analysis',        ref: 'FM 6-0 §9-96' },
  { id: 5, label: 'COA Comparison',      ref: 'FM 6-0 §9-117' },
  { id: 6, label: 'COA Approval',        ref: 'FM 6-0 §9-123' },
  { id: 7, label: 'Orders Production',   ref: 'FM 6-0 App C' },
]

export function MDMPStepTracker({ completedSteps, isRunning }: { completedSteps: number; isRunning: boolean }) {
  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.68rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        color: '#8099b0',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottom: '1px solid #171f2b',
      }}>
        MDMP Pipeline
      </div>

      <div>
        {STEPS.map((step) => {
          const done   = completedSteps >= step.id
          const active = isRunning && completedSteps === step.id - 1

          return (
            <div key={step.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '5px 0',
              borderBottom: step.id < 7 ? '1px solid #171f2b' : 'none',
            }}>
              {/* Step number */}
              <span style={{
                fontFamily: 'var(--font-data)',
                fontSize: '0.7rem',
                color: done ? '#1acd6e' : active ? '#c8a84b' : '#2a3a4a',
                minWidth: 20,
                paddingTop: 1,
                fontWeight: done ? 'bold' : 'normal',
              }}>
                {String(step.id).padStart(2, '0')}
              </span>

              {/* Step info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.82rem',
                  fontWeight: done ? 400 : active ? 600 : 400,
                  color: done ? '#8099b0' : active ? '#ddeeff' : '#3a5060',
                }}>
                  {step.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: '0.62rem',
                  color: '#1f2d3e',
                  marginTop: 1,
                }}>
                  {step.ref}
                </div>
              </div>

              {/* Status */}
              {done && (
                <span style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: '0.65rem',
                  color: '#1acd6e',
                  flexShrink: 0,
                  paddingTop: 2,
                  letterSpacing: '0.05em',
                }}>
                  DONE
                </span>
              )}
              {active && (
                <span style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: '0.65rem',
                  color: '#c8a84b',
                  flexShrink: 0,
                  paddingTop: 2,
                  animation: 'blink 1s step-end infinite',
                }}>
                  RUN
                </span>
              )}
            </div>
          )
        })}
      </div>

      {completedSteps >= 7 && (
        <div style={{
          marginTop: 12,
          paddingTop: 10,
          borderTop: '1px solid #171f2b',
          fontFamily: 'var(--font-data)',
          fontSize: '0.72rem',
          color: '#1acd6e',
          letterSpacing: '0.08em',
          textAlign: 'center' as const,
        }}>
          ALL STEPS COMPLETE
        </div>
      )}
    </div>
  )
}
