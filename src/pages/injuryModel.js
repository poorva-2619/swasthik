/* =========================================================
   injuryModel.js – Electric Shock & Burns symptom engine
   ========================================================= */

/* ── 1. Symptoms list ──────────────────────────────────── */
export const SYMPTOMS = [
  'Contact with electrical current',
  'Burning sensation on the skin',
  'Formation of blisters',
  'Pain in the affected area',
  'Loss of consciousness',
  'Difficulties in breathing',
  'Redness or skin discoloration'
]

/* ── 2. Training dataset ───────────────────────────────── */
export const X = [
  [1, 0, 0, 1, 0, 0, 0], // Index 0: Mild Electric Shock
  [1, 1, 1, 1, 1, 1, 0], // Index 1: Severe Electric Shock
  [0, 1, 0, 1, 0, 0, 1], // Index 2: Minor Burn
  [0, 1, 1, 1, 0, 0, 1], // Index 3: Moderate Burn
  [0, 0, 0, 0, 0, 0, 0], // Index 4: No Major Issue
  [0, 0, 0, 0, 0, 0, 0], // Index 5: No Major Issue
  [1, 1, 1, 1, 1, 1, 1], // Index 6: Severe Burn (with shock)
  [0, 1, 1, 1, 0, 0, 1], // Index 7: Severe Burn
  [0, 0, 0, 0, 0, 0, 0], // Index 8: Mild Issue
  [0, 0, 0, 0, 0, 0, 0], // Index 9: Mild Issue
]

export const y = [
  'Mild Electric Shock',
  'Severe Electric Shock',
  'Minor Burn',
  'Moderate Burn',
  'No Major Issue',
  'No Major Issue',
  'Severe Burn',
  'Severe Burn',
  'Mild Issue',
  'Mild Issue'
]

/* ── 3. Dataset Metadata (Remedies, Warnings, CPR) ─────── */
export const DATA_META = {
  'Mild Electric Shock': {
    severity: 'moderate',
    severityLabel: '⚠️ Moderate',
    remedies: [
      "Turn off power source BEFORE touching person",
      "Check for injuries",
      "Let person rest",
      "Consult doctor if symptoms persist"
    ]
  },
  'Severe Electric Shock': {
    severity: 'critical',
    severityLabel: '🆘 Extremely Critical',
    remedies: [
      "DO NOT touch directly if still connected",
      "Turn off electricity immediately",
      "Check breathing and pulse",
      "Start CPR if needed",
      "Call emergency services immediately"
    ],
    criticalWarning: "Life-threatening condition! Immediate medical help required.",
    cprSteps: [
      "Check responsiveness",
      "Call for help",
      "Start chest compressions (100-120/min)",
      "Push hard and fast in center of chest"
    ]
  },
  'Minor Burn': {
    severity: 'mild',
    severityLabel: '✓ Mild',
    remedies: [
      "Cool burn under running water (10-15 mins)",
      "Do NOT apply ice directly",
      "Apply burn cream (like Burnol)",
      "Cover with clean cloth"
    ]
  },
  'Moderate Burn': {
    severity: 'moderate',
    severityLabel: '⚠️ Moderate',
    remedies: [
      "Cool with water immediately",
      "Do NOT burst blisters",
      "Apply antiseptic/burn cream",
      "Seek medical help if needed"
    ]
  },
  'Severe Burn': {
    severity: 'critical',
    severityLabel: '🆘 Critical',
    remedies: [
      "EMERGENCY - Life threatening",
      "Do NOT remove stuck clothing",
      "Cover with clean cloth",
      "Do NOT apply creams/oil",
      "Go to hospital immediately"
    ],
    criticalWarning: "Life-threatening condition! Immediate medical help required."
  },
  'No Major Issue': {
    severity: 'mild',
    severityLabel: '✓ Mild',
    remedies: [
      "Monitor condition",
      "Basic care sufficient"
    ]
  },
  'Mild Issue': {
    severity: 'mild',
    severityLabel: '✓ Mild',
    remedies: [
      "Rest",
      "Observe symptoms"
    ]
  }
}

/* ── 4. Prediction function ────────────────────────────── */
function hammingDistance(a, b) {
  let dist = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) dist++
  }
  return dist
}

export function predictDisease(userInput) {
  let minDist = Infinity
  let possibleIndices = []

  X.forEach((row, i) => {
    const dist = hammingDistance(userInput, row)
    if (dist < minDist) {
      minDist = dist
      possibleIndices = [i]
    } else if (dist === minDist) {
      possibleIndices.push(i)
    }
  })

  // Prioritize critical results in case of ties
  const results = possibleIndices.map(idx => y[idx])
  const prioritized = results.includes('Severe Electric Shock') ? 'Severe Electric Shock' :
                      results.includes('Severe Burn') ? 'Severe Burn' :
                      results[0]

  const disease = prioritized
  const meta = DATA_META[disease]

  return {
    disease,
    remedies: meta.remedies || ["Consult a doctor if symptoms persist."],
    severity: meta.severity,
    severityLabel: meta.severityLabel,
    criticalWarning: meta.criticalWarning || null,
    cprSteps: meta.cprSteps || null
  }
}
