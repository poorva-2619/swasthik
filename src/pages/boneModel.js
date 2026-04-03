/* =========================================================
   boneModel.js – Bone-section symptom engine
   ========================================================= */

/* ── 1. Symptoms list ──────────────────────────────────── */
export const SYMPTOMS = [
  'Pain in bones or joints',
  'Swelling or inflammation',
  'Visible deformity or misalignment',
  'Difficulty moving the affected area',
  'History of weak bones (Osteopenia)',
  'Numbness or tingling sensation'
]

/* ── 2. Training dataset ───────────────────────────────── */
export const X = [
  [1, 1, 1, 1, 0, 0], // Index 0: Fracture
  [1, 1, 0, 1, 0, 1], // Index 1: Dislocation
  [1, 0, 0, 1, 1, 0], // Index 2: Osteoporosis
  [1, 1, 1, 1, 0, 1], // Index 3: Severe Fracture
  [0, 0, 0, 0, 1, 0], // Index 4: Arthritis
  [0, 0, 0, 0, 1, 1], // Index 5: Nerve Compression
  [1, 1, 1, 1, 0, 1], // Index 6: Spinal Injury
  [0, 0, 0, 0, 1, 0], // Index 7: Vitamin D Deficiency
]

export const y = [
  'Fracture',
  'Dislocation',
  'Osteoporosis',
  'Severe Fracture',
  'Arthritis',
  'Nerve Compression',
  'Spinal Injury',
  'Vitamin D Deficiency'
]

/* ── 3. Dataset Metadata (Remedies, Warnings) ──────────── */
export const DATA_META = {
  'Fracture': {
    severity: 'serious',
    severityLabel: '🚨 Serious',
    remedies: [
      "Do NOT move the affected area",
      "Immobilize using splint or support",
      "Apply ice (do not press hard)",
      "Seek IMMEDIATE medical help"
    ],
    criticalWarning: "EMERGENCY WARNING: Potential bone break detected."
  },
  'Severe Fracture': {
    severity: 'critical',
    severityLabel: '🆘 Critical',
    remedies: [
      "Do NOT move the affected area",
      "Immobilize using splint or support",
      "Apply ice (do not press hard)",
      "Seek IMMEDIATE medical help"
    ],
    criticalWarning: "EMERGENCY WARNING: Severe bone injury. Do not move."
  },
  'Spinal Injury': {
    severity: 'critical',
    severityLabel: '🆘 Extremely Critical',
    remedies: [
      "Do NOT move the person",
      "Immobilize using splint or support",
      "Apply ice (do not press hard)",
      "Seek IMMEDIATE medical help"
    ],
    criticalWarning: "EMERGENCY WARNING: Potential spinal cord injury. DO NOT MOVE."
  },
  'Dislocation': {
    severity: 'serious',
    severityLabel: '🚨 Serious',
    remedies: [
      "Do NOT try to fix it yourself",
      "Keep joint still",
      "Go to hospital ASAP"
    ],
    urgentCare: "URGENT CARE NEEDED"
  },
  'Osteoporosis': {
    severity: 'moderate',
    severityLabel: '⚠️ Moderate',
    remedies: [
      "Increase calcium & Vitamin D intake",
      "Avoid falls",
      "Consult doctor for bone density test"
    ],
    cautionLabel: "CAUTION"
  },
  'Arthritis': {
    severity: 'moderate',
    severityLabel: '⚠️ Moderate',
    remedies: [
      "Use pain relief gel (like Volini)",
      "Do light exercise",
      "Warm compress helps"
    ],
    managementLabel: "MANAGEMENT"
  },
  'Nerve Compression': {
    severity: 'moderate',
    severityLabel: '⚠️ Moderate',
    remedies: [
      "Avoid pressure on affected area",
      "Maintain posture",
      "If pain persists → doctor"
    ],
    attentionLabel: "ATTENTION"
  },
  'Vitamin D Deficiency': {
    severity: 'mild',
    severityLabel: '✓ Mild',
    remedies: [
      "Sunlight exposure (15–20 mins daily)",
      "Take Vitamin D supplements",
      "Milk, eggs, fish"
    ],
    remedyLabel: "REMEDY"
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

  const bestIndex = possibleIndices[0]
  const disease = y[bestIndex]
  const meta = DATA_META[disease]

  return { 
    disease, 
    remedies: meta.remedies || ["Consult a doctor for accurate diagnosis."], 
    severity: meta.severity, 
    severityLabel: meta.severityLabel,
    criticalWarning: meta.criticalWarning || null,
    urgentCare: meta.urgentCare || null,
    cautionLabel: meta.cautionLabel || null,
    managementLabel: meta.managementLabel || null,
    attentionLabel: meta.attentionLabel || null,
    remedyLabel: meta.remedyLabel || null
  }
}
