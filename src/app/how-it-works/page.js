'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ─── Expandable section component ────────────────────────────────────────────

function Expandable({ label, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginTop: '12px' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none',
          border: 'none',
          padding: '8px 0',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--color-accent)',
          fontFamily: 'var(--font-body)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{
          display: 'inline-block',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          fontSize: '11px',
        }}>
          ▶
        </span>
        {open ? 'Hide details' : label}
      </button>
      {open && (
        <div style={{
          marginTop: '8px',
          padding: '16px',
          background: '#F9FAFB',
          borderRadius: '10px',
          borderLeft: '3px solid var(--color-accent)',
          animation: 'fadeSlideUp 0.2s ease both',
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Pillar card component ────────────────────────────────────────────────────

function PillarCard({ color, emoji, title, weight, summary, why, expandContent }) {
  const colors = {
    red:   { bg: '#FCEBEB', border: '#E24B4A', badge: '#FCEBEB', badgeText: '#A32D2D' },
    amber: { bg: '#FAEEDA', border: '#EF9F27', badge: '#FAEEDA', badgeText: '#854F0B' },
    blue:  { bg: '#E6F1FB', border: '#378ADD', badge: '#E6F1FB', badgeText: '#185FA5' },
    gray:  { bg: '#F1EFE8', border: '#888780', badge: '#F1EFE8', badgeText: '#5F5E5A' },
  }
  const c = colors[color] ?? colors.gray

  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: '14px',
      border: '1px solid var(--color-border)',
      borderTop: `3px solid ${c.border}`,
      padding: '20px',
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <span style={{ fontSize: '20px' }}>{emoji}</span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '17px',
          color: 'var(--color-primary)',
          flex: 1,
        }}>
          {title}
        </span>
        <span style={{
          padding: '2px 10px',
          borderRadius: '100px',
          fontSize: '11px',
          fontWeight: '700',
          background: c.badge,
          color: c.badgeText,
          letterSpacing: '0.03em',
        }}>
          {weight}
        </span>
      </div>

      <p style={{
        fontSize: '14px',
        color: '#374151',
        lineHeight: 1.6,
        margin: '0 0 8px',
      }}>
        {summary}
      </p>

      <p style={{
        fontSize: '13px',
        color: '#6B7280',
        lineHeight: 1.6,
        margin: 0,
        fontStyle: 'italic',
      }}>
        {why}
      </p>

      <Expandable label="See how we calculate this">
        {expandContent}
      </Expandable>
    </div>
  )
}

// ─── Formula box ─────────────────────────────────────────────────────────────

function Formula({ children }) {
  return (
    <div style={{
      fontFamily: 'monospace',
      fontSize: '12px',
      color: 'var(--color-primary)',
      lineHeight: 1.8,
      margin: '10px 0',
      padding: '12px 14px',
      background: 'var(--color-surface)',
      borderRadius: '8px',
      border: '1px solid var(--color-border)',
      whiteSpace: 'pre-wrap',
    }}>
      {children}
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children, noBorder }) {
  return (
    <div style={{
      paddingTop: '36px',
      borderTop: noBorder ? 'none' : '1px solid var(--color-border)',
      marginTop: noBorder ? '0' : '8px',
    }}>
      {title && (
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          color: 'var(--color-primary)',
          margin: '0 0 16px',
        }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}

function BodyText({ children, muted }) {
  return (
    <p style={{
      fontSize: '15px',
      color: muted ? '#6B7280' : '#374151',
      lineHeight: 1.7,
      margin: '0 0 12px',
    }}>
      {children}
    </p>
  )
}

function Caveat({ children }) {
  return (
    <div style={{
      fontSize: '13px',
      color: '#6B7280',
      lineHeight: 1.6,
      padding: '12px 16px',
      background: '#F9FAFB',
      borderRadius: '8px',
      borderLeft: '3px solid #D1D5DB',
      marginTop: '10px',
    }}>
      {children}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function HowItWorksPage() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-body)',
      paddingBottom: '64px',
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
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: 'var(--color-primary)',
            padding: '4px 8px 4px 0',
          }}
          onClick={() => router.back()}
          aria-label="Go back"
        >
          ←
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span style={{
            fontFamily: 'var(--font-coah)',
            fontSize: '10px',
            fontWeight: '600',
            color: 'var(--color-coah)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}>
            Coah
          </span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '17px',
            color: 'var(--color-primary)',
            lineHeight: 1,
          }}>
            InsureCheck
          </span>
        </div>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px' }}>

        {/* ── Hero ── */}
        <Section noBorder>
          <div style={{ paddingTop: '40px', paddingBottom: '8px' }}>

            {/* Coah attribution */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}>
              <span style={{
                fontFamily: 'var(--font-coah)',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--color-coah)',
                letterSpacing: '0.08em',
              }}>
                COAH
              </span>
              <span style={{
                fontSize: '12px',
                color: '#9CA3AF',
                borderLeft: '1px solid var(--color-border)',
                paddingLeft: '8px',
              }}>
                Built for Singapore
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(26px, 5vw, 36px)',
              color: 'var(--color-primary)',
              margin: '0 0 12px',
              lineHeight: 1.2,
            }}>
              How we calculate your score
            </h1>
            <BodyText>
              Your Insurance Score is a simple 0–100 number that shows how well your
              current coverage stacks up against Singapore financial planning benchmarks.
              It's not a verdict — it's a starting point.
            </BodyText>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '16px',
            }}>
              {[
                'Based on CFP needs-analysis',
                'Singapore-specific benchmarks',
                'Educational only — not financial advice',
              ].map(tag => (
                <span key={tag} style={{
                  fontSize: '12px',
                  color: 'var(--color-accent)',
                  background: 'var(--color-teal-bg)',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontWeight: '500',
                }}>
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* ── TL;DR ── */}
        <Section title="TL;DR — the quick version">
          <BodyText>
            We look at four things. Each one tells us something different about your financial safety net.
          </BodyText>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { emoji: '🏥', label: 'Hospitalisation', desc: "Do you have cover if you need to be hospitalised? This is a yes/no gate — without it, your score is capped at 50." },
              { emoji: '🩺', label: 'Critical illness (CI + ECI)', desc: "Do you have enough cover if you're diagnosed with cancer, a heart attack, or a stroke? Weighted at 40%." },
              { emoji: '🛡️', label: 'Life and TPD', desc: "Are the people who depend on you protected if you pass away or can no longer work? Weighted at 30%." },
              { emoji: '💰', label: 'Premium efficiency', desc: "Are your premiums proportionate to your income — or are you overspending? Weighted at 20%." },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex',
                gap: '12px',
                padding: '14px',
                background: 'var(--color-surface)',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.emoji}</span>
                <div>
                  <p style={{ margin: '0 0 3px', fontWeight: '600', fontSize: '14px', color: 'var(--color-primary)' }}>
                    {item.label}
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Score meaning ── */}
        <Section title="What does your score actually mean?">
          <BodyText>
            Think of it like a health check — not a pass/fail exam.
          </BodyText>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { color: '#E24B4A', bg: '#FCEBEB', range: '0 – 39',   label: 'At risk',           desc: 'You have critical gaps. At least one major area of protection is missing.' },
              { color: '#EF9F27', bg: '#FAEEDA', range: '40 – 59',  label: 'Partially covered', desc: "You have some coverage but meaningful gaps remain — worth addressing." },
              { color: '#378ADD', bg: '#E6F1FB', range: '60 – 79',  label: 'Mostly covered',    desc: "You're in reasonable shape. A few areas to tighten up." },
              { color: '#1D9E75', bg: '#E1F5EE', range: '80 – 100', label: 'Well protected',    desc: 'Your coverage meets or exceeds the key benchmarks. Well done.' },
            ].map(band => (
              <div key={band.range} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                borderRadius: '10px',
                background: band.bg,
              }}>
                <div style={{
                  minWidth: '60px',
                  fontWeight: '700',
                  fontSize: '14px',
                  color: band.color,
                }}>
                  {band.range}
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: '600', fontSize: '14px', color: band.color }}>
                    {band.label}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: 1.4 }}>
                    {band.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── How the score works ── */}
        <Section title="How the score is built">
          <BodyText>
            Your score is a weighted combination of four pillars. But hospitalisation
            comes first — it acts as a gate.
          </BodyText>
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '16px',
          }}>
            <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              The gate rule
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>
              If you don't have hospitalisation cover, your score is <strong>capped at 50</strong> — no matter how strong your other pillars are. One hospital stay without cover can wipe out years of savings.
            </p>
          </div>
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '16px 20px',
          }}>
            <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              The weighting
            </p>
            {[
              { label: 'Critical illness', pct: 40, color: '#EF9F27' },
              { label: 'Life and TPD',     pct: 30, color: '#378ADD' },
              { label: 'Premium efficiency', pct: 20, color: '#888780' },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#374151' }}>{item.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: item.color }}>{item.pct}%</span>
                </div>
                <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
            <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#9CA3AF', lineHeight: 1.5 }}>
              If you skip the premium question, the 20% weight is redistributed proportionally between CI and Life/TPD.
            </p>
          </div>

          <Expandable label="Show the full formula">
            <Formula>
              {`Final score = (CI score × 40%) + (Life score × 30%) + (Premium score × 20%)

If hospitalisation = No or Unsure → score capped at 50
If premium skipped → CI and Life/TPD weights redistributed proportionally

Exact amounts → precise ratio formula
Band inputs → band midpoint used as proxy → score shown as "estimated"`}
            </Formula>
          </Expandable>
        </Section>

        {/* ── Coah: Incorruptible Logic ── */}
        <div style={{
          marginTop: '36px',
          padding: '20px',
          background: 'var(--color-coah)',
          borderRadius: '14px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}>
            <span style={{
              fontFamily: 'var(--font-coah)',
              fontSize: '14px',
              fontWeight: '600',
              color: '#fff',
              letterSpacing: '0.08em',
            }}>
              COAH
            </span>
            <span style={{
  fontSize: '11px',
  color: 'rgba(255,255,255,0.5)',
  borderLeft: '1px solid rgba(255,255,255,0.2)',
  paddingLeft: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}}>
  Why this is free
</span>
          </div>
          <p style={{
  fontSize: '13px',
  color: 'rgba(255,255,255,0.8)',
  lineHeight: 1.7,
  margin: 0,
}}>
  InsureCheck has no ads, no affiliate links, and no advisor referral fees.
  We don't earn anything when you use it. It's free because we believe
  Singaporeans deserve access to honest financial tools without a sales
  agenda attached. This is what Coah is built for.
</p>
        </div>

        {/* ── Pillars ── */}
        <Section title="The four pillars in detail">
          <BodyText muted>
            Tap any pillar to see exactly how we calculate its score.
          </BodyText>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>

            {/* Hospitalisation */}
            <PillarCard
              color="red"
              emoji="🏥"
              title="Hospitalisation"
              weight="Gate"
              summary="This is binary — you either have it or you don't. If you don't, your final score is capped at 50 regardless of everything else."
              why="A single hospitalisation without cover can cost S$10,000–S$50,000+ out of pocket. It's the most immediate financial risk for most people."
              expandContent={
                <>
                  <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6, margin: '0 0 10px' }}>
                    All Singapore Citizens and PRs have MediShield Life as a base. An Integrated Shield Plan (ISP) from a private insurer gives you access to higher ward classes and private hospitals.
                  </p>
                  <Formula>
                    {`Yes → full scoring unlocked
No → final score capped at 50
Not sure → treated as No (capped at 50, flagged in results)`}
                  </Formula>
                  <Caveat>
                    We treat all hospitalisation cover equally regardless of ward class or plan tier.
                    A basic MediShield Life policy and a full private ISP are both scored as "covered"
                    — your actual level of protection may differ significantly.
                  </Caveat>
                </>
              }
            />

            {/* CI */}
            <PillarCard
              color="amber"
              emoji="🩺"
              title="Critical illness (CI)"
              weight="40%"
              summary="We check whether your CI sum assured is roughly 5× your annual income. That's enough to cover a few years of lost income plus treatment costs."
              why="A cancer diagnosis or major heart event can stop your income for years. CI cover is the lump sum that bridges that gap — your hospitalisation insurance doesn't cover it."
              expandContent={
                <>
                  <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6, margin: '0 0 8px' }}>
                    The 5× benchmark comes from CFP needs-analysis applied to Singapore cost data:
                  </p>
                  <Formula>
                    {`CI need ≈ (income × ~3 years recovery) + ~S$100k treatment costs

At S$60k income: (60k × 3) + 100k = S$280k ≈ 4.7× income
At S$48k income: (48k × 3) + 100k = S$244k ≈ 5.1× income

We use 5× as a rounded, conservative benchmark.

CI score = min(your CI cover ÷ (5 × income), 1.0) × 100

Band scoring (if exact amount unknown):
  Less than 2× income → midpoint 1× used
  2–5× income → midpoint 3.5× used
  More than 5× income → midpoint 6× used`}
                  </Formula>
                  <Caveat>
                    The S$100k treatment cost estimate is based on Singapore Cancer Registry data
                    and LIA Singapore industry studies. The LIA estimates Singaporeans are underinsured
                    on CI by approximately 70% on average.
                  </Caveat>
                </>
              }
            />

            {/* ECI */}
            <div style={{
              marginLeft: '16px',
              paddingLeft: '16px',
              borderLeft: '2px solid var(--color-border)',
            }}>
              <PillarCard
                color="amber"
                emoji="⚡"
                title="Early critical illness (ECI)"
                weight="Boost +20pts"
                summary="ECI is a bonus on top of your CI score. Standard CI pays out late — ECI pays out earlier, when treatment costs are highest."
                why="Early-stage cancer treatment in Singapore can cost S$30k–S$80k before a standard CI policy would even trigger. ECI covers that window."
                expandContent={
                  <>
                    <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6, margin: '0 0 8px' }}>
                      ECI is not a separate pillar — it boosts your CI pillar score. Having ECI alongside CI shows you're covered at both early and late stages of illness.
                    </p>
                    <Formula>
                      {`ECI boost:
  No ECI → +0 pts
  Less than 0.8× income → +5 pts
  0.8–1.5× income → +10 pts
  More than 1.5× income → +20 pts

Combined resilience = min(CI base score + ECI boost, 100)

ECI can only boost — it cannot compensate for a low CI base score.`}
                    </Formula>
                    <Caveat>
                      ECI is flagged as a gap even when your CI score is strong — they cover
                      different stages of the same illness.
                    </Caveat>
                  </>
                }
              />
            </div>

            {/* Life/TPD */}
            <PillarCard
              color="blue"
              emoji="🛡️"
              title="Life and TPD"
              weight="30%"
              summary="We check whether your life and TPD sum assured is roughly 9× your annual income — enough to replace your income for the people who depend on you."
              why="Life insurance protects your dependants if you pass away. TPD cover protects you if you're permanently unable to work — even if you have no dependants."
              expandContent={
                <>
                  <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6, margin: '0 0 8px' }}>
                    The 9× benchmark is based on MAS financial planning guidelines for income replacement, consistent with the CFP needs-analysis approach for someone with dependants.
                  </p>
                  <Formula>
                    {`Life/TPD score = min(your cover ÷ (9 × income), 1.0) × 100

Band scoring (if exact amount unknown):
  Less than 5× income → midpoint 3× used
  5–9× income → midpoint 7× used
  More than 9× income → midpoint 11× used`}
                  </Formula>
                  <Caveat>
                    The 9× benchmark assumes you have dependants. If you have no dependants,
                    your life cover need may be lower. If you have a mortgage, children, or
                    other obligations, it may be higher. TPD cover is relevant regardless of
                    dependants — it funds your own care if you can no longer work.
                  </Caveat>
                </>
              }
            />

            {/* Premium */}
            <PillarCard
              color="gray"
              emoji="💰"
              title="Premium efficiency"
              weight="20%"
              summary="We check whether your total insurance spend is proportionate to your income. Spending more than ~15% of your income on premiums may mean your money is being inefficiently allocated."
              why="Insurance premiums shouldn't crowd out your savings and investments. This pillar flags when they might be."
              expandContent={
                <>
                  <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6, margin: '0 0 8px' }}>
                    The 15% ceiling is consistent with practitioner guidance used in Singapore financial planning courses (Kaplan, Singapore Polytechnic).
                  </p>
                  <Formula>
                    {`Annual premium ratio = (monthly premium × 12) ÷ annual income

Premium score = max(0, (1 − ratio ÷ 0.15)) × 100

At 5% of income → score: 67
At 10% of income → score: 33
At 15% or above → score: 0 (flagged as high)`}
                  </Formula>
                  <Caveat>
                    High premiums are not always wrong. Investment-linked policies (ILPs) carry
                    higher premiums because they include a savings component. This flag is a
                    starting point for reflection — not a verdict.
                  </Caveat>
                </>
              }
            />

          </div>
        </Section>

        {/* ── Sources ── */}
        <Section title="Where our benchmarks come from">
          <BodyText muted>
            We don't make these numbers up. Here's what we referenced:
          </BodyText>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              {
                title: 'CFP needs-analysis framework',
                desc: 'Used for CI lump sum calculation — income replacement plus estimated treatment costs.',
              },
              {
                title: 'MAS financial planning guidelines',
                desc: 'Referenced for life and TPD coverage benchmarks and the role of hospitalisation cover.',
              },
              {
                title: 'LIA Singapore industry data',
                desc: 'Average CI treatment costs and the estimate that Singaporeans are underinsured on CI by ~70%.',
              },
              {
                title: 'Singapore Cancer Registry',
                desc: 'Average cancer treatment duration and cost ranges used in the CI needs calculation.',
              },

            ].map(item => (
              <div key={item.title} style={{
                padding: '12px 16px',
                background: 'var(--color-surface)',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
              }}>
                <p style={{ margin: '0 0 3px', fontWeight: '600', fontSize: '13px', color: 'var(--color-primary)' }}>
                  {item.title}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Limitations ── */}
        <Section title="What this tool doesn't account for">
          <BodyText muted>
            Benchmarks are generalisations. These factors can affect how much cover you actually need:
          </BodyText>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              ['Dependants',             'More dependants = more life and CI cover needed. We use one benchmark for everyone.'],
              ['Outstanding debt',       'A mortgage or large loans increase your required cover significantly.'],
              ['Existing assets',        'Savings, CPF, and investments can partially offset your insurance needs.'],
              ['Health history',         'Pre-existing conditions may affect what you can get and at what cost.'],
              ['Hospitalisation tier',   'We treat all H&S cover equally — MediShield Life and a full private plan both score as "covered."'],
              ['Policy exclusions',      'Your actual cover may be lower than your sum assured due to exclusions or conditions.'],
              ['Medical inflation',      'Healthcare costs in Singapore rise ~8–10% a year. A sum assured that works today may not in 10 years.'],
            ].map(([title, desc]) => (
              <div key={title} style={{
                display: 'flex',
                gap: '10px',
                padding: '12px 14px',
                background: 'var(--color-surface)',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                alignItems: 'flex-start',
              }}>
                <span style={{
                  flexShrink: 0,
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#D1D5DB',
                  marginTop: '7px',
                }} />
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: '600', fontSize: '13px', color: 'var(--color-primary)' }}>
                    {title}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Disclaimer + Coah footer ── */}
        <div style={{
          marginTop: '36px',
          paddingTop: '24px',
          borderTop: '1px solid var(--color-border)',
        }}>
          <p style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.6, margin: '0 0 6px' }}>
            InsureCheck is an educational tool. It does not constitute financial advice.
            Benchmarks are based on general Singapore financial planning guidelines and are
            not tailored to your personal circumstances. Please consult a MAS-licensed
            financial adviser for advice specific to your situation.
          </p>
          <p style={{ fontSize: '11px', color: '#C4C9D4', margin: '0 0 20px' }}>
            Not affiliated with any insurer or MAS-licensed entity.
          </p>

          {/* Coah signature */}
          <div style={{
            paddingTop: '16px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-coah)',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--color-coah)',
                letterSpacing: '0.08em',
              }}>
                COAH
              </span>
              <span style={{
                fontSize: '11px',
                color: '#9CA3AF',
                borderLeft: '1px solid var(--color-border)',
                paddingLeft: '8px',
              }}>
                Modern Utilities for the Common Good
              </span>
            </div>
            <a href="#" style={{
              fontSize: '11px',
              color: '#9CA3AF',
              textDecoration: 'none',
            }}>
              coah.sg
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}