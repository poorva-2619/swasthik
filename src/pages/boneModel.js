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
// Features: [pain, swelling, deformity, difficulty_moving, weak_bones, numbness]
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

/* ── 3. Remedies & Severities ─────────────────────────── */
export const DATA_META = {
  'Fracture': {
    severity: 'serious',
    severityLabel: '🚨 Serious',
    remedy: 'Keep the area immobilized and seek medical attention immediately. Do not try to move the bone yourself.'
  },
  'Dislocation': {
    severity: 'serious',
    severityLabel: '🚨 Serious',
    remedy: 'Do not attempt to push the joint back into place. Immobilize the area and go to an emergency room.'
  },
  'Osteoporosis': {
    severity: 'moderate',
    severityLabel: '⚠ Moderate',
    remedy: 'Ensure adequate calcium and vitamin D intake. Consult a doctor for bone density testing and weight-bearing exercise recommendations.'
  },
  'Severe Fracture': {
    severity: 'critical',
    severityLabel: '🆘 Critical',
    remedy: 'Immobilize the area and call for an ambulance immediately. Do not move the affected part at all.'
  },
  'Arthritis': {
    severity: 'moderate',
    severityLabel: '⚠ Moderate',
    remedy: 'Apply warm or cold compresses to the affected joint. Gentle stretching and over-the-counter anti-inflammatories can help. See a doctor for a long-term plan.'
  },
  'Nerve Compression': {
    severity: 'moderate',
    severityLabel: '⚠ Moderate',
    remedy: 'Rest the affected area and avoid repetitive motions. Physiotherapy or ergonomic adjustments may be needed. Consult a specialist if numbness persists.'
  },
  'Spinal Injury': {
    severity: 'critical',
    severityLabel: '🆘 Extremely Critical',
    remedy: 'Do NOT move the person. Call 108/112 immediately. Any movement could cause permanent paralysis. Remain still until help arrives.'
  },
  'Vitamin D Deficiency': {
    severity: 'mild',
    severityLabel: '✓ Mild',
    remedy: 'Take vitamin D supplements as advised by a healthcare professional. Spend time in safe sunlight and eat vitamin D-rich foods.'
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

  // If multiple exact matches, we might show both or prioritize the more severe one
  // For simplicity and alignment with user request, we take the best one.
  // In the case of Severe Fracture vs Spinal Injury (indices 3 and 6), they are both critical.
  const bestIndex = possibleIndices[0]
  const disease = y[bestIndex]
  const meta = DATA_META[disease]

  return { 
    disease, 
    remedy: meta.remedy, 
    severity: meta.severity, 
    severityLabel: meta.severityLabel 
  }
}
