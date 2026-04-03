/* =========================================================
   heartModel.js – Heart-section symptom engine (JS port)
   Replaces Python's DecisionTreeClassifier with a nearest-
   neighbour classifier based on Hamming distance.
   ========================================================= */

export const SYMPTOMS = [
    "Chest Pain",
    "Shortness of Breath",
    "Unusual Fatigue",
    "Heart Palpitations",
    "Dizziness",
    "Cold Sweating"
]

export const X = [
    [1, 1, 1, 1, 1, 1], // Heart Attack Risk
    [1, 1, 1, 1, 1, 1], // Severe Cardiac Issue
    [0, 0, 1, 0, 0, 0], // Healthy
    [1, 1, 1, 1, 1, 1], // Heart Attack Risk
    [0, 0, 1, 0, 0, 0], // Anxiety
    [1, 1, 0, 1, 1, 1], // Arrhythmia
    [0, 0, 1, 0, 0, 0], // Healthy
    [0, 0, 0, 0, 0, 0], // Healthy
    [1, 1, 1, 1, 1, 1], // Severe Cardiac Issue
    [1, 1, 1, 1, 1, 1]  // Heart Attack Risk
]

export const y = [
    "Heart Attack Risk",
    "Severe Cardiac Issue",
    "Healthy",
    "Heart Attack Risk",
    "Anxiety",
    "Arrhythmia",
    "Healthy",
    "Healthy",
    "Severe Cardiac Issue",
    "Heart Attack Risk"
]

export const REMEDIES = {
    // We will handle the action plan directly in the JS logic
    "Heart Attack Risk": [],
    "Severe Cardiac Issue": [],
    "Arrhythmia": [
        "Consult cardiologist urgently",
        "Avoid caffeine & stress",
        "ECG check recommended"
    ],
    "Anxiety": [
        "Try deep breathing",
        "Sit and relax",
        "If symptoms repeat, consult doctor"
    ],
    "Healthy": [
        "No major issue detected",
        "Maintain healthy lifestyle"
    ]
}

/**
 * Computes the Hamming distance between two boolean arrays.
 */
function hammingDistance(a, b) {
  let dist = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) dist++
  }
  return dist
}

/**
 * Predicts the most likely heart condition based on user inputs.
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
  const remedies = REMEDIES[disease] ?? []
  
  let remedyText = remedies.map(r => "- " + r).join("\n")

  // Critical Warnings & Specific Action Plan (as per python model)
  if (disease === "Heart Attack Risk" || disease === "Severe Cardiac Issue") {
      remedyText = "\nEMERGENCY 🚨\n- Call ambulance immediately (India: 108)\n- Do NOT delay or ignore symptoms\n- Keep patient calm and seated\n\nCPR (ONLY if person is unconscious & not breathing):\n1. Lay the person flat on a hard surface\n2. Place hands in center of chest\n3. Push hard and fast (100–120 compressions/min)\n4. Depth: about 2 inches\n5. Continue until help arrives"
  }

  return { disease, remedy: remedyText }
}
