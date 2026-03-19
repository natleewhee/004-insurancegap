'use client'

import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-body)',
    }}>

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "InsureCheck",
            "url": "https://sginsurecheck.vercel.app",
            "description": "Free insurance coverage checker for Singaporeans. Get your Insurance Score in 3 minutes.",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "SGD"
            },
            "audience": {
              "@type": "Audience",
              "geographicArea": {
                "@type": "Country",
                "name": "Singapore"
              }
            }
          })
        }}
      />

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
          opacity: 0.6,
        }}>
          How it works
        </a>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '72px 24px 56px',
        maxWidth: '560px',
        margin: '0 auto',
        textAlign: 'center',
      }}>

        {/* Visually hidden SEO heading */}
        <h1 style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}>
          Free Insurance Coverage Checker Singapore — InsureCheck
        </h1>

        {/* Visual headline */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(30px, 6vw, 46px)',
          color: 'var(--color-primary)',
          lineHeight: 1.2,
          margin: '0 0 16px',
        }}>
          You probably have insurance. But do you actually know what it covers?
        </h2>

        <p style={{
          fontSize: '17px',
          color: '#6B7280',
          lineHeight: 1.7,
          margin: '0 0 32px',
        }}>
          InsureCheck scores your coverage in 3 minutes — free, neutral, no agent involved.
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
          Check my score — it's free
        </a>

        {/* Trust badges */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          {[
            'No sign-up',
            'No data stored',
            'Not affiliated with any insurer',
          ].map(badge => (
            <span key={badge} style={{
              fontSize: '12px',
              color: '#9CA3AF',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>✓</span> {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Social proof provocation */}
      <section style={{
        padding: '20px 24px 32px',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '0 auto',
      }}>
        <p style={{
          fontSize: '15px',
          color: '#6B7280',
          lineHeight: 1.6,
          margin: 0,
          fontStyle: 'italic',
          borderLeft: '3px solid var(--color-accent)',
          paddingLeft: '16px',
          textAlign: 'left',
        }}>
          1 in 3 Singaporeans are underinsured without knowing it. Are you one of them?
        </p>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{
        padding: '48px 24px',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            color: 'var(--color-primary)',
            textAlign: 'center',
            margin: '0 0 36px',
          }}>
            How it works
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {[
              {
                step: '1',
                title: 'Tell us what you have',
                body: '5 quick questions about your policies. Takes under 3 minutes.',
              },
              {
                step: '2',
                title: 'We run the numbers',
                body: 'Your coverage is benchmarked against Singapore financial planning standards — not a generic template.',
              },
              {
                step: '3',
                title: 'See exactly where you stand',
                body: 'Gaps, overpayment, and what to do next — laid out clearly, without the sales pitch.',
              },
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
                  <p style={{
                    margin: '0 0 4px',
                    fontWeight: '600',
                    color: 'var(--color-primary)',
                    fontSize: '15px',
                  }}>
                    {title}
                  </p>
                  <p style={{
                    margin: 0,
                    color: '#6B7280',
                    fontSize: '14px',
                    lineHeight: 1.6,
                  }}>
                    {body}
                  </p>
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
          lineHeight: 1.3,
        }}>
          Know before you buy. Check before you commit.
        </p>
        <p style={{
          color: '#9CA3AF',
          fontSize: '14px',
          margin: '0 0 28px',
        }}>
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
          Check my score — free
        </a>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px',
        borderTop: '1px solid var(--color-border)',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '12px',
          color: '#9CA3AF',
          margin: '0 0 6px',
          lineHeight: 1.6,
        }}>
          This tool is for educational purposes only and does not constitute financial advice.
          Coverage benchmarks are based on general Singapore financial planning guidelines.
        </p>
        <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 8px' }}>
          Not affiliated with any insurer or MAS-licensed entity.
        </p>
        
        <a href="/how-it-works" style={{ fontSize: '12px', color: 'var(--color-accent)', textDecoration: 'none' }}>{'How we calculate your score \u2192'}</a>
      </footer>

    </main>
  )
}