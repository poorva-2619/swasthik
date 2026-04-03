/* =========================================================
   noseModel.js – Nose-section symptom engine (JS port)
   Replaces Python's DecisionTreeClassifier with a nearest-
   neighbour classifier based on Hamming distance.
   ========================================================= */

export const SYMPTOMS = [
    "Sneezing",
    "a Runny Nose",
    "Nasal Blockage",
    "a Fever",
    "a Headache",
    "Loss of Smell"
]

export const X = [
    [1, 1, 0, 0, 0, 0], // Row 0
    [1, 1, 1, 1, 1, 0], // Row 1
    [0, 1, 1, 1, 1, 1], // Row 2
    [0, 0, 1, 1, 1, 1], // Row 3
    [1, 1, 0, 0, 0, 0], // Row 4
    [0, 0, 1, 1, 1, 1], // Row 5
    [1, 1, 0, 0, 0, 0], // Row 6
    [0, 0, 1, 1, 1, 1], // Row 7
    [1, 1, 0, 0, 0, 0], // Row 8
    [0, 0, 1, 1, 1, 1]  // Row 9
]

export const y = [
    "Common Cold",
    "Flu",
    "Sinusitis",
    "Sinusitis",
    "Allergic Rhinitis",
    "Nasal Infection",
    "Allergic Rhinitis",
    "Nasal Infection",
    "Allergic Rhinitis",
    "Nasal Infection"
]

export const REMEDIES = {
    "Common Cold": [
        "Take steam inhalation",
        "Tablet: Paracetamol",
        "Drink warm fluids"
    ],
    "Flu": [
        "Tablet: Paracetamol",
        "Antiviral if severe (consult doctor)",
        "Rest + hydration"
    ],
    "Sinusitis": [
        "Steam inhalation",
        "Nasal spray: Otrivin",
        "Painkiller: Ibuprofen"
    ],
    "Allergic Rhinitis": [
        "Tablet: Cetirizine / Levocetirizine",
        "Avoid dust/pollen",
        "Use saline nasal spray"
    ],
    "Nasal Infection": [
        "Antibiotic (ONLY after doctor consult)",
        "Steam inhalation",
        "Nasal drops"
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
 * Predicts the most likely nose condition based on user inputs.
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

  // Resolving ties algorithmically is fine as the python model uses entropy / indices logic
  const disease = y[bestIndex]
  const remedies = REMEDIES[disease] ?? ["Consult a doctor"]
  
  let remedyText = remedies.map(r => "- " + r).join("\n")

  // Common warning block specified in Python file
  remedyText += "\n\nWarning:\n- If symptoms last >5 days\n- High fever or breathing issue\nConsult a doctor immediately"

  return { disease, remedy: remedyText }
}
