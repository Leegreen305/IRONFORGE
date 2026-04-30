'use client'

import { useEffect, useState } from 'react'

export function SystemHeader({ isOnline }: { isOnline: boolean }) {
  const [utc, setUtc] = useState('')

  useEffect(() => {
    const tick = () => setUtc(new Date().toISOString().replace('T', ' ').slice(0, 19) + 'Z')
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header
      style={{
        background: '#0c1118',
        borderBottom: '1px solid #171f2b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: 44,
        flexShrink: 0,
      }}
    >
      {/* Left — identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{
          fontFamily: 'var(--font-data)',
          fontSize: '0.88rem',
          fontWeight: 'bold',
          color: '#c8a84b',
          letterSpacing: '0.25em',
        }}>
          IRONFORGE
        </span>

        <span style={{ width: 1, height: 18, background: '#1f2d3e', display: 'inline-block' }} />

        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.72rem',
          color: '#8099b0',
          letterSpacing: '0.04em',
          fontWeight: 500,
        }}>
          AI-POWERED MDMP ENGINE
        </span>

        <span className="hidden lg:inline" style={{
          fontFamily: 'var(--font-data)',
          fontSize: '0.65rem',
          color: '#1f2d3e',
          letterSpacing: '0.06em',
        }}>
          FM 6-0 · FM 2-01.3 · FM 3-60 · JP 3-0
        </span>
      </div>

      {/* Right — status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className={`dot ${isOnline ? 'dot-green' : 'dot-red'}`} />
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: isOnline ? '#1acd6e' : '#e84545',
            letterSpacing: '0.04em',
          }}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 6 }}>
          <span className="dot dot-gold" />
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.72rem',
            color: '#c8a84b',
            letterSpacing: '0.04em',
          }}>
            AI READY
          </span>
        </div>

        <span className="hidden md:inline" style={{
          fontFamily: 'var(--font-data)',
          fontSize: '0.7rem',
          color: '#3a5060',
          letterSpacing: '0.04em',
        }}>
          {utc}
        </span>

        <span className="hidden lg:inline" style={{
          fontFamily: 'var(--font-data)',
          fontSize: '0.65rem',
          color: '#1f2d3e',
        }}>
          v1.0.0
        </span>
      </div>
    </header>
  )
}
