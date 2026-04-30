'use client'

import { useEffect, useState } from 'react'

interface Props {
  isOnline: boolean
}

export function SystemHeader({ isOnline }: Props) {
  const [utc, setUtc] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setUtc(now.toISOString().replace('T', ' ').slice(0, 19) + 'Z')
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header
      className="flex items-center justify-between px-4 py-2 select-none"
      style={{ background: '#0a0f1c', borderBottom: '1px solid #1e2d3d' }}
    >
      {/* Left — identity */}
      <div className="flex items-center gap-4">
        <span style={{ color: '#c8a84b', fontWeight: 'bold', letterSpacing: '0.2em', fontSize: '0.95rem' }}>
          ◈ IRONFORGE
        </span>
        <span style={{ color: '#7a9ab8', fontSize: '0.82rem', letterSpacing: '0.1em' }} className="hidden md:inline">
          AI-POWERED MDMP ENGINE
        </span>
        <span style={{ color: '#1e2d3d', fontSize: '0.9rem' }} className="hidden lg:inline">|</span>
        <span style={{ color: '#4a6880', fontSize: '0.78rem' }} className="hidden lg:inline">
          FM 6-0 · FM 2-01.3 · FM 3-60 · JP 3-0
        </span>
      </div>

      {/* Right — status */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <span className={`status-dot ${isOnline ? 'status-dot-green' : 'status-dot-red'}`} />
          <span style={{ fontSize: '0.82rem', color: isOnline ? '#16b960' : '#ef4444', letterSpacing: '0.08em' }}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <span className="status-dot status-dot-gold" />
          <span style={{ fontSize: '0.82rem', color: '#c8a84b', letterSpacing: '0.06em' }}>AI ENGINE READY</span>
        </div>

        <div className="hidden md:block" style={{ fontSize: '0.78rem', color: '#7a9ab8' }}>
          UTC {utc || '----'}
        </div>

        <div className="hidden lg:block" style={{ fontSize: '0.75rem', color: '#3a5a7a' }}>
          v1.0.0
        </div>
      </div>
    </header>
  )
}
