/**
 * Insurance Gap Analyzer — Scoring Engine
 * Pure functions. No side effects. No framework dependencies.
 * All monetary values in SGD. Income = annual.
 */

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

export const BENCHMARKS = {
  CI_ADEQUATE_MULTIPLE: 4,      // 4× annual income
  CI_PARTIAL_MULTIPLE: 2,       // 2× annual income
  LIFE_ADEQUATE_MULTIPLE: 9,    // 9× annual income
  LIFE_PARTIAL_MULTIPLE: 5,     // 5× annual income
  ECI_STRONG_THRESHOLD: 100000, // $100k
  ECI_SOME_THRESHOLD: 50000,    // $50k
  PREMIUM_SAFE_RATIO: 0.10,     // 10% of annual income
  PREMIUM_HIGH_RATIO: 0.15,     // 15% = overpay warning
};

export const BAND_MIDPOINTS = {
  // CI bands expressed as income multiples
  CI_LOW: 1.0,     // "less than 2×" → assume 1×
  CI_PARTIAL: 3.0, // "2–4×" → assume 3×
  CI_HIGH: 5.0,    // "more than 4×" → assume 5×
  // Life bands expressed as income multiples
  LIFE_LOW: 3.0,   // "less than 5×" → assume 3×
  LIFE_PARTIAL: 7.0, // "5–9×" → assume 7×
  LIFE_HIGH: 11.0, // "more than 9×" → assume 11×
  // ECI bands in absolute SGD
  ECI_LOW: 25000,   // "less than $50k" → assume $25k
  ECI_MID: 75000,   // "$50–100k" → assume $75k
  ECI_HIGH: 125000, // "more than $100k" → assume $125k
};

export const WEIGHTS = {
  CI: 0.40,
  LIFE: 0.30,
  PREMIUM: 0.20,
  // Hospitalisation is a gate, not a weight
  // ECI is a sub-component boost within CI, not a separate weight
};

export const SCORE_BANDS = [
  { min: 0,  max: 39,  label: 'At risk',          color: 'red' },
  { min: 40, max: 59,  label: 'Partially covered', color: 'amber' },
  { min: 60, max: 79,  label: 'Mostly covered',    color: 'blue' },
  { min: 80, max: 100, label: 'Well protected',     color: 'teal' },
];

// ---------------------------------------------------------------------------
// INPUT TYPES
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} UserInputs
 * @property {number}  age
 * @property {number}  annualIncome          — exact SGD
 * @property {'yes'|'no'|'unsure'} hasHosp
 * @property {'yes'|'no'|'unsure'} hasCI
 * @property {number|null}  ciAmount         — exact SGD, null if unknown
 * @property {'low'|'partial'|'high'|null} ciBand — fallback if ciAmount null
 * @property {'yes'|'no'|'unsure'} hasECI
 * @property {number|null}  eciAmount        — exact SGD, null if unknown
 * @property {'none'|'low'|'mid'|'high'|null} eciBand — fallback
 * @property {'yes'|'no'|'unsure'} hasLife
 * @property {number|null}  lifeAmount       — exact SGD, null if unknown
 * @property {'low'|'partial'|'high'|null} lifeBand — fallback
 * @property {number|null}  monthlyPremium   — SGD, null if skipped
 * @property {'overpaying'|'undercovered'|'unsure'|'curious'|null} primaryConcern
 */

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/**
 * Resolve actual coverage amount from exact input or band fallback.
 * Returns { amount, isEstimated }
 */
function resolveAmount(exact, band, bandMap) {
  if (exact !== null && exact !== undefined && !isNaN(exact) && exact >= 0) {
    return { amount: exact, isEstimated: false };
  }
  if (band && bandMap[band] !== undefined) {
    return { amount: bandMap[band], isEstimated: true };
  }
  return { amount: 0, isEstimated: true };
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function roundScore(value) {
  return Math.round(clamp(value));
}

// ---------------------------------------------------------------------------
// PILLAR SCORERS
// ---------------------------------------------------------------------------

/**
 * Hospitalisation — binary gate.
 * Returns { score: 0|50|100, passed: bool, isUnsure: bool }
 */
export function scoreHospitalisation(hasHosp) {
  if (hasHosp === 'yes')    return { score: 100, passed: true,  isUnsure: false };
  if (hasHosp === 'unsure') return { score: 25,  passed: false, isUnsure: true  };
  return                           { score: 0,   passed: false, isUnsure: false };
}

/**
 * Critical illness base score (0–100).
 * Uses continuous ratio formula when exact amount known.
 */
export function scoreCIBase(hasCI, ciAmount, ciBand, annualIncome) {
  if (hasCI === 'no' || hasCI === 'unsure') {
    return { score: 0, amount: 0, isEstimated: true, multiple: 0 };
  }

  const ciBandMap = {
    low:     BAND_MIDPOINTS.CI_LOW     * annualIncome,
    partial: BAND_MIDPOINTS.CI_PARTIAL * annualIncome,
    high:    BAND_MIDPOINTS.CI_HIGH    * annualIncome,
  };

  const { amount, isEstimated } = resolveAmount(ciAmount, ciBand, ciBandMap);
  const multiple = annualIncome > 0 ? amount / annualIncome : 0;
  const score = roundScore(
    Math.min(amount / (BENCHMARKS.CI_ADEQUATE_MULTIPLE * annualIncome), 1.0) * 100
  );

  return { score, amount, isEstimated, multiple };
}

/**
 * ECI boost (0–20 points added to CI base).
 */
export function scoreECIBoost(hasECI, eciAmount, eciBand) {
  if (hasECI === 'no') return { boost: 0, amount: 0, isEstimated: false };
  if (hasECI === 'unsure') return { boost: 0, amount: 0, isEstimated: true };

  const eciBandMap = {
    none: 0,
    low:  BAND_MIDPOINTS.ECI_LOW,
    mid:  BAND_MIDPOINTS.ECI_MID,
    high: BAND_MIDPOINTS.ECI_HIGH,
  };

  const { amount, isEstimated } = resolveAmount(eciAmount, eciBand, eciBandMap);

  let boost = 0;
  if (amount >= BENCHMARKS.ECI_STRONG_THRESHOLD) boost = 20;
  else if (amount >= BENCHMARKS.ECI_SOME_THRESHOLD) boost = 10;
  else if (amount > 0) boost = 5; // has some ECI, below $50k

  return { boost, amount, isEstimated };
}

/**
 * Combined resilience score = min(CI base + ECI boost, 100)
 */
export function scoreResilience(hasCI, ciAmount, ciBand, hasECI, eciAmount, eciBand, annualIncome) {
  const ci  = scoreCIBase(hasCI, ciAmount, ciBand, annualIncome);
  const eci = scoreECIBoost(hasECI, eciAmount, eciBand);
  const combined = roundScore(Math.min(ci.score + eci.boost, 100));

  return {
    score: combined,
    ci,
    eci,
    isEstimated: ci.isEstimated || eci.isEstimated,
  };
}

/**
 * Life / TPD score (0–100).
 */
export function scoreLife(hasLife, lifeAmount, lifeBand, annualIncome) {
  if (hasLife === 'no' || hasLife === 'unsure') {
    return { score: 0, amount: 0, isEstimated: true, multiple: 0 };
  }

  const lifeBandMap = {
    low:     BAND_MIDPOINTS.LIFE_LOW     * annualIncome,
    partial: BAND_MIDPOINTS.LIFE_PARTIAL * annualIncome,
    high:    BAND_MIDPOINTS.LIFE_HIGH    * annualIncome,
  };

  const { amount, isEstimated } = resolveAmount(lifeAmount, lifeBand, lifeBandMap);
  const multiple = annualIncome > 0 ? amount / annualIncome : 0;
  const score = roundScore(
    Math.min(amount / (BENCHMARKS.LIFE_ADEQUATE_MULTIPLE * annualIncome), 1.0) * 100
  );

  return { score, amount, isEstimated, multiple };
}

/**
 * Premium efficiency score (0–100).
 * Returns null if monthlyPremium not provided.
 */
export function scorePremium(monthlyPremium, annualIncome) {
  if (monthlyPremium === null || monthlyPremium === undefined) {
    return { score: null, annualPremium: null, ratio: null, isOverpaying: false };
  }

  const annualPremium = monthlyPremium * 12;
  const ratio = annualIncome > 0 ? annualPremium / annualIncome : 0;
  const score = roundScore(Math.max(0, (1 - ratio / BENCHMARKS.PREMIUM_HIGH_RATIO)) * 100);
  const isOverpaying = ratio > BENCHMARKS.PREMIUM_HIGH_RATIO;

  return { score, annualPremium, ratio, isOverpaying };
}

// ---------------------------------------------------------------------------
// FINAL SCORE AGGREGATOR
// ---------------------------------------------------------------------------

/**
 * Main scoring function. Returns the full score object.
 * @param {UserInputs} inputs
 * @returns {ScoreResult}
 */
export function calculateScore(inputs) {
  const {
    annualIncome,
    hasHosp,
    hasCI, ciAmount, ciBand,
    hasECI, eciAmount, eciBand,
    hasLife, lifeAmount, lifeBand,
    monthlyPremium,
  } = inputs;

  // --- Pillar scores ---
  const hosp       = scoreHospitalisation(hasHosp);
  const resilience = scoreResilience(hasCI, ciAmount, ciBand, hasECI, eciAmount, eciBand, annualIncome);
  const life       = scoreLife(hasLife, lifeAmount, lifeBand, annualIncome);
  const premium    = scorePremium(monthlyPremium, annualIncome);

  // --- Weighted base score ---
  const premiumWeight = premium.score !== null ? WEIGHTS.PREMIUM : 0;
  const ciWeight      = WEIGHTS.CI;
  const lifeWeight    = WEIGHTS.LIFE;

  // Redistribute premium weight if skipped
  const totalWeight = ciWeight + lifeWeight + premiumWeight;
  const premiumScore = premium.score ?? 0;

  let weightedScore =
    (resilience.score * ciWeight +
     life.score       * lifeWeight +
     premiumScore     * premiumWeight) / totalWeight * 100 / 100;

  // --- Hospitalisation gate ---
  // If hosp failed or unsure, cap the weighted score at 50
  if (!hosp.passed) {
    weightedScore = Math.min(weightedScore, 50);
  }

  const finalScore = roundScore(weightedScore);

  // --- Band ---
  const band = SCORE_BANDS.find(b => finalScore >= b.min && finalScore <= b.max)
    ?? SCORE_BANDS[0];

  // --- Estimated flag ---
  const isEstimated =
    resilience.isEstimated ||
    life.isEstimated ||
    (hasCI !== 'no' && ciAmount === null) ||
    (hasLife !== 'no' && lifeAmount === null);

  return {
    finalScore,
    band,
    isEstimated,
    pillars: { hosp, resilience, life, premium },
    inputs, // pass through for insight generation
  };
}

// ---------------------------------------------------------------------------
// INSIGHT GENERATOR
// ---------------------------------------------------------------------------

/**
 * Generates up to 4 prioritised insight cards from a score result.
 * @param {ScoreResult} result
 * @returns {InsightCard[]}
 */
export function generateInsights(result) {
  const { pillars, inputs, finalScore } = result;
  const { hosp, resilience, life, premium } = pillars;
  const { annualIncome, hasCI, hasECI, primaryConcern } = inputs;
  const cards = [];

  // --- P1: No hospitalisation ---
  if (!hosp.passed) {
    cards.push({
      id: 'no-hosp',
      priority: 1,
      severity: 'critical',
      title: hosp.isUnsure
        ? "You're not sure about your hospitalisation cover"
        : "You have no hospitalisation cover",
      body: hosp.isUnsure
        ? "You may already be covered under MediShield Life — all Singapore Citizens and PRs are enrolled automatically. What matters is whether you have an Integrated Shield Plan on top, which covers private or restructured hospital wards. Check your CPF statement or your insurer's app under 'Active Policies'."
        : "A single hospitalisation without insurance can cost $10,000–$50,000 or more out of pocket. This is your most urgent gap to close before anything else.",
      action: "Integrated Shield Plans start from around $200–400 a year for someone in their 20s or 30s — roughly the cost of one night in a B1 ward without cover. One conversation with a licensed adviser is all it takes to get this sorted.",
    });
  }

  // --- P2: CI coverage gap ---
  if (resilience.ci.score < 50) {
    const hasAnyCi = hasCI === 'yes';
    const targetAmount = formatSGD(BENCHMARKS.CI_ADEQUATE_MULTIPLE * annualIncome);
    const currentAmount = hasAnyCi && resilience.ci.amount > 0
      ? formatSGD(resilience.ci.amount)
      : null;
    const prefix = resilience.ci.isEstimated ? 'approximately ' : '';

    cards.push({
      id: 'ci-gap',
      priority: 2,
      severity: 'warning',
      title: hasAnyCi
        ? "Your critical illness cover may not be enough"
        : "You have no critical illness coverage",
      body: hasAnyCi
        ? `Your CI cover of ${prefix}${currentAmount} is below the recommended 4× your income (${targetAmount}). A serious diagnosis like cancer or a stroke can stop your income for months — your cover needs to bridge that gap, not just pay for the first week of treatment.`
        : `Without CI cover, a serious diagnosis means your savings take the full hit — lost income, treatment costs, and everything in between. The recommended cover is 4× your annual income (${targetAmount}).`,
      action: hasAnyCi
        ? "A CI top-up rider can often be added to your existing plan — usually cheaper than a new standalone policy. Ask an adviser to check if your current plan allows it."
        : "A standalone term CI plan is usually the most cost-efficient starting point. An adviser can compare options based on your age and health profile.",
    });
  }

  // --- P3: ECI gap (only if CI exists) ---
  if (hasCI === 'yes' && hasECI === 'no') {
    cards.push({
      id: 'eci-gap',
      priority: 3,
      severity: 'info',
      title: "Your CI only covers late-stage illness",
      body: "Standard CI policies pay out at late-stage diagnosis — confirmed heart failure, late-stage cancer, and so on. Early Critical Illness (ECI) cover pays out earlier, at a minor heart attack, early-stage cancer, or initial stroke, when treatment is most intensive and costs are at their highest.",
      action: "ECI isn't usually a separate policy — it's a rider you can add to your existing CI plan. It takes one conversation with your adviser to check if yours allows it, and what it would cost.",
    });
  }

  // --- P4a: Life/TPD gap ---
  if (life.score < 50 && cards.length < 4) {
    const targetAmount = formatSGD(BENCHMARKS.LIFE_ADEQUATE_MULTIPLE * annualIncome);
    const currentAmount = life.amount > 0 ? formatSGD(life.amount) : null;
    const prefix = life.isEstimated ? 'approximately ' : '';

    cards.push({
      id: 'life-gap',
      priority: 4,
      severity: life.score === 0 ? 'warning' : 'info',
      title: life.score === 0
        ? "You have no life or TPD coverage"
        : "Your life and TPD coverage has room to grow",
      body: life.score === 0
        ? `Life and TPD cover protects the people who depend on your income. Without it, a permanent disability or death leaves them financially exposed. The recommended starting point is 9× your annual income (${targetAmount}).`
        : `Your life and TPD cover of ${prefix}${currentAmount} covers ${life.multiple.toFixed(1)}× your income. The benchmark is 9× (${targetAmount}). Term life insurance is usually the most cost-efficient way to close the gap.`,
      action: "Term life insurance is the most straightforward and affordable way to get meaningful life and TPD cover. Premiums are significantly lower the younger and healthier you are when you start.",
    });
  }

  // --- P4b: Premium overpay ---
  if (premium.isOverpaying && cards.length < 4) {
    const pct = (premium.ratio * 100).toFixed(1);
    cards.push({
      id: 'premium-overpay',
      priority: 4,
      severity: 'info',
      title: "Your premiums may be higher than needed",
      body: `You're spending ${pct}% of your annual income on insurance premiums. The general guideline is under 10–15%. This could mean you're holding expensive whole-life or investment-linked policies where a term equivalent would give you the same cover for less — freeing up cash for other financial goals.`,
      action: "A policy review can identify where you're paying for coverage you don't need, or where a cheaper structure gives you the same protection. This is worth doing before your next renewal.",
    });
  }

  // --- P4c: Band input nudge ---
  if (result.isEstimated && cards.length < 4) {
    cards.push({
      id: 'band-nudge',
      priority: 5,
      severity: 'nudge',
      title: "Your score is an estimate",
      body: "You used approximate ranges for some of your coverage amounts. Your actual score may be higher or lower. Check your policy documents or your insurer's app for your exact sum assured — it's usually listed under 'Policy Details' or 'Coverage Summary'.",
      action: "Return and update your score with exact figures. It takes under a minute and gives you a more accurate picture.",
    });
  }

  // Personalise card order by primaryConcern
  if (primaryConcern === 'overpaying') {
    const overpayIdx = cards.findIndex(c => c.id === 'premium-overpay');
    if (overpayIdx > 0) {
      const [card] = cards.splice(overpayIdx, 1);
      cards.unshift(card);
    }
  }

  return cards.slice(0, 4);
}

// ---------------------------------------------------------------------------
// UTILITIES
// ---------------------------------------------------------------------------

export function formatSGD(amount) {
  if (!amount && amount !== 0) return '—';
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getBandColor(color) {
  const map = {
    red:   { bg: '#FCEBEB', text: '#A32D2D', bar: '#E24B4A' },
    amber: { bg: '#FAEEDA', text: '#854F0B', bar: '#EF9F27' },
    blue:  { bg: '#E6F1FB', text: '#185FA5', bar: '#378ADD' },
    teal:  { bg: '#E1F5EE', text: '#0F6E56', bar: '#1D9E75' },
  };
  return map[color] ?? map.red;
}

export function getSeverityStyle(severity) {
  const map = {
    critical: { icon: '✕', color: '#E24B4A', bg: '#FCEBEB' },
    warning:  { icon: '!', color: '#EF9F27', bg: '#FAEEDA' },
    info:     { icon: 'i', color: '#378ADD', bg: '#E6F1FB' },
    nudge:    { icon: '↑', color: '#1D9E75', bg: '#E1F5EE' },
  };
  return map[severity] ?? map.info;
}
