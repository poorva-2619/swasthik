/* =========================================================
   mensModel.js – Menstruation symptom engine (JS port)
   Replaces Python's DecisionTreeClassifier with a nearest-
   neighbour classifier based on Hamming distance, identical
   to the approach used in headModel.js.
   ========================================================= */

/* ── 1. Symptoms list ──────────────────────────────────── */
// Each entry has a `key` (feature name) and a `question`
// (the user-facing phrasing shown on each quiz slide).
export const SYMPTOMS = [
  { key: 'lower_abdominal_pain', question: 'Do you have lower abdominal cramps?' },
  { key: 'back_pain',            question: 'Do you have lower back pain?' },
  { key: 'heavy_bleeding',       question: 'Are you experiencing heavy bleeding (changing pad every 1–2 hrs)?' },
  { key: 'irregular_cycle',      question: 'Are your periods irregular (cycle not consistent)?' },
  { key: 'mood_swings',          question: 'Are you experiencing mood swings or irritability?' },
  { key: 'bloating',             question: 'Do you feel bloated?' },
  { key: 'fatigue',              question: 'Are you feeling very tired or fatigued?' },
  { key: 'acne',                 question: 'Do you have frequent acne breakouts?' },
]

/* ── 2. Training dataset ───────────────────────────────── */
// Each row is a binary symptom vector aligned to SYMPTOMS.
// Directly mirrors the Python DataFrame in mens_model.py.
export const X = [
  //  pain  back  heavy  irreg  mood  bloat  fatig  acne
  [    1,    1,     0,     0,     1,    1,     1,     0  ],  // Normal Menstrual Pain
  [    1,    1,     1,     0,     1,    1,     1,     0  ],  // Heavy Periods
  [    0,    0,     0,     1,     1,    1,     0,     1  ],  // PMS
  [    0,    0,     1,     1,     0,    0,     1,     1  ],  // Irregular Periods
  [    1,    1,     1,     1,     1,    1,     1,     1  ],  // Possible PCOS
  [    0,    0,     0,     1,     1,    1,     1,     1  ],  // PMS
  [    1,    1,     0,     1,     0,    0,     0,     1  ],  // Possible PCOS
  [    0,    0,     1,     1,     1,    1,     1,     1  ],  // Irregular Periods
  [    1,    1,     0,     0,     1,    1,     1,     0  ],  // Normal Menstrual Pain
  [    0,    0,     0,     0,     0,    0,     0,     0  ],  // Mild Discomfort
]

export const y = [
  'Normal Menstrual Pain',
  'Heavy Periods',
  'PMS',
  'Irregular Periods',
  'Possible PCOS',
  'PMS',
  'Possible PCOS',
  'Irregular Periods',
  'Normal Menstrual Pain',
  'Mild Discomfort',
]

/* ── 3. Remedies ───────────────────────────────────────── */
export const REMEDIES = {
  'Normal Menstrual Pain': [
    'Use a heating pad on your abdomen',
    'Take mefenamic acid (after consulting if needed)',
    'Light exercise or walking helps',
    'Stay hydrated',
  ],
  'Heavy Periods': [
    'Increase iron-rich foods (spinach, jaggery)',
    'Stay hydrated',
    'Consult a doctor if bleeding persists',
    'Track your bleeding pattern',
  ],
  'PMS': [
    'Reduce caffeine & junk food',
    'Sleep properly',
    'Light exercise (yoga / walking)',
    'Magnesium-rich foods help (nuts, seeds)',
  ],
  'Irregular Periods': [
    'Maintain a healthy weight',
    'Follow a regular sleep cycle',
    'Avoid stress',
    'Track your cycles (very important)',
  ],
  'Possible PCOS': [
    'Consult a gynecologist',
    'Maintain weight & regular exercise',
    'Reduce sugar intake',
    'A hormonal checkup may be needed',
  ],
  'Mild Discomfort': [
    'Rest well',
    'Stay hydrated',
    'Basic self-care is usually enough',
  ],
}

/* ── 4. Warnings (shown on result page) ────────────────── */
export const WARNINGS = {
  'Heavy Periods':
    '⚠ If bleeding is very heavy or causing weakness, consult a doctor immediately.',
  'Possible PCOS':
    '⚠ This is not a clinical diagnosis. Proper medical tests are required.',
}

/* ── 5. Prediction function ────────────────────────────── */
/**
 * Hamming distance between two equal-length binary arrays.
 */
function hammingDistance(a, b) {
  let dist = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) dist++
  }
  return dist
}

/**
 * Predicts the most likely menstrual condition given the user's
 * symptom vector.  Uses 1-nearest-neighbour (min Hamming distance).
 *
 * @param {number[]} userInput – binary array aligned to SYMPTOMS (length 8)
 * @returns {{ disease: string, remedies: string[], warning: string|null }}
 */
export function predictCondition(userInput) {
  let minDist = Infinity
  let bestIndex = 0

  X.forEach((row, i) => {
    const dist = hammingDistance(userInput, row)
    if (dist < minDist) {
      minDist = dist
      bestIndex = i
    }
  })

  const disease  = y[bestIndex]
  const remedies = REMEDIES[disease] ?? ['Please consult a doctor if symptoms worsen.']
  const warning  = WARNINGS[disease] ?? null

  return { disease, remedies, warning }
}
