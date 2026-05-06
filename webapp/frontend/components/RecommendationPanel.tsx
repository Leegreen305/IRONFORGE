'use client'

import type { COAApprovalResult, COA } from '@/types'

interface Props {
  approval: COAApprovalResult
  coas?: COA[]
  runId?: string
}

export function RecommendationPanel({ approval, coas, runId }: Props) {
  const recommendedCoa = coas?.find((c) => c.coa_id === approval.recommended_coa_id)

  return (
    <div
      className="tac-panel fade-in"
      style={{ borderColor: '#7a6420', boxShadow: '0 0 20px rgba(200,168,75,0.08)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: 'rgba(200,168,75,0.06)', borderBottom: '1px solid #7a6420' }}
      >
        <div className="flex items-center gap-3">
          <span style={{ color: '#c8a84b', fontSize: '0.72rem', letterSpacing: '0.2em', fontWeight: 'bold' }}>
            ◈ COMMANDER'S RECOMMENDATION
          </span>
          <span style={{ color: '#4a6680', fontSize: '0.62rem' }}>FM 6-0 §9-123</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-dot status-dot-gold" />
          <span style={{ color: '#c8a84b', fontSize: '0.62rem', letterSpacing: '0.12em' }}>APPROVED</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Recommended COA Identity */}
        <div className="flex items-start gap-4">
          <div
            className="shrink-0 flex flex-col items-center justify-center"
            style={{ width: 72, height: 72, border: '2px solid #c8a84b', background: 'rgba(200,168,75,0.06)' }}
          >
            <div style={{ color: '#c8a84b', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {approval.recommended_coa_id}
            </div>
            <div style={{ color: '#7a6420', fontSize: '0.55rem', letterSpacing: '0.1em' }}>APPROVED</div>
          </div>

          <div className="flex-1">
            <div style={{ color: '#c8dae8', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '0.06em' }}>
              {approval.recommended_coa_name.toUpperCase()}
            </div>
            {recommendedCoa && (
              <div style={{ color: '#a0b4c8', fontSize: '0.72rem', marginTop: 4, lineHeight: 1.6 }}>
                {recommendedCoa.description}
              </div>
            )}
          </div>
        </div>

        {/* Justification */}
        <div>
          <div className="tac-section-header">Commander's Justification</div>
          <div
            className="p-3 text-sm leading-relaxed"
            style={{ background: '#080d18', border: '1px solid #1e3a5f', color: '#a0b4c8', fontSize: '0.72rem' }}
          >
            {approval.justification}
          </div>
        </div>

        {/* Risk and Decision criteria side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="tac-section-header">Risk Acceptance</div>
            <div style={{ color: '#ef7777', fontSize: '0.72rem', lineHeight: 1.6 }}>
              ⚠ {approval.risk_acceptance}
            </div>
          </div>

          <div>
            <div className="tac-section-header">Decision Criteria Summary</div>
            <div style={{ color: '#a0b4c8', fontSize: '0.72rem', lineHeight: 1.6 }}>
              {approval.decision_criteria_summary}
            </div>
          </div>
        </div>

        {/* Doctrine citations */}
        {approval.citations.length > 0 && (
          <div>
            <div className="tac-section-header">Doctrine Basis</div>
            <div className="flex flex-wrap gap-2">
              {approval.citations.map((c, i) => (
                <div
                  key={i}
                  className="px-2 py-1"
                  style={{ border: '1px solid #1e2d3d', background: '#080d18' }}
                >
                  <span style={{ color: '#c8a84b', fontSize: '0.62rem' }}>{c.pub} §{c.paragraph}</span>
                  <span style={{ color: '#2d4a6a', fontSize: '0.58rem', marginLeft: 6 }}>{c.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Download PDF */}
        {runId && (
          <div className="flex justify-end">
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/mdmp/${runId}/report.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              ⇓ DOWNLOAD OPORD PDF
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
