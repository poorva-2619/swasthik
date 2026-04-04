/* =========================================================
   chestModel.js – Chest-section symptom engine (JS port)
   Replaces Python's DecisionTreeClassifier with a nearest-
   neighbour classifier based on Hamming distance.
   ========================================================= */

export const SYMPTOMS = [
    "Chest Pain", 
    "Shortness of Breath", 
    "Excess Sweating", 
    "Nausea", 
    "Pain in Left Arm"
]

export const X_DATA = [
    [1, 1, 1, 1, 1], // Heart Attack
    [1, 1, 1, 0, 1], // Severe Angina
    [1, 0, 0, 0, 0], // Acidity
    [0, 0, 0, 0, 0], // Muscle Strain
    [1, 1, 1, 1, 1], // Cardiac Arrest Risk
    [0, 0, 0, 0, 0], // Gas Problem
    [1, 1, 1, 1, 1], // Heart Attack
    [0, 0, 0, 0, 0], // Normal
    [1, 1, 1, 0, 1], // Severe Angina
    [0, 0, 0, 0, 0]  // Healthy
]

export const y = [
    "Heart Attack",
    "Severe Angina",
    "Acidity",
    "Muscle Strain",
    "Cardiac Arrest Risk",
    "Gas Problem",
    "Heart Attack",
    "Normal",
    "Severe Angina",
    "Healthy"
]

export const REMEDIES = {
    "Heart Attack": "Take Aspirin (if not allergic), chew it. Call emergency immediately.",
    "Severe Angina": "Rest immediately, take prescribed medication, consult doctor.",
    "Cardiac Arrest Risk": "EMERGENCY: Start CPR + call ambulance.",
    "Acidity": "Take antacid like Gelusil or ENO.",
    "Gas Problem": "Walk slowly, take antacid.",
    "Muscle Strain": "Rest + apply heat pack.",
    "Normal": "Monitor symptoms.",
    "Healthy": "No issue detected."
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
 * Predicts the most likely chest-related condition given the user's symptom vector.
 */
export function predictDisease(userInput) {
  let minDist = Infinity
  let bestIndex = 0

  X_DATA.forEach((row, i) => {
    const dist = hammingDistance(userInput, row)
    if (dist < minDist) {
      minDist = dist
      bestIndex = i
    }
  })

  // Tie breakers: if all zero, return Healthy or Normal
  const allZero = userInput.every(x => x === 0)
  if (allZero) {
      return { disease: "Healthy", remedy: "No issue detected.", warning: null }
  }

  const disease = y[bestIndex]
  const remedy = REMEDIES[disease] ?? "Monitor symptoms."

  const emergency = ["Heart Attack", "Cardiac Arrest Risk", "Severe Angina"]
  
  let warning = null
  if (emergency.includes(disease)) {
      warning = "EMERGENCY: Call ambulance immediately (108 in India).\n\nCPR STEPS (if person collapses):\n1. Check responsiveness\n2. Call for help\n3. Push hard & fast in center of chest (100-120/min)\n4. Continue until help arrives"
  } else {
      warning = "If pain continues >5 min, do NOT ignore → see doctor."
  }

  return { disease, remedy, warning }
}
