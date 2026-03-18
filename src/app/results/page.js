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
  const [advisorModal, setAdvisorModal] = useState(false)
  const [advisorForm, setAdvisorForm] = useState({ name: '', email: '', concern: '' })
  const [advisorSubmitted, setAdvisorSubmitted] = useState(false)
  const [shareModal, setShareModal] = useState(false)
  const [scoreDelta, setScoreDelta] = useState(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('iga_result')
      if (!raw) { router.push('/check'); return }
      const parsed = JSON.parse(raw)
      setData(parsed)
  
      // Load score delta
      try {
        const prev = sessionStorage.getItem('iga_prev_score')
        if (prev !== null) {
          const delta = parsed.result.finalScore - parseInt(prev, 10)
          if (delta !== 0) setScoreDelta(delta)
        }
      } catch {}
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

{/* Compliance line */}
<div style={{
  padding: '10px 24px',
  background: '#F9FAFB',
  borderBottom: '1px solid var(--color-border)',
  textAlign: 'center',
}}>
  <p style={{
    fontSize: '11px',
    color: '#9CA3AF',
    margin: 0,
  }}>
    This is an educational tool. It does not constitute financial advice.
  </p>
</div>

{/* Score hero */}
<div style={{
  background: 'var(--color-surface)',
  padding: '40px 24px 20px',
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

  {/* Band-aware context sentence */}
  <p style={{
    marginTop: '16px',
    marginBottom: 0,
    fontSize: '15px',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 1.6,
    maxWidth: '360px',
  }}>
    {result.finalScore <= 39 && "Your coverage has critical gaps that need urgent attention."}
    {result.finalScore >= 40 && result.finalScore <= 59 && "You're partially covered, but there are meaningful gaps worth closing."}
    {result.finalScore >= 60 && result.finalScore <= 79 && "You're in reasonable shape — a few areas to tighten up."}
    {result.finalScore >= 80 && "Your coverage is strong. Here's the full breakdown."}
      </p>

      {/* Score delta */}
      {scoreDelta !== null && (
        <div style={{
          marginTop: '10px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '100px',
          background: scoreDelta > 0 ? 'var(--color-teal-bg)' : 'var(--color-red-bg)',
          fontSize: '13px',
          fontWeight: '600',
          color: scoreDelta > 0 ? 'var(--color-accent)' : 'var(--color-red)',
        }}>
          {scoreDelta > 0 ? '↑' : '↓'} {scoreDelta > 0 ? '+' : ''}{scoreDelta} pts since last check
        </div>
      )}
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
<p style={{
  fontFamily: 'var(--font-display)',
  fontSize: '20px',
  color: 'var(--color-primary)',
  margin: '28px 0 12px',
  fontWeight: '400',
}}>
  How each area scores
</p>
<div style={{
  background: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-card)',
  padding: '20px 20px 8px',
}}>
  <p style={{
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.08em',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    margin: '0 0 4px',
    display: 'none',
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
  onClick={() => {
    setAdvisorForm(f => ({
      ...f,
      concern: data.result.insights?.[0]?.title ?? '',
    }))
    setAdvisorModal(true)
  }}
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
  Get a free coverage review
</button>
<button
  onClick={() => {
    try {
      const raw = sessionStorage.getItem('iga_inputs')
      if (raw) sessionStorage.setItem('iga_recheck', raw)
    } catch {}
    router.push('/check')
  }}
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
    sessionStorage.removeItem('iga_inputs')
    sessionStorage.removeItem('iga_result')
    router.push('/check')
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
  Start over with a fresh form
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
<div style={{
  marginTop: '28px',
  paddingTop: '20px',
  borderTop: '1px solid var(--color-border)',
}}>
  <p style={{
    fontSize: '12px',
    color: '#9CA3AF',
    lineHeight: 1.6,
    margin: '0 0 6px',
  }}>
    This score is for educational purposes only and does not constitute financial advice.
    Coverage benchmarks are based on general Singapore financial planning guidelines.
    Please consult a MAS-licensed financial adviser for personal recommendations.
  </p>
  <p style={{
    fontSize: '11px',
    color: '#C4C9D4',
    margin: 0,
  }}>
    Not affiliated with any insurer or MAS-licensed entity.
  </p>
</div>
      </div>
{/* Advisor modal */}
{advisorModal && (
  <div
    onClick={() => setAdvisorModal(false)}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 100,
      padding: '0',
    }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        background: 'var(--color-surface)',
        borderRadius: '20px 20px 0 0',
        padding: '28px 24px 40px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
      }}
    >
      {!advisorSubmitted ? (
        <>
          {/* Handle bar */}
          <div style={{
            width: '40px',
            height: '4px',
            background: '#E5E7EB',
            borderRadius: '2px',
            margin: '0 auto 20px',
          }} />

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            color: 'var(--color-primary)',
            margin: '0 0 8px',
          }}>
            We'll connect you with a licensed adviser
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '0 0 20px',
            lineHeight: 1.6,
          }}>
            No sales pressure. One adviser match — not a mailing list.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Your name"
              value={advisorForm.name}
              onChange={e => setAdvisorForm(f => ({ ...f, name: e.target.value }))}
              style={{
                padding: '13px 16px',
                fontSize: '16px',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                color: 'var(--color-primary)',
              }}
            />
            <div>
              <input
                type="email"
                placeholder="Your email"
                value={advisorForm.email}
                onChange={e => setAdvisorForm(f => ({ ...f, email: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  fontSize: '16px',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  color: 'var(--color-primary)',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{
                fontSize: '11px',
                color: '#9CA3AF',
                margin: '6px 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <span style={{ color: 'var(--color-accent)' }}>✓</span>
                We don't sell your contact details.
              </p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Your biggest concern (optional)"
                value={advisorForm.concern}
                onChange={e => setAdvisorForm(f => ({ ...f, concern: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  fontSize: '16px',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  color: 'var(--color-primary)',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{
                fontSize: '11px',
                color: '#9CA3AF',
                margin: '6px 0 0',
              }}>
                Pre-filled from your top gap — edit freely.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (!advisorForm.name || !advisorForm.email) return
              try {
                const leads = JSON.parse(localStorage.getItem('iga_leads') || '[]')
                leads.push({
                  ...advisorForm,
                  score: data.result.finalScore,
                  band: data.result.band.label,
                  timestamp: new Date().toISOString(),
                })
                localStorage.setItem('iga_leads', JSON.stringify(leads))
              } catch {}
              setAdvisorSubmitted(true)
            }}
            disabled={!advisorForm.name || !advisorForm.email}
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '15px',
              background: advisorForm.name && advisorForm.email
                ? 'var(--color-accent)' : '#E5E7EB',
              color: advisorForm.name && advisorForm.email ? '#fff' : '#9CA3AF',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: advisorForm.name && advisorForm.email ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-body)',
            }}
          >
            Request my free review
          </button>

          <p style={{
            fontSize: '12px',
            color: '#9CA3AF',
            textAlign: 'center',
            margin: '12px 0 0',
            lineHeight: 1.5,
          }}>
            Your InsureCheck score will be shared with your adviser so they can prepare — no need to explain everything from scratch.
          </p>
        </>
      ) : (
        <>
          <div style={{
            width: '40px',
            height: '4px',
            background: '#E5E7EB',
            borderRadius: '2px',
            margin: '0 auto 20px',
          }} />
          <div style={{
            textAlign: 'center',
            padding: '8px 0 16px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--color-teal-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '22px',
            }}>
              ✓
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              color: 'var(--color-primary)',
              margin: '0 0 8px',
            }}>
              You're all set, {advisorForm.name.split(' ')[0]}.
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0 0 24px',
              lineHeight: 1.6,
            }}>
              We'll match you with a licensed adviser and be in touch within 2 working days.
            </p>
            <button
              onClick={() => {
                setAdvisorModal(false)
                setAdvisorSubmitted(false)
              }}
              style={{
                padding: '12px 32px',
                background: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              Back to my results
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}

    </div>
  )
}