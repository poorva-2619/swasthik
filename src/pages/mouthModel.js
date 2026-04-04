/* =========================================================
   mouthModel.js – Mouth-section symptom engine (JS port)
   Replaces Python's DecisionTreeClassifier with a nearest-
   neighbour classifier based on Hamming distance.
   ========================================================= */

export const SYMPTOMS = [
    "Tooth Pain", 
    "Gum Swelling", 
    "Bleeding Gums", 
    "Bad Breath", 
    "Mouth Ulcers",
    "Burning Sensation"
]

export const X = [
    [1, 1, 0, 1, 0, 0], // Tooth Decay
    [1, 0, 1, 1, 0, 0], // Gingivitis
    [0, 1, 1, 1, 1, 0], // Periodontitis
    [0, 0, 0, 0, 1, 1], // Mouth Ulcers
    [0, 0, 0, 1, 1, 1], // Aphthous Ulcer
    [0, 1, 1, 1, 1, 1], // Oral Infection
    [0, 0, 0, 0, 0, 0], // Healthy
    [1, 0, 0, 1, 0, 0], // Cavity
    [0, 0, 0, 0, 1, 1], // Severe Ulcer (same symptoms but separated by label, model will just match the first one, or we can adjust) - Wait, in the Python dataset, the rows are:
    /*
    "tooth_pain":        [1,1,0,0,0,0,0,1,0,0],
    "gum_swelling":      [1,0,1,0,0,1,0,0,0,0],
    "bleeding_gums":     [0,1,1,0,0,1,0,0,0,0],
    "bad_breath":        [1,1,1,0,1,1,0,1,0,0],
    "mouth_ulcers":      [0,0,1,1,1,1,0,0,1,1],
    "burning_sensation": [0,0,0,1,1,1,0,0,1,1],
    */
]

// Re-building X strictly from the user's provided Python dataset:
export const X_DATA = [
    [1, 1, 0, 1, 0, 0], // Tooth Decay
    [1, 0, 1, 1, 0, 0], // Gingivitis
    [0, 1, 1, 1, 1, 0], // Periodontitis
    [0, 0, 0, 0, 1, 1], // Mouth Ulcers
    [0, 0, 0, 1, 1, 1], // Aphthous Ulcer
    [0, 1, 1, 1, 1, 1], // Oral Infection
    [0, 0, 0, 0, 0, 0], // Healthy
    [1, 0, 0, 1, 0, 0], // Cavity
    [0, 0, 0, 0, 1, 1], // Severe Ulcer
    [0, 0, 0, 0, 1, 1], // Vitamin Deficiency Ulcer
]

export const y = [
    "Tooth Decay",
    "Gingivitis",
    "Periodontitis",
    "Mouth Ulcers",
    "Aphthous Ulcer",
    "Oral Infection",
    "Healthy",
    "Cavity",
    "Severe Ulcer",
    "Vitamin Deficiency Ulcer"
]

export const REMEDIES = {
    "Mouth Ulcers": "Apply Dologel CT, rinse with salt water, avoid spicy food.",
    "Aphthous Ulcer": "Take B-complex, apply Kenacort gel, reduce stress.",
    "Severe Ulcer": "URGENT: Doctor visit needed, may require medication.",
    "Vitamin Deficiency Ulcer": "Take Vitamin B12 + iron supplements.",
    "Tooth Decay": "Use fluoride toothpaste, visit dentist for filling.",
    "Gingivitis": "Brush twice, use mouthwash, salt water rinse.",
    "Periodontitis": "Deep cleaning required by dentist.",
    "Oral Infection": "Use Hexidine mouthwash.",
    "Cavity": "Dental filling required.",
    "Healthy": "Maintain oral hygiene."
}

/**
 * Computes the Hamming distance between two equal-length binary arrays.
 */
function hammingDistance(a, b) {
  let dist = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) dist++
  }
  return dist
}

/**
 * Predicts the most likely mouth-related condition given the user's symptom vector.
 */
export function predictDisease(userInput) {
  let minDist = Infinity
  let bestIndex = 0

  // Handle exact edge cases or random ties if needed, but hamming distance works for standard logic
  X_DATA.forEach((row, i) => {
    const dist = hammingDistance(userInput, row)
    // If strict match for ulcer, we can pick the default 'Mouth Ulcers' or rely on user answering more specific questions
    if (dist < minDist) {
      minDist = dist
      bestIndex = i
    }
  })

  const disease = y[bestIndex]
  const remedy = REMEDIES[disease] ?? "Monitor symptoms, consult dentist if needed."

  const serious = ["Severe Ulcer", "Periodontitis"]
  const monitor = ["Mouth Ulcers", "Aphthous Ulcer", "Vitamin Deficiency Ulcer"]

  let warning = null
  if (serious.includes(disease)) {
      warning = "WARNING: Serious condition. Seek medical help immediately."
  } else if (monitor.includes(disease)) {
      warning = "If ulcer lasts more than 2 weeks → get checked (important)."
  }

  return { disease, remedy, warning }
}
