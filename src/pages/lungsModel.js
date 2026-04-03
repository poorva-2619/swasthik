/* =========================================================
   lungsModel.js – Lungs-section symptom engine (JS port)
   Replaces Python's DecisionTreeClassifier with a nearest-
   neighbour classifier based on Hamming distance.
   ========================================================= */

export const SYMPTOMS = [
    "a Cough", 
    "a Fever", 
    "Shortness of Breath", 
    "Chest Pain", 
    "Mucus or Phlegm", 
    "a Cough lasting more than 2 weeks", 
    "Unexplained Weight Loss", 
    "a History of Smoking"
]

export const X = [
    [1, 0, 0, 0, 1, 0, 0, 0], // Common Cold
    [1, 1, 1, 1, 1, 0, 0, 1], // Bronchitis
    [1, 1, 1, 1, 1, 0, 0, 1], // Pneumonia
    [1, 1, 1, 1, 1, 0, 0, 1], // Pneumonia
    [1, 0, 1, 0, 1, 0, 0, 1], // Asthma
    [1, 1, 1, 1, 1, 1, 1, 1], // Possible TB
    [1, 1, 1, 1, 1, 1, 1, 1], // Possible TB
    [0, 0, 0, 0, 0, 0, 0, 0], // No Issue
    [1, 1, 1, 1, 1, 1, 1, 1], // Severe Lung Infection
    [0, 0, 0, 0, 0, 0, 0, 0]  // Mild Issue
]

export const y = [
    "Common Cold",
    "Bronchitis",
    "Pneumonia",
    "Pneumonia",
    "Asthma",
    "Possible TB",
    "Possible TB",
    "No Issue",
    "Severe Lung Infection",
    "Mild Issue"
]

export const REMEDIES = {
    "Common Cold": [
        "Rest and hydration",
        "Steam inhalation",
        "Paracetamol for fever",
        "Warm fluids"
    ],
    "Bronchitis": [
        "Avoid smoke/dust exposure",
        "Steam inhalation",
        "Use cough syrup",
        "Consult doctor if persists"
    ],
    "Asthma": [
        "Use inhaler (as prescribed)",
        "Avoid triggers (dust, smoke)",
        "Practice breathing exercises",
        "Keep emergency inhaler ready"
    ],
    "Pneumonia": [
        "Needs medical attention",
        "Take prescribed antibiotics",
        "Rest and fluids",
        "Monitor breathing"
    ],
    "Possible TB": [
        "URGENT: Get TB test (sputum/X-ray)",
        "Avoid close contact with others",
        "Proper medication required (long-term)",
        "Government hospitals provide free TB treatment"
    ],
    "Severe Lung Infection": [
        "EMERGENCY",
        "Hospital visit immediately",
        "Oxygen support may be needed"
    ],
    "No Issue": [
        "Healthy condition",
        "Maintain hygiene"
    ],
    "Mild Issue": [
        "Basic care",
        "Monitor symptoms"
    ]
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
 * Predicts the most likely lungs-related condition given the user's symptom vector.
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

  // To match tie-breaking (e.g. Bronchitis vs Pneumonia, TB vs Severe Infection), 
  // keeping the first met index generally aligns with standard tree behavior at depth 
  // but if multiple duplicate rows exist, the dataset natively has duplicate features resolving arbitrarily.
  const disease = y[bestIndex]
  const remedies = REMEDIES[disease] ?? ["Consult doctor"]
  
  let remedyText = remedies.map(r => "- " + r).join("\n")

  // Additional warnings based on user python file
  if (disease === "Pneumonia" || disease === "Severe Lung Infection") {
      remedyText += "\n\nWARNING:\nSerious lung condition — do not ignore."
  }
  if (disease === "Possible TB") {
      remedyText += "\n\nIMPORTANT:\nChronic cough + weight loss → TB suspicion. Early testing is very important."
  }

  return { disease, remedy: remedyText }
}
