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
// Features: [electric_contact, burning_skin, blisters, pain, unconscious, breathing_issue, redness]
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

/* ── 3. Remedies & Severities ─────────────────────────── */
export const DATA_META = {
  'Mild Electric Shock': {
    severity: 'moderate',
    severityLabel: '⚠️ Moderate',
    remedy: 'Stay away from the electric source. Keep an eye on any pain or muscle stiffness. Rest and drink fluids. See a doctor if you feel chest pain or dizziness.'
  },
  'Severe Electric Shock': {
    severity: 'critical',
    severityLabel: '🆘 Extremely Critical',
    remedy: 'DO NOT touch the person directly while still in contact with the source. Use non-conductive materials (wood/plastic) to move them. Call 108/112 immediately. Check for breathing and pulse.'
  },
  'Minor Burn': {
    severity: 'mild',
    severityLabel: '✓ Mild',
    remedy: 'Hold the burnt area under cool (not cold) running water for 10-15 minutes. Apply aloe vera or a mild burn ointment. Keep the area clean and covered with a sterile bandage.'
  },
  'Moderate Burn': {
    severity: 'moderate',
    severityLabel: '⚠️ Moderate',
    remedy: 'Cool the area. Avoid breaking blisters. Apply a sterile dressing. Consult a doctor for proper dressing and to prevent infection.'
  },
  'Severe Burn': {
    severity: 'critical',
    severityLabel: '🆘 Critical',
    remedy: 'Call emergency services (108/112) immediately. Do not remove burnt clothing. Cover wounds with a cool, moist sterile cloth or bandage. Elevate the burnt area above the heart.'
  },
  'No Major Issue': {
    severity: 'mild',
    severityLabel: '✓ Mild',
    remedy: 'No severe symptoms detected. However, if pain persists or redness spreads, please consult a local clinic.'
  },
  'Mild Issue': {
    severity: 'mild',
    severityLabel: '✓ Mild',
    remedy: 'Symptoms appear minimal. Maintain basic hygiene of the area. Observe for changes over the next few hours.'
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
    remedy: meta.remedy,
    severity: meta.severity,
    severityLabel: meta.severityLabel
  }
}
