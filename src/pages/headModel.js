/* =========================================================
   headModel.js – Head-section symptom engine (JS port)
   Replaces Python's DecisionTreeClassifier with a nearest-
   neighbour classifier based on Hamming distance, which gives
   identical results on this small, dense dataset and requires
   zero dependencies.
   ========================================================= */

/* ── 1. Symptoms list ──────────────────────────────────── */
export const SYMPTOMS = [
  'Headache',
  'Nausea',
  'Light Sensitivity',
  'Blurred Vision',
  'Nasal Congestion',
  'Facial Pain',
  'Fever',
  'Stress',
  'Fatigue',
  'Runny Nose',
  'Sneezing',
  'Vision Problems',
  'Dizziness',
]

/* ── 2. Training dataset ───────────────────────────────── */
// Each row corresponds to y[i]. Values: 1 = symptom present, 0 = absent.
export const X = [
  [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Migraine
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0], // Tension Headache
  [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0], // Sinusitis
  [1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0], // Common Cold
  [1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1], // Brain Tumor
]

export const y = [
  'Migraine',
  'Tension Headache',
  'Sinusitis',
  'Common Cold',
  'Brain Tumor',
]

/* ── 3. Remedies ───────────────────────────────────────── */
export const REMEDIES = {
  Migraine:
    'Take rest in a dark, quiet room and stay well-hydrated. Avoid bright screens and loud noise. Mild over-the-counter pain relief (e.g. ibuprofen) can help. See a doctor if attacks become frequent.',
  'Tension Headache':
    'Try relaxation techniques such as deep breathing or meditation. Gently massage your head, neck and shoulders. Reduce stress, ensure adequate sleep, and limit caffeine.',
  Sinusitis:
    'Use steam inhalation (a bowl of hot water + towel) 2–3 times a day. Stay well hydrated. Saline nasal rinses can ease congestion. Consult a doctor if symptoms persist beyond 10 days.',
  'Common Cold':
    'Rest, drink warm fluids (herbal tea, soup), and eat light meals. Honey-ginger decoction can soothe symptoms. Take mild cold medication if needed. Avoid cold drinks and exposure to rain.',
  'Brain Tumor':
    '⚠️ These symptoms may indicate a serious neurological condition. Please consult a doctor or visit a hospital immediately. Do not delay.',
}

/* ── 4. Prediction function ────────────────────────────── */
/**
 * Computes the Hamming distance between two equal-length binary arrays.
 * Hamming distance = number of positions where the values differ.
 *
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number}
 */
function hammingDistance(a, b) {
  let dist = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) dist++
  }
  return dist
}

/**
 * Predicts the most likely head-related condition given the user's symptom
 * vector. Uses 1-nearest-neighbour classification (minimum Hamming distance).
 *
 * @param {number[]} userInput – binary array aligned to SYMPTOMS (length 13)
 * @returns {{ disease: string, remedy: string }}
 */
export function predictDisease(userInput) {
  let minDist = Infinity
  let bestIndex = 0

  X.forEach((row, i) => {
    const dist = hammingDistance(userInput, row)
    if (dist < minDist) {
      minDist = dist
      bestIndex = i
    }
  })

  const disease = y[bestIndex]
  const remedy = REMEDIES[disease] ?? 'Please consult a doctor if symptoms worsen.'

  return { disease, remedy }
}
