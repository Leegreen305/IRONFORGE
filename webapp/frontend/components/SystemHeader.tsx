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
      const d = now.toISOString().replace('T', ' ').slice(0, 19)
      setUtc(`${d}Z`)
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
      {/* Left — system identity */}
      <div className="flex items-center gap-4">
        <span className="text-tac-gold font-bold tracking-widest text-sm">
          ◈ IRONFORGE
        </span>
        <span className="text-tac-dim text-xs tracking-wider hidden md:inline">
          AI-POWERED MDMP ENGINE
        </span>
        <span className="text-tac-border text-xs hidden lg:inline">|</span>
        <span className="text-tac-dim text-xs hidden lg:inline tracking-wider">
          FM 6-0 · FM 2-01.3 · FM 3-60 · JP 3-0
        </span>
      </div>

      {/* Right — status indicators */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <span className={`status-dot ${isOnline ? 'status-dot-green' : 'status-dot-red'}`} />
          <span className="text-xs tracking-wider" style={{ color: isOnline ? '#16b960' : '#ef4444' }}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <span className="status-dot status-dot-gold" />
          <span className="text-xs tracking-wider text-tac-gold">AI ENGINE READY</span>
        </div>

        <div className="hidden md:block text-xs text-tac-dim tracking-wider">
          UTC {utc || '----'}
        </div>

        <div className="text-xs text-tac-border tracking-wider hidden lg:block">
          v1.0.0
        </div>
      </div>
    </header>
  )
}
