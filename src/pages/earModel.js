/* =========================================================
   earModel.js – Ear-section symptom engine (JS port)
   Replaces Python's DecisionTreeClassifier with a nearest-
   neighbour classifier based on Hamming distance.
   ========================================================= */

export const SYMPTOMS = [
    "Ear Pain", 
    "Hearing Loss", 
    "Itching", 
    "Discharge From Ear", 
    "Ringing Sound"
]

export const X = [
    [1, 0, 0, 1, 0], // Ear Infection
    [1, 1, 0, 1, 1], // Otitis Media
    [0, 1, 1, 0, 1], // Ear Wax
    [0, 0, 1, 0, 0], // Fungal Infection
    [1, 1, 0, 1, 0], // Severe Infection
    [0, 0, 1, 0, 1], // Tinnitus
    [0, 0, 0, 0, 1], // Hearing Loss
    [1, 0, 0, 0, 0], // Minor Ear Pain
]

export const y = [
    "Ear Infection", 
    "Otitis Media", 
    "Ear Wax", 
    "Fungal Infection", 
    "Severe Infection", 
    "Tinnitus", 
    "Hearing Loss", 
    "Minor Ear Pain"
]

export const REMEDIES = {
    "Ear Infection": "Use antibiotic ear drops like Ciplox (doctor advised), keep ear dry.",
    "Otitis Media": "Take steam, use pain reliever like paracetamol, consult doctor.",
    "Ear Wax": "Use ear drops like Debrox or olive oil to soften wax.",
    "Fungal Infection": "Use antifungal drops like Clotrimazole (doctor advised).",
    "Severe Infection": "URGENT: Visit ENT specialist immediately.",
    "Tinnitus": "Avoid loud noise, reduce stress, no direct cure—consult doctor.",
    "Hearing Loss": "URGENT: Get hearing test done immediately.",
    "Minor Ear Pain": "Use warm compress, take mild painkiller like paracetamol."
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
 * Predicts the most likely ear-related condition given the user's symptom vector.
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
  const remedy = REMEDIES[disease] ?? "If symptoms persist >2-3 days, consult a doctor."

  // Warning for serious conditions
  const serious = ["Severe Infection", "Hearing Loss"];
  const warning = serious.includes(disease) 
    ? "WARNING: This may be serious. Seek medical help immediately." 
    : "If symptoms persist >2-3 days, consult a doctor.";

  return { disease, remedy, warning }
}
