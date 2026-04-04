/* =========================================================
   lungsModel.js – Lungs symptom engine
   ========================================================= */

/* ── 1. Symptoms list ──────────────────────────────────── */
export const SYMPTOMS = [
  'Persistent cough',
  'Fever',
  'Shortness of breath',
  'Chest pain',
  'Cough with mucus or phlegm',
  'Cough for more than 2 weeks',
  'Unexplained weight loss',
  'History of smoking'
]

/* ── 2. Training dataset ───────────────────────────────── */
// Features: [cough, fever, short_breath, chest_pain, mucus, long_cough, weight_loss, smoking_history]
export const X = [
  [1, 0, 0, 0, 1, 0, 0, 0], // Index 0: Common Cold
  [1, 1, 1, 1, 1, 0, 0, 1], // Index 1: Bronchitis
  [1, 1, 1, 1, 1, 0, 0, 1], // Index 2: Pneumonia
  [1, 1, 1, 1, 1, 0, 0, 1], // Index 3: Pneumonia
  [1, 0, 1, 0, 1, 0, 0, 1], // Index 4: Asthma
  [1, 1, 1, 1, 1, 1, 1, 1], // Index 5: Possible TB
  [1, 1, 1, 1, 1, 1, 1, 1], // Index 6: Possible TB
  [0, 0, 0, 0, 0, 0, 0, 0], // Index 7: No Issue
  [1, 1, 1, 1, 1, 1, 1, 1], // Index 8: Severe Lung Infection
  [0, 0, 0, 0, 0, 0, 0, 0], // Index 9: Mild Issue
]

export const y = [
  'Common Cold',
  'Bronchitis',
  'Pneumonia',
  'Pneumonia',
  'Asthma',
  'Possible TB',
  'Possible TB',
  'No Issue',
  'Severe Lung Infection',
  'Mild Issue'
]

/* ── 3. Dataset Metadata (Remedies, Warnings) ──────────── */
export const DATA_META = {
  'Common Cold': {
    severity: 'mild',
    severityLabel: '✓ Mild',
    remedies: [
      "Rest and hydration",
      "Steam inhalation",
      "Paracetamol for fever",
      "Warm fluids"
    ]
  },
  'Bronchitis': {
    severity: 'moderate',
    severityLabel: '⚠️ Moderate',
    remedies: [
      "Avoid smoke/dust exposure",
      "Steam inhalation",
      "Use cough syrup",
      "Consult doctor if persists"
    ]
  },
  'Asthma': {
    severity: 'serious',
    severityLabel: '🆘 Serious',
    remedies: [
      "Use inhaler (as prescribed)",
      "Avoid triggers (dust, smoke)",
      "Practice breathing exercises",
      "Keep emergency inhaler ready"
    ],
    managementLabel: "MANAGEMENT"
  },
  'Pneumonia': {
    severity: 'serious',
    severityLabel: '🆘 Serious',
    remedies: [
      "Needs medical attention",
      "Take prescribed antibiotics",
      "Rest and fluids",
      "Monitor breathing"
    ],
    criticalWarning: "Serious lung condition — do not ignore"
  },
  'Possible TB': {
    severity: 'critical',
    severityLabel: '🆘 Critical',
    remedies: [
      "URGENT: Get TB test (sputum/X-ray)",
      "Avoid close contact with others",
      "Proper medication required (long-term)",
      "Government hospitals provide free TB treatment"
    ],
    criticalWarning: "Chronic cough + weight loss → TB suspicion. Early testing is very important."
  },
  'Severe Lung Infection': {
    severity: 'critical',
    severityLabel: '🆘 EMERGENCY',
    remedies: [
      "Hospital visit immediately",
      "Oxygen support may be needed",
      "Monitor vital signs"
    ],
    criticalWarning: "Serious lung condition — do not ignore"
  },
  'No Issue': {
    severity: 'mild',
    severityLabel: '✓ Healthy',
    remedies: [
      "Healthy condition",
      "Maintain hygiene"
    ]
  },
  'Mild Issue': {
    severity: 'mild',
    severityLabel: '✓ Mild',
    remedies: [
      "Basic care",
      "Monitor symptoms"
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
  const prioritized = results.includes('Severe Lung Infection') ? 'Severe Lung Infection' :
                      results.includes('Possible TB') ? 'Possible TB' :
                      results.includes('Pneumonia') ? 'Pneumonia' :
                      results[0]

  const disease = prioritized
  const meta = DATA_META[disease]

  return { 
    disease, 
    remedies: meta.remedies || ["Consult a doctor for accurate diagnosis."], 
    severity: meta.severity, 
    severityLabel: meta.severityLabel,
    criticalWarning: meta.criticalWarning || null,
    managementLabel: meta.managementLabel || null
  }
}
