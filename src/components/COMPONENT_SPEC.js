/**
 * Insurance Gap Analyzer — Component Spec
 * ===========================================
 * Framework: React + Next.js (App Router)
 * Styling: Tailwind CSS (utility classes only)
 * Animation: CSS transitions + requestAnimationFrame for score counter
 * State: React useState/useReducer — no external state library needed for MVP
 * Fonts: DM Serif Display (headings) + DM Sans (body) — Google Fonts
 */

// =============================================================================
// DESIGN TOKENS
// =============================================================================

/**
 * src/styles/tokens.css
 *
 * :root {
 *   --color-primary:     #0F2D6B;   Deep navy — trust, authority
 *   --color-accent:      #1D9E75;   Teal — health, clarity
 *   --color-bg:          #F7F8FA;   Off-white background
 *   --color-surface:     #FFFFFF;   Card surfaces
 *   --color-border:      #E5E7EB;   Subtle borders
 *
 *   --color-red:         #E24B4A;
 *   --color-red-bg:      #FCEBEB;
 *   --color-amber:       #EF9F27;
 *   --color-amber-bg:    #FAEEDA;
 *   --color-blue:        #378ADD;
 *   --color-blue-bg:     #E6F1FB;
 *   --color-teal:        #1D9E75;
 *   --color-teal-bg:     #E1F5EE;
 *
 *   --font-display:      'DM Serif Display', Georgia, serif;
 *   --font-body:         'DM Sans', system-ui, sans-serif;
 *
 *   --radius-sm:  6px;
 *   --radius-md:  12px;
 *   --radius-lg:  20px;
 *   --radius-xl:  32px;
 *
 *   --shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
 * }
 */

// =============================================================================
// APP STATE SHAPE
// =============================================================================

/**
 * Managed by useReducer in AppContext.
 *
 * {
 *   step: 'landing' | 'inputs' | 'loading' | 'results',
 *   inputs: UserInputs,          // from scorer.js
 *   result: ScoreResult | null,  // from calculateScore()
 *   savedInputs: UserInputs | null, // persisted to localStorage for re-check
 * }
 *
 * Actions:
 *   { type: 'START' }
 *   { type: 'UPDATE_INPUTS', payload: Partial<UserInputs> }
 *   { type: 'SUBMIT' }           // triggers loading → results
 *   { type: 'RECHECK' }          // results → inputs (pre-filled)
 *   { type: 'RESET' }            // back to landing
 */

// =============================================================================
// COMPONENT TREE
// =============================================================================

/**
 * App (layout)
 * ├── LandingPage
 * ├── InputPage
 * │   ├── ProgressBar
 * │   ├── QuestionBlock (rendered per step)
 * │   │   ├── AgeIncomeQuestion
 * │   │   ├── HospQuestion
 * │   │   ├── CIQuestion
 * │   │   │   ├── ExactAmountInput
 * │   │   │   └── BandSelector (fallback)
 * │   │   ├── ECIQuestion
 * │   │   │   ├── ECITooltip
 * │   │   │   ├── ExactAmountInput
 * │   │   │   └── BandSelector (fallback)
 * │   │   ├── LifeQuestion
 * │   │   │   ├── ExactAmountInput
 * │   │   │   └── BandSelector (fallback)
 * │   │   └── PremiumQuestion
 * │   └── InputCTA
 * ├── LoadingScreen
 * └── ResultsPage
 *     ├── ScoreCircle
 *     ├── InsightCard (× up to 4)
 *     ├── CoverageBreakdown
 *     │   └── PillarRow (× 5)
 *     ├── CTARow
 *     └── Disclaimer
 */

// =============================================================================
// COMPONENT SPECS
// =============================================================================

// -----------------------------------------------------------------------------
// 1. ProgressBar
// -----------------------------------------------------------------------------
/**
 * @component ProgressBar
 * @description Multi-step progress indicator. Fills left to right.
 *
 * Props:
 *   current {number}  — current step index (0-based)
 *   total   {number}  — total steps
 *
 * Behaviour:
 *   - Width animates via CSS transition (300ms ease-out) on current change
 *   - Shows "Step N of N" label in small text above bar
 *   - Bar colour: --color-accent (teal)
 *
 * DOM:
 *   <div role="progressbar" aria-valuenow={current} aria-valuemax={total}>
 *     <span>{current} of {total}</span>
 *     <div class="track">
 *       <div class="fill" style={{ width: `${pct}%` }} />
 *     </div>
 *   </div>
 */

// -----------------------------------------------------------------------------
// 2. ExactAmountInput
// -----------------------------------------------------------------------------
/**
 * @component ExactAmountInput
 * @description Currency input with SGD prefix. Shows "I don't know" escape.
 *
 * Props:
 *   label        {string}    — field label
 *   value        {number|null}
 *   onChange     {(v: number|null) => void}
 *   onUnknown    {() => void}  — called when user taps "I don't know the exact amount"
 *   placeholder  {string}    — e.g. "e.g. 200,000"
 *   hint         {string}    — grey helper text below input
 *
 * Behaviour:
 *   - Input type="text" with inputmode="numeric" (mobile numpad)
 *   - Formats with commas on blur: 200000 → "200,000"
 *   - Strips formatting on focus for easy editing
 *   - Validates: positive integer, max $10,000,000
 *   - "I don't know the exact amount" link below input — tapping reveals BandSelector
 *     and hides ExactAmountInput (smooth height transition)
 *   - If value already set from re-check, pre-fills and shows formatted
 *
 * Accessibility:
 *   - aria-label on input
 *   - Error message role="alert" on invalid input
 */

// -----------------------------------------------------------------------------
// 3. BandSelector
// -----------------------------------------------------------------------------
/**
 * @component BandSelector
 * @description Pill-style option selector for band fallback inputs.
 *
 * Props:
 *   options  {Array<{ value: string, label: string, sublabel?: string }>}
 *   value    {string|null}
 *   onChange {(v: string) => void}
 *
 * Behaviour:
 *   - Renders options as horizontal pill buttons (wraps on small screens)
 *   - Selected state: filled bg (--color-primary), white text
 *   - Unselected: border only, --color-primary text
 *   - Tap to select, tap again to deselect
 *   - Smooth scale transform on press (0.97)
 *
 * Example options for CI band:
 *   [
 *     { value: 'low',     label: 'Less than 2× my income' },
 *     { value: 'partial', label: '2–4× my income' },
 *     { value: 'high',    label: 'More than 4× my income' },
 *   ]
 */

// -----------------------------------------------------------------------------
// 4. ECITooltip
// -----------------------------------------------------------------------------
/**
 * @component ECITooltip
 * @description Inline expandable explanation of ECI for users unfamiliar with it.
 *
 * Props:
 *   none — self-contained
 *
 * Behaviour:
 *   - Shows as a subtle "What is ECI?" link with an info icon
 *   - Tapping expands an inline card (not a modal — no position:fixed)
 *   - Card content: 2-sentence plain-English explanation + example
 *   - Collapses on second tap or tap outside
 *   - Max-height transition (0 → auto via JS-measured height)
 *
 * Copy:
 *   "Early Critical Illness (ECI) cover pays out at an earlier stage of
 *    serious illness — like a minor heart attack or early-stage cancer —
 *    before a standard CI policy would trigger. Treatment costs are highest
 *    in the early stages, so ECI bridges that gap."
 */

// -----------------------------------------------------------------------------
// 5. ScoreCircle
// -----------------------------------------------------------------------------
/**
 * @component ScoreCircle
 * @description Animated circular score display. The hero element of results page.
 *
 * Props:
 *   score       {number}   — 0–100
 *   band        {object}   — { label, color } from SCORE_BANDS
 *   isEstimated {boolean}
 *   animate     {boolean}  — default true
 *
 * Behaviour:
 *   - SVG circle with stroke-dasharray/dashoffset for arc fill
 *   - Counter animates 0 → score over 1500ms using easeOutCubic
 *   - Arc colour matches band: red/amber/blue/teal
 *   - Band label fades in at 1200ms (before counter finishes)
 *   - If isEstimated: shows "~ " prefix and "(estimated)" below label
 *   - Size: 180px diameter on mobile, 220px on desktop
 *
 * Animation logic (useEffect):
 *   const start = performance.now()
 *   const duration = 1500
 *   function tick(now) {
 *     const t = Math.min((now - start) / duration, 1)
 *     const eased = 1 - Math.pow(1 - t, 3)  // easeOutCubic
 *     setDisplayScore(Math.round(eased * score))
 *     setArcProgress(eased)
 *     if (t < 1) requestAnimationFrame(tick)
 *   }
 *   requestAnimationFrame(tick)
 *
 * SVG arc formula:
 *   circumference = 2π × r  (r = 80)
 *   strokeDashoffset = circumference × (1 - arcProgress)
 *   strokeDasharray = circumference
 *
 * Accessibility:
 *   role="img" aria-label={`Insurance score: ${score} out of 100. ${band.label}.`}
 */

// -----------------------------------------------------------------------------
// 6. InsightCard
// -----------------------------------------------------------------------------
/**
 * @component InsightCard
 * @description Individual gap or recommendation card on results page.
 *
 * Props:
 *   card      {InsightCard}  — from generateInsights()
 *   index     {number}       — for stagger animation delay
 *   onCTA     {(id) => void} — called when CTA button tapped
 *
 * InsightCard shape:
 *   {
 *     id:       string
 *     severity: 'critical' | 'warning' | 'info' | 'nudge'
 *     title:    string
 *     body:     string
 *     action:   string | null
 *     cta:      string
 *   }
 *
 * Behaviour:
 *   - Fades + slides up on mount (animation-delay: index × 80ms)
 *   - Left border accent coloured by severity
 *   - Severity icon rendered as small filled circle with letter/symbol
 *   - Body text collapsed to 3 lines with "Read more" if > 120 chars
 *   - CTA button: ghost style on info/nudge, filled on critical/warning
 *
 * Severity → colour mapping:
 *   critical → red    (#E24B4A bg, #FCEBEB surface)
 *   warning  → amber  (#EF9F27 bg, #FAEEDA surface)
 *   info     → blue   (#378ADD bg, #E6F1FB surface)
 *   nudge    → teal   (#1D9E75 bg, #E1F5EE surface)
 */

// -----------------------------------------------------------------------------
// 7. PillarRow
// -----------------------------------------------------------------------------
/**
 * @component PillarRow
 * @description Single row in the coverage breakdown section.
 *
 * Props:
 *   label       {string}        — e.g. "Critical illness"
 *   sublabel    {string|null}   — e.g. "$120,000 · 2.0× income" or "~$120,000 (estimated)"
 *   score       {number|null}   — 0–100, null for gate/skipped
 *   color       {string}        — 'red'|'amber'|'blue'|'teal'
 *   isGap       {boolean}       — shows "Gap flagged" instead of score bar
 *   isSkipped   {boolean}       — shows "Not provided" muted state
 *
 * Behaviour:
 *   - Score bar animates width from 0 → score% on mount (600ms, delay by row index × 100ms)
 *   - Bar colour from color prop
 *   - isGap: shows a short red stub bar + "Gap flagged" label (no numeric score)
 *   - isSkipped: full-width muted bar, "Not provided" label
 *   - Score label right-aligned: "75 / 100" or "Covered" or "Gap flagged"
 */

// -----------------------------------------------------------------------------
// 8. CoverageBreakdown
// -----------------------------------------------------------------------------
/**
 * @component CoverageBreakdown
 * @description Container for all PillarRow components.
 *
 * Props:
 *   result {ScoreResult}   — from calculateScore()
 *
 * Renders 5 rows in order:
 *   1. Hospitalisation  — gate (pass/fail/unsure)
 *   2. Critical illness — resilience.ci.score
 *   3. Early CI         — resilience.eci.boost → shown as 0–20 out of 20
 *   4. Life / TPD       — life.score
 *   5. Premium          — premium.score or skipped
 *
 * ECI row special case:
 *   - sublabel: "Boosts CI score by +{boost} pts" or "None detected"
 *   - bar fills to boost/20 × 100% rather than score/100
 *   - isGap = true if hasCI=yes and boost=0
 */

// -----------------------------------------------------------------------------
// 9. LoadingScreen
// -----------------------------------------------------------------------------
/**
 * @component LoadingScreen
 * @description 2-second loading interstitial between inputs and results.
 *
 * Props:
 *   onComplete {() => void}   — called after animation sequence
 *
 * Behaviour:
 *   - 3 rotating messages, 600ms each:
 *     1. "Checking your coverage gaps…"
 *     2. "Comparing against Singapore benchmarks…"
 *     3. "Calculating your Insurance Score…"
 *   - Each fades out and next fades in
 *   - After all 3: calls onComplete()
 *   - Animated pulsing ring behind the message (CSS keyframes)
 *   - Scoring runs synchronously (it's just math) — loading is UX polish only
 *     so run calculateScore() before starting the animation, display on complete
 */

// -----------------------------------------------------------------------------
// 10. CTARow
// -----------------------------------------------------------------------------
/**
 * @component CTARow
 * @description Primary and secondary action buttons below breakdown.
 *
 * Props:
 *   onAdvisor   {() => void}   — "Talk to an advisor"
 *   onRecheck   {() => void}   — "Update my score"
 *   onShare     {() => void}   — "Share my score"
 *   hasAdvisor  {boolean}      — false in MVP (placeholder CTA)
 *
 * Layout:
 *   - Two full-width buttons stacked on mobile
 *   - Side-by-side on tablet+
 *   - "Talk to an advisor": filled teal, primary
 *   - "Update my score": outline navy, secondary
 *   - "Share my score": text-only link below buttons
 *
 * hasAdvisor=false behaviour:
 *   - "Talk to an advisor" shows modal: "Coming soon — leave your email
 *     and we'll connect you with a licensed advisor."
 *   - Email captured to localStorage only in MVP (no backend)
 */

// -----------------------------------------------------------------------------
// 11. Disclaimer
// -----------------------------------------------------------------------------
/**
 * @component Disclaimer
 * @description Always-visible MAS compliance disclaimer.
 *
 * Props: none
 *
 * Copy:
 *   "This score is for educational purposes only and does not constitute
 *    financial advice. Coverage benchmarks are based on general Singapore
 *    financial planning guidelines. Please consult a MAS-licensed financial
 *    adviser for recommendations tailored to your personal situation."
 *
 * Style:
 *   - Small text (12px), muted colour (#9CA3AF)
 *   - Thin top border separator
 *   - Never collapsible — always fully visible
 *   - No "Dismiss" or "I understand" button
 */

// =============================================================================
// PAGE SPECS
// =============================================================================

// -----------------------------------------------------------------------------
// LandingPage
// -----------------------------------------------------------------------------
/**
 * Layout (single scroll, mobile-first):
 *
 *   [Nav]  logo + "How it works" anchor
 *
 *   [Hero]
 *     H1: "Find out if you're truly protected."
 *     Subtext: "Get your Insurance Score in under 3 minutes —
 *               no agent, no sales pitch."
 *     CTA: [Get my score →]   (filled teal, large)
 *     Trust badges: "Educational only · No personal data stored · Free"
 *
 *   [How it works]  3-step horizontal (Answer 5 questions → Get your score → Know your gaps)
 *
 *   [Social proof placeholder]  "Built for Singaporeans who want clarity, not another sales call."
 *
 *   [Secondary CTA]  "Check your score — it takes 3 minutes"
 *
 *   [Footer]  Disclaimer + "Not affiliated with any insurer"
 */

// -----------------------------------------------------------------------------
// InputPage
// -----------------------------------------------------------------------------
/**
 * Layout:
 *   - ProgressBar (top, sticky on scroll)
 *   - One question visible at a time (step-by-step, not all at once)
 *   - Each question has: label, input, optional hint, Next button
 *   - "Back" chevron top-left (except step 1)
 *   - Keyboard-aware: input scrolls into view on focus (mobile)
 *   - "Your data stays on your device" reassurance below progress bar
 *
 * Step flow:
 *   1. Age + Income (Q1)
 *   2. Hospitalisation (Q2) — 3-option selector
 *   3. CI coverage (Q3) — yes/no/unsure → if yes: ExactAmountInput + ECIQuestion
 *   4. Life/TPD (Q4) — yes/no/unsure → if yes: ExactAmountInput
 *   5. Monthly premium (Q5) — optional, "Skip" link
 *   6. Primary concern (Q6) — optional, "Skip" link
 *
 * Conditional rendering:
 *   - Q3 exact/band only shown if Q3 = 'yes'
 *   - Q3c (ECI) only shown after Q3a resolved
 *   - Q4 exact/band only shown if Q4 = 'yes'
 *   - Steps with both yes/no and amount merged into single view (not 2 steps)
 */

// -----------------------------------------------------------------------------
// ResultsPage
// -----------------------------------------------------------------------------
/**
 * Layout (single scroll):
 *   [ScoreCircle]          centred, 220px, with band label
 *   [InsightCards]         staggered fade-in, up to 4
 *   [CoverageBreakdown]    5 pillar rows
 *   [CTARow]               advisor + recheck + share
 *   [Disclaimer]           always visible
 *
 * Scroll behaviour:
 *   - ScoreCircle visible on first paint (no scroll needed)
 *   - Cards below fold — intentional, encourages reading score first
 *   - No pagination or tabs — single continuous scroll
 *
 * Re-check flow:
 *   - "Update my score" → saves current inputs to localStorage
 *   - Navigates to InputPage with all fields pre-filled
 *   - Changed fields highlighted with subtle amber border
 *   - On re-submit: results page shows score delta
 *     "+8 pts since last check" below score circle
 */

// =============================================================================
// FILE STRUCTURE
// =============================================================================

/**
 * src/
 * ├── engine/
 * │   ├── scorer.js          ← scoring engine (pure functions)
 * │   └── scorer.test.js     ← unit tests
 * ├── components/
 * │   ├── ProgressBar.jsx
 * │   ├── ExactAmountInput.jsx
 * │   ├── BandSelector.jsx
 * │   ├── ECITooltip.jsx
 * │   ├── ScoreCircle.jsx
 * │   ├── InsightCard.jsx
 * │   ├── PillarRow.jsx
 * │   ├── CoverageBreakdown.jsx
 * │   ├── LoadingScreen.jsx
 * │   ├── CTARow.jsx
 * │   └── Disclaimer.jsx
 * ├── hooks/
 * │   ├── useScoreAnimation.js   ← rAF counter logic
 *  │   └── usePersistInputs.js    ← localStorage save/restore
 * ├── pages/ (or app/ for Next.js App Router)
 * │   ├── index.jsx              ← LandingPage
 * │   ├── check.jsx              ← InputPage
 * │   ├── loading.jsx            ← LoadingScreen
 * │   └── results.jsx            ← ResultsPage
 * ├── styles/
 * │   └── tokens.css
 * └── context/
 *     └── AppContext.jsx         ← useReducer + localStorage
 */
