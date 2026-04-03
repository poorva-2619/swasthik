/* =========================================================
   commonModel.js – Common Diseases symptom engine
   ========================================================= */

/* ── 1. Symptoms list ──────────────────────────────────── */
export const SYMPTOMS = [
  'Fever',
  'Cough',
  'Fatigue',
  'Vomiting',
  'Headache',
  'Body Pain',
  'Diarrhea',
  'Weight Loss'
]

/* ── 2. Training dataset ───────────────────────────────── */
// Features: [fever, cough, fatigue, vomiting, headache, body_pain, diarrhea, weight_loss]
export const X = [
  [1, 1, 1, 0, 1, 1, 0, 0], // Index 0: Flu
  [1, 0, 1, 1, 1, 1, 1, 0], // Index 1: Food Poisoning
  [0, 0, 1, 0, 1, 0, 0, 1], // Index 2: Anemia
  [0, 0, 0, 1, 0, 0, 1, 0], // Index 3: Acidity
  [1, 1, 1, 0, 1, 1, 0, 1], // Index 4: Tuberculosis
  [1, 0, 1, 1, 1, 1, 1, 0], // Index 5: Cholera
  [1, 0, 1, 1, 1, 1, 1, 0], // Index 6: Malaria
  [1, 0, 1, 0, 1, 1, 0, 1], // Index 7: Dengue
  [0, 0, 1, 0, 0, 0, 0, 1], // Index 8: Healthy
  [1, 0, 1, 1, 1, 1, 1, 0], // Index 9: Food Poisoning
  [1, 1, 1, 0, 1, 1, 0, 1], // Index 10: Tuberculosis
  [1, 0, 1, 1, 1, 1, 1, 0], // Index 11: Cholera
]

export const y = [
  'Flu',
  'Food Poisoning',
  'Anemia',
  'Acidity',
  'Tuberculosis',
  'Cholera',
  'Malaria',
  'Dengue',
  'Healthy',
  'Food Poisoning',
  'Tuberculosis',
  'Cholera'
]

/* ── 3. Dataset Metadata (Remedies, Warnings) ──────────── */
export const DATA_META = {
  'Flu': {
    severity: 'moderate',
    severityLabel: '⚠️ Moderate',
    remedies: [
      "Paracetamol (Crocin / Calpol)",
      "Steam inhalation",
      "Warm fluids",
      "Rest"
    ]
  },
  'Food Poisoning': {
    severity: 'moderate',
    severityLabel: '⚠️ Moderate',
    remedies: [
      "ORS (Electral)",
      "Domperidone",
      "Avoid outside food",
      "Stay hydrated"
    ]
  },
  'Anemia': {
    severity: 'moderate',
    severityLabel: '⚠️ Moderate',
    remedies: [
      "Iron tablets (Ferrous sulfate)",
      "Eat spinach, beetroot",
      "Vitamin B12 supplements",
      "Consult doctor for blood test"
    ]
  },
  'Tuberculosis': {
    severity: 'serious',
    severityLabel: '🆘 Serious',
    remedies: [
      "DO NOT self-medicate",
      "Consult doctor immediately",
      "DOTS therapy (government program)",
      "Complete full antibiotic course"
    ],
    criticalWarning: "Life-threatening if not treated! Seek medical attention immediately."
  },
  'Cholera': {
    severity: 'critical',
    severityLabel: '🆘 Critical',
    remedies: [
      "ORS solution",
      "Zinc supplements",
      "Drink boiled water",
      "Immediate medical help"
    ],
    criticalWarning: "Acute dehydration risk! Seek hospital care immediately."
  },
  'Malaria': {
    severity: 'serious',
    severityLabel: '⚠️ Serious',
    remedies: [
      "Antimalarial drugs (Artemisinin-based)",
      "Paracetamol for fever",
      "Mosquito protection",
      "Doctor consultation"
    ]
  },
  'Dengue': {
    severity: 'serious',
    severityLabel: '⚠️ Serious',
    remedies: [
      "Paracetamol ONLY (no ibuprofen)",
      "Papaya leaf extract (supportive)",
      "Platelet monitoring",
      "Hydration"
    ]
  },
  'Acidity': {
    severity: 'mild',
    severityLabel: '✓ Mild',
    remedies: [
      "Antacid (Digene / Gelusil)",
      "Avoid spicy food",
      "Small meals",
      "Cold milk"
    ]
  },
  'Healthy': {
    severity: 'mild',
    severityLabel: '✓ Mild',
    remedies: [
      "No major disease detected",
      "Maintain healthy lifestyle"
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

  // Prioritize serious results in case of ties
  const results = possibleIndices.map(idx => y[idx])
  const prioritized = results.includes('Cholera') ? 'Cholera' :
                      results.includes('Tuberculosis') ? 'Tuberculosis' :
                      results.includes('Malaria') ? 'Malaria' :
                      results.includes('Dengue') ? 'Dengue' :
                      results[0]

  const disease = prioritized
  const meta = DATA_META[disease]

  return { 
    disease, 
    remedies: meta.remedies || ["Consult a doctor if symptoms persist."], 
    severity: meta.severity, 
    severityLabel: meta.severityLabel,
    criticalWarning: meta.criticalWarning || null
  }
}
