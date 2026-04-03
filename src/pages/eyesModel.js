/* =========================================================
   eyesModel.js – Eyes-section symptom engine (JS port)
   Replaces Python's DecisionTreeClassifier with a nearest-
   neighbour classifier based on Hamming distance.
   ========================================================= */

export const SYMPTOMS = [
    "Blurred Vision", "Double Vision", "Redness", "Pain or Irritation", 
    "Itching", "Tearing", "Dryness", "Sensitivity to Light", 
    "Swelling", "Discharge", "Headache", "Nausea"
]

export const X = [
    [1,0,1,1,0,1,0,1,0,0,0,0], // Conjunctivitis
    [1,0,0,1,1,0,1,0,0,0,0,0], // Dry Eyes
    [1,1,1,1,0,1,0,1,0,0,1,1], // Glaucoma
    [1,0,1,1,0,0,0,1,1,0,1,0], // Eye Strain
    [1,0,1,1,0,0,0,1,1,1,1,1], // Cataract
]

export const y = ["Conjunctivitis", "Dry Eyes", "Glaucoma", "Eye Strain", "Cataract"]

export const REMEDIES = {
    "Conjunctivitis": "Use prescribed eye drops, keep eyes clean, avoid touching your eyes. Use prescribed antibiotic or anti-inflammatory eye drops. Rinse your eyes gently with cold clean water. Avoid touching or rubbing your eyes to prevent infection.",
    "Dry Eyes": "Use artificial tears, take regular breaks from screen, stay hydrated. Use artificial tears or lubricating eye drops regularly. Take frequent breaks from screens (20-20-20 rule). Stay hydrated and avoid dry or dusty environments.",
    "Glaucoma": "This is serious, please consult an eye specialist immediately. Avoid straining your eyes or heavy lifting until checked.",
    "Eye Strain": "Take breaks from screens, practice 20-20-20 rule, adjust lighting. Take regular screen breaks and adjust lighting. Apply a cold compress or rinse eyes with cool water. Ensure your workstation ergonomics are good.",
    "Cataract": "Consult an eye specialist for proper diagnosis and possible surgery. Protect your eyes from strong sunlight with sunglasses."
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
 * Predicts the most likely eyes-related condition given the user's symptom vector.
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
  const remedy = REMEDIES[disease] ?? "Please consult an eye specialist immediately if symptoms worsen."

  return { disease, remedy }
}
