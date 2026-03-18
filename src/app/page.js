'use client'

export default function LandingPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-body)',
    }}>

      {/* Nav */}
      <nav style={{
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          color: 'var(--color-primary)',
        }}>
          InsureCheck
        </span>
        <a href="#how-it-works" style={{
          fontSize: '14px',
          color: 'var(--color-primary)',
          textDecoration: 'none',
          opacity: 0.7,
        }}>
          How it works
        </a>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '72px 24px 64px',
        maxWidth: '560px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 6vw, 48px)',
          color: 'var(--color-primary)',
          lineHeight: 1.2,
          margin: '0 0 20px',
        }}>
          Find out if you're truly protected.
        </h1>
        <p style={{
          fontSize: '17px',
          color: '#6B7280',
          lineHeight: 1.7,
          margin: '0 0 36px',
        }}>
          Get your Insurance Score in under 3 minutes —
          no agent, no sales pitch, no personal data stored.
        </p>
        <a href="/check" style={{
          display: 'inline-block',
          padding: '16px 40px',
          background: 'var(--color-accent)',
          color: '#fff',
          borderRadius: 'var(--radius-md)',
          fontSize: '16px',
          fontWeight: '600',
          textDecoration: 'none',
          letterSpacing: '0.01em',
        }}>
          Get my score →
        </a>

        {/* Trust badges */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}>
          {['Educational only', 'No data stored', 'Free'].map(badge => (
            <span key={badge} style={{
              fontSize: '12px',
              color: '#9CA3AF',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <span style={{ color: 'var(--color-accent)' }}>✓</span> {badge}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{
        padding: '48px 24px',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            color: 'var(--color-primary)',
            textAlign: 'center',
            margin: '0 0 36px',
          }}>
            How it works
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
            {[
              { step: '1', title: 'Answer 5 questions', body: 'Tell us about your current coverage — hospitalisation, CI, life, and what you pay.' },
              { step: '2', title: 'Get your Insurance Score', body: 'We benchmark your coverage against Singapore financial planning guidelines.' },
              { step: '3', title: 'Know your gaps', body: 'See exactly where you\'re underprotected, overpaying, or well covered.' },
            ].map(({ step, title, body }) => (
              <div key={step} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  flexShrink: 0,
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--color-accent)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '15px',
                }}>
                  {step}
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: '600', color: 'var(--color-primary)', fontSize: '15px' }}>{title}</p>
                  <p style={{ margin: 0, color: '#6B7280', fontSize: '14px', lineHeight: 1.6 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary CTA */}
      <section style={{ padding: '56px 24px', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          color: 'var(--color-primary)',
          margin: '0 0 8px',
        }}>
          Built for Singaporeans who want clarity, not another sales call.
        </p>
        <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '0 0 28px' }}>
          Takes 3 minutes. No sign-up required.
        </p>
        <a href="/check" style={{
          display: 'inline-block',
          padding: '14px 36px',
          border: '2px solid var(--color-primary)',
          color: 'var(--color-primary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '15px',
          fontWeight: '600',
          textDecoration: 'none',
        }}>
          Check your score
        </a>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px',
        borderTop: '1px solid var(--color-border)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0, lineHeight: 1.6 }}>
          This tool is for educational purposes only and does not constitute financial advice.
          Not affiliated with any insurer or MAS-licensed entity.
        </p>
      </footer>

    </main>
  )
}