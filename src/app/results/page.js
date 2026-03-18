'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ScoreCircle from '../../components/ScoreCircle'
import InsightCard from '../../components/InsightCard'

const PILLAR_ROWS = (result) => {
  const { hosp, resilience, life, premium } = result.pillars
  return [
    {
      id: 'hosp',
      label: 'Hospitalisation',
      sublabel: hosp.passed ? 'Covered' : hosp.isUnsure ? 'Not sure' : 'Not covered',
      score: hosp.passed ? 100 : hosp.isUnsure ? 25 : 0,
      color: hosp.passed ? 'teal' : 'red',
      isGate: true,
    },
    {
      id: 'ci',
      label: 'Critical illness',
      sublabel: resilience.ci.amount > 0
        ? `S$${resilience.ci.amount.toLocaleString('en-SG')}${resilience.ci.isEstimated ? ' (est.)' : ''}`
        : 'Not covered',
      score: resilience.ci.score,
      color: resilience.ci.score >= 80 ? 'teal' : resilience.ci.score >= 50 ? 'blue' : resilience.ci.score > 0 ? 'amber' : 'red',
    },
    {
      id: 'eci',
      label: 'Early critical illness',
      sublabel: resilience.eci.boost > 0
        ? `+${resilience.eci.boost} pts boost${resilience.eci.isEstimated ? ' (est.)' : ''}`
        : 'None detected',
      score: (resilience.eci.boost / 20) * 100,
      color: resilience.eci.boost >= 20 ? 'teal' : resilience.eci.boost > 0 ? 'blue' : 'red',
      isGap: resilience.eci.boost === 0 && result.inputs.hasCI === 'yes',
      maxLabel: '/ 20 pts',
    },
    {
      id: 'life',
      label: 'Life / TPD',
      sublabel: life.amount > 0
        ? `S$${life.amount.toLocaleString('en-SG')}${life.isEstimated ? ' (est.)' : ''}`
        : 'Not covered',
      score: life.score,
      color: life.score >= 80 ? 'teal' : life.score >= 50 ? 'blue' : life.score > 0 ? 'amber' : 'red',
    },
    {
      id: 'premium',
      label: 'Premium efficiency',
      sublabel: premium.annualPremium
        ? `S$${Math.round(premium.annualPremium / 12).toLocaleString('en-SG')}/month · ${(premium.ratio * 100).toFixed(1)}% of income`
        : 'Not provided',
      score: premium.score,
      color: premium.score >= 70 ? 'teal' : premium.score >= 40 ? 'blue' : 'amber',
      isSkipped: premium.score === null,
    },
  ]
}

const BAR_COLORS = {
  red: '#E24B4A', amber: '#EF9F27', blue: '#378ADD', teal: '#1D9E75',
}

function PillarRow({ row, index }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(row.isSkipped ? 0 : (row.score ?? 0)), 100 + index * 120)
    return () => clearTimeout(t)
  }, [row, index])

  const barColor = row.isGap ? '#E24B4A' : BAR_COLORS[row.color] ?? '#378ADD'
  const scoreLabel = row.isGate
    ? (row.score === 100 ? 'Covered' : row.score === 25 ? 'Unsure' : 'Not covered')
    : row.isGap ? 'Gap flagged'
    : row.isSkipped ? 'Not provided'
    : row.maxLabel ? `+${Math.round((row.score / 100) * 20)} pts`
    : `${Math.round(row.score ?? 0)} / 100`

  return (
    <div style={{
      padding: '14px 0',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-primary)' }}>
            {row.label}
          </span>
          {row.sublabel && (
            <span style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: '8px' }}>
              {row.sublabel}
            </span>
          )}
        </div>
        <span style={{
          fontSize: '12px',
          fontWeight: '600',
          color: barColor,
          whiteSpace: 'nowrap',
          marginLeft: '8px',
        }}>
          {scoreLabel}
        </span>
      </div>
      <div style={{
        height: '6px',
        background: '#F3F4F6',
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: row.isSkipped ? '100%' : `${width}%`,
          background: row.isSkipped ? '#F3F4F6' : row.isGap ? '#FECACA' : barColor,
          borderRadius: '3px',
          transition: 'width 0.7s ease-out',
          opacity: row.isSkipped ? 0.3 : 1,
        }} />
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const router = useRouter()
  const [data, setData] = useState(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('iga_result')
      if (!raw) { router.push('/check'); return }
      setData(JSON.parse(raw))
    } catch {
      router.push('/check')
    }
  }, [router])

  if (!data) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
    }} />
  )

  const { result, insights } = data

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-body)',
      paddingBottom: '48px',
    }}>

      {/* Header */}
      <div style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <button
          onClick={() => router.push('/check')}
          style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--color-primary)', padding: '4px 8px 4px 0' }}
        >←</button>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '17px', color: 'var(--color-primary)' }}>
          Your results
        </span>
      </div>

      {/* Score hero */}
      <div style={{
        background: 'var(--color-surface)',
        padding: '40px 24px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <ScoreCircle
          score={result.finalScore}
          band={result.band}
          isEstimated={result.isEstimated}
          animate={true}
        />
      </div>

      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0 16px' }}>

        {/* Insight cards */}
        {insights.length > 0 && (
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.08em',
              color: '#9CA3AF',
              textTransform: 'uppercase',
              margin: '0 0 4px',
            }}>
              Your gaps
            </p>
            {insights.map((card, i) => (
              <InsightCard
                key={card.id}
                card={card}
                index={i}
                onCTA={(id) => {
                  if (id === 'band-nudge') router.push('/check')
                }}
              />
            ))}
          </div>
        )}

        {/* Coverage breakdown */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          padding: '20px 20px 8px',
          marginTop: '24px',
        }}>
          <p style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            color: '#9CA3AF',
            textTransform: 'uppercase',
            margin: '0 0 4px',
          }}>
            Coverage breakdown
          </p>
          {PILLAR_ROWS(result).map((row, i) => (
            <PillarRow key={row.id} row={row} index={i} />
          ))}
        </div>

        {/* CTAs */}
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => alert('Advisor referral coming soon.')}
            style={{
              width: '100%',
              padding: '15px',
              background: 'var(--color-accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            Talk to an advisor
          </button>
          <button
            onClick={() => router.push('/check')}
            style={{
              width: '100%',
              padding: '15px',
              background: 'transparent',
              color: 'var(--color-primary)',
              border: '2px solid var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            Update my score
          </button>
          <button
            onClick={() => {
              const text = `My Insurance Score: ${result.finalScore}/100 — ${result.band.label}. How covered are you? Check yours at InsureCheck.`
              if (navigator.share) navigator.share({ text })
              else navigator.clipboard.writeText(text).then(() => alert('Score copied to clipboard!'))
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              fontSize: '14px',
              cursor: 'pointer',
              padding: '8px 0',
              fontFamily: 'var(--font-body)',
              textDecoration: 'underline',
              textDecorationColor: '#D1D5DB',
            }}
          >
            Share my score
          </button>
        </div>

        {/* Disclaimer */}
        <p style={{
          fontSize: '12px',
          color: '#9CA3AF',
          lineHeight: 1.6,
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--color-border)',
        }}>
          This score is for educational purposes only and does not constitute financial advice.
          Coverage benchmarks are based on general Singapore financial planning guidelines.
          Please consult a MAS-licensed financial adviser for personal recommendations.
        </p>
      </div>
    </div>
  )
}