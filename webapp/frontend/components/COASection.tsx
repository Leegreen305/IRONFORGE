'use client'

import type { COA, COAAnalysisResult, COAComparisonResult } from '@/types'
import { COACard } from './COACard'

interface Props {
  coas: COA[]
  analyses: COAAnalysisResult[]
  comparisons: COAComparisonResult[]
  recommendedCoaId?: string
}

export function COASection({ coas, analyses, comparisons, recommendedCoaId }: Props) {
  const analysisMap = Object.fromEntries(analyses.map((a) => [a.coa_id, a]))
  const comparisonMap = Object.fromEntries(comparisons.map((c) => [c.coa_id, c]))

  return (
    <div className="tac-panel fade-in">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: '1px solid #1e2d3d', background: '#0a1018' }}
      >
        <div className="flex items-center gap-3">
          <span className="tac-panel-label">Course of Action Development & Analysis</span>
          <span style={{ color: '#2d4a6a', fontSize: '0.65rem' }}>FM 6-0 §9-78 / §9-96</span>
        </div>
        <div style={{ color: '#4a6680', fontSize: '0.62rem' }}>
          {coas.length} COAs DEVELOPED
        </div>
      </div>

      {/* COA grid */}
      <div className="p-3 grid grid-cols-1 xl:grid-cols-3 gap-3">
        {coas.map((coa) => (
          <COACard
            key={coa.coa_id}
            coa={coa}
            analysis={analysisMap[coa.coa_id]}
            comparison={comparisonMap[coa.coa_id]}
            isRecommended={coa.coa_id === recommendedCoaId}
          />
        ))}
      </div>

      {/* Comparison matrix summary */}
      {comparisons.length > 0 && (
        <div className="px-3 pb-3">
          <div className="tac-section-header">COA Comparison Matrix // FM 6-0 §9-117</div>
          <ComparisonTable comparisons={comparisons} coas={coas} />
        </div>
      )}
    </div>
  )
}

function ComparisonTable({ comparisons, coas }: { comparisons: COAComparisonResult[]; coas: COA[] }) {
  const sorted = [...comparisons].sort((a, b) => a.rank - b.rank)
  const criteria = comparisons[0]?.scores.map((s) => s.criterion) || []

  const coaName = (id: string) => coas.find((c) => c.coa_id === id)?.name || id

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.68rem' }}>
        <thead>
          <tr style={{ background: '#0a1018' }}>
            <th style={thStyle}>COA</th>
            {criteria.map((c) => (
              <th key={c} style={thStyle}>{c.toUpperCase()}</th>
            ))}
            <th style={{ ...thStyle, color: '#c8a84b' }}>TOTAL</th>
            <th style={thStyle}>RANK</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((comp, idx) => {
            const isTop = idx === 0
            return (
              <tr
                key={comp.coa_id}
                style={{
                  background: isTop ? 'rgba(200,168,75,0.05)' : idx % 2 === 0 ? '#0d1420' : '#080d18',
                  borderBottom: '1px solid #1e2d3d',
                }}
              >
                <td style={{ ...tdStyle, color: '#c8dae8' }}>
                  {comp.coa_id}
                  <div style={{ color: '#4a6680', fontSize: '0.6rem' }}>{coaName(comp.coa_id).slice(0, 20)}</div>
                </td>
                {comp.scores.map((s) => (
                  <td key={s.criterion} style={{ ...tdStyle, color: '#a0b4c8' }}>
                    {s.raw_score}
                    <span style={{ color: '#2d4a6a', fontSize: '0.58rem' }}> ({s.weighted_score.toFixed(2)})</span>
                  </td>
                ))}
                <td style={{ ...tdStyle, color: isTop ? '#c8a84b' : '#a0b4c8', fontWeight: isTop ? 'bold' : 'normal' }}>
                  {comp.total_score.toFixed(2)}
                </td>
                <td style={{ ...tdStyle, color: isTop ? '#16b960' : '#4a6680' }}>
                  #{comp.rank}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '6px 10px',
  textAlign: 'left',
  color: '#4a6680',
  fontSize: '0.6rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  borderBottom: '1px solid #1e2d3d',
  fontWeight: 'normal',
}

const tdStyle: React.CSSProperties = {
  padding: '5px 10px',
  fontSize: '0.68rem',
  verticalAlign: 'top',
}
