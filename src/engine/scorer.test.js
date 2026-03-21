/**
 * Scoring Engine Tests
 * Run with: node scorer.test.js
 * No framework. Just assertions.
 */

import {
  calculateScore,
  generateInsights,
  scoreHospitalisation,
  scoreCIBase,
  scoreECIBoost,
  scoreResilience,
  scoreLife,
  scorePremium,
} from './scorer.js';

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    failed++;
  }
}

function assertEqual(label, actual, expected) {
  const ok = actual === expected;
  if (ok) {
    console.log(`  ✓ ${label}: ${actual}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}: expected ${expected}, got ${actual}`);
    failed++;
  }
}

// ---------------------------------------------------------------------------
console.log('\n[Hospitalisation gate]');
// ---------------------------------------------------------------------------
const h1 = scoreHospitalisation('yes');
assert('yes → passed', h1.passed === true);
assertEqual('yes → score 100', h1.score, 100);

const h2 = scoreHospitalisation('no');
assert('no → not passed', h2.passed === false);
assertEqual('no → score 0', h2.score, 0);

const h3 = scoreHospitalisation('unsure');
assert('unsure → not passed', h3.passed === false);
assertEqual('unsure → score 25', h3.score, 25);
assert('unsure → isUnsure flag', h3.isUnsure === true);

// ---------------------------------------------------------------------------
console.log('\n[CI base score]');
// ---------------------------------------------------------------------------
const income = 60000;

const ci1 = scoreCIBase('yes', 240000, null, income); // 4× = adequate
assertEqual('4× income → 100', ci1.score, 100);
assert('exact → not estimated', ci1.isEstimated === false);

const ci2 = scoreCIBase('yes', 120000, null, income); // 2× = partial → 50
assertEqual('2× income → 50', ci2.score, 50);

const ci3 = scoreCIBase('yes', 180000, null, income); // 3× → 75
assertEqual('3× income → 75', ci3.score, 75);

const ci4 = scoreCIBase('no', null, null, income);
assertEqual('no CI → 0', ci4.score, 0);

const ci5 = scoreCIBase('yes', null, 'partial', income); // band fallback
assertEqual('band partial (3×) → 75', ci5.score, 75);
assert('band → estimated', ci5.isEstimated === true);

const ci6 = scoreCIBase('yes', 300000, null, income); // above 4× → capped
assertEqual('above 4× → capped at 100', ci6.score, 100);

// ---------------------------------------------------------------------------
console.log('\n[ECI boost]');
// ---------------------------------------------------------------------------
const e1 = scoreECIBoost('no', null, null);
assertEqual('no ECI → 0 boost', e1.boost, 0);

const e2 = scoreECIBoost('yes', 100000, null);
assertEqual('$100k ECI → 20 boost', e2.boost, 20);

const e3 = scoreECIBoost('yes', 150000, null);
assertEqual('>$100k → still 20 (ceiling)', e3.boost, 20);

const e4 = scoreECIBoost('yes', 75000, null);
assertEqual('$75k → 10 boost', e4.boost, 10);

const e5 = scoreECIBoost('yes', 30000, null);
assertEqual('$30k (below $50k) → 5 boost', e5.boost, 5);

const e6 = scoreECIBoost('yes', null, 'mid'); // band $75k
assertEqual('band mid ($75k) → 10 boost', e6.boost, 10);

// ---------------------------------------------------------------------------
console.log('\n[Resilience combined]');
// ---------------------------------------------------------------------------
const r1 = scoreResilience('yes', 240000, null, 'yes', 100000, null, income);
assertEqual('CI 100 + ECI 20 → capped at 100', r1.score, 100);

const r2 = scoreResilience('yes', 120000, null, 'no', null, null, income);
assertEqual('CI 50 + no ECI → 50', r2.score, 50);

const r3 = scoreResilience('yes', 120000, null, 'yes', 75000, null, income);
assertEqual('CI 50 + ECI 10 → 60', r3.score, 60);

// ---------------------------------------------------------------------------
console.log('\n[Life / TPD score]');
// ---------------------------------------------------------------------------
const l1 = scoreLife('yes', 540000, null, income); // 9× = adequate
assertEqual('9× income → 100', l1.score, 100);

const l2 = scoreLife('yes', 300000, null, income); // 5×
assertEqual('5× income → 56', l2.score, 56);

const l3 = scoreLife('no', null, null, income);
assertEqual('no life → 0', l3.score, 0);

const l4 = scoreLife('yes', null, 'partial', income); // band 7× = $420k
assertEqual('band partial (7×) → 78', l4.score, 78);

// ---------------------------------------------------------------------------
console.log('\n[Premium efficiency]');
// ---------------------------------------------------------------------------
const p1 = scorePremium(500, 60000); // $6k/yr on $60k = 10%
assertEqual('10% ratio → 33', p1.score, 33);
assert('10% → not overpaying', p1.isOverpaying === false);

const p2 = scorePremium(800, 60000); // $9.6k/yr = 16% → overpay
assert('16% ratio → overpaying', p2.isOverpaying === true);
assertEqual('16% ratio → score 0', p2.score, 0);

const p3 = scorePremium(null, 60000);
assert('null premium → score null', p3.score === null);

// ---------------------------------------------------------------------------
console.log('\n[Final score — full scenarios]');
// ---------------------------------------------------------------------------

// Scenario A: Well-covered user
const scoreA = calculateScore({
  age: 30, annualIncome: 60000,
  hasHosp: 'yes',
  hasCI: 'yes', ciAmount: 240000, ciBand: null,
  hasECI: 'yes', eciAmount: 100000, eciBand: null,
  hasLife: 'yes', lifeAmount: 540000, lifeBand: null,
  monthlyPremium: 400,
  primaryConcern: null,
});
assert('Well-covered → band teal or blue', ['teal', 'blue'].includes(scoreA.band.color));
assert('Well-covered → score ≥ 70', scoreA.finalScore >= 70);
assert('Well-covered → not estimated', scoreA.isEstimated === false);

// Scenario B: No hospitalisation — score capped at 50
const scoreB = calculateScore({
  age: 25, annualIncome: 48000,
  hasHosp: 'no',
  hasCI: 'yes', ciAmount: 200000, ciBand: null,
  hasECI: 'no', eciAmount: null, eciBand: null,
  hasLife: 'yes', lifeAmount: 450000, lifeBand: null,
  monthlyPremium: 300,
  primaryConcern: null,
});
assert('No hosp → score ≤ 50', scoreB.finalScore <= 50);

// Scenario C: All unknown → band inputs
const scoreC = calculateScore({
  age: 28, annualIncome: 55000,
  hasHosp: 'yes',
  hasCI: 'yes', ciAmount: null, ciBand: 'low',
  hasECI: 'yes', eciAmount: null, eciBand: 'low',
  hasLife: 'yes', lifeAmount: null, lifeBand: 'low',
  monthlyPremium: null,
  primaryConcern: null,
});
assert('All band inputs → isEstimated true', scoreC.isEstimated === true);

// Scenario D: Bare minimum (no CI, no life, no ECI)
const scoreD = calculateScore({
  age: 22, annualIncome: 36000,
  hasHosp: 'yes',
  hasCI: 'no', ciAmount: null, ciBand: null,
  hasECI: 'no', eciAmount: null, eciBand: null,
  hasLife: 'no', lifeAmount: null, lifeBand: null,
  monthlyPremium: 100,
  primaryConcern: 'undercovered',
});
assert('Bare minimum → band red or amber', ['red', 'amber'].includes(scoreD.band.color));
assert('Bare minimum → score ≤ 40', scoreD.finalScore <= 40);

// ---------------------------------------------------------------------------
console.log('\n[Insight generation]');
// ---------------------------------------------------------------------------
const insightsB = generateInsights(scoreB);
assert('No hosp → first card is no-hosp', insightsB[0]?.id === 'no-hosp');

const insightsD = generateInsights(scoreD);
const hasCI_gap = insightsD.some(c => c.id === 'ci-gap');
assert('No CI → ci-gap card present', hasCI_gap);
const hasECIcard = insightsD.some(c => c.id === 'eci-gap');
assert('No CI → eci-gap NOT shown (folded into ci-gap)', !hasECIcard);

const insightsECI = generateInsights({
  ...scoreA,
  inputs: { ...scoreA.inputs, hasECI: 'no' },
  pillars: {
    ...scoreA.pillars,
    resilience: { ...scoreA.pillars.resilience, eci: { boost: 0, amount: 0 } },
  },
});
const eciCard = insightsECI.find(c => c.id === 'eci-gap');
assert('Has CI but no ECI → eci-gap card shown', !!eciCard);

// Overpaying concern → premium card floated first
const scorePremiumUser = calculateScore({
  age: 35, annualIncome: 60000,
  hasHosp: 'yes',
  hasCI: 'yes', ciAmount: 240000, ciBand: null,
  hasECI: 'no', eciAmount: null, eciBand: null,
  hasLife: 'yes', lifeAmount: 540000, lifeBand: null,
  monthlyPremium: 900,
  primaryConcern: 'overpaying',
});
const insightsPremium = generateInsights(scorePremiumUser);
assert('Overpaying concern → premium card first', insightsPremium[0]?.id === 'premium-overpay');

// ---------------------------------------------------------------------------
console.log(`\n${'─'.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
