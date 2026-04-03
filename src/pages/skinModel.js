/* =========================================================
   skinModel.js – Skin-section symptom engine (JS port)
   Replaces Python's KNeighborsClassifier (n_neighbors=3).
   ========================================================= */

export const SYMPTOMS = [
    "Rashes",
    "Itching",
    "Redness",
    "Blisters",
    "Open wounds",
    "Dry skin",
    "Scaling",
    "Burning sensation"
]

export const X = [
    [1,1,1,0,0,0,0,0],  // Scabies
    [1,1,1,0,0,0,1,1],  // Fungal Infection
    [1,1,1,0,0,1,1,0],  // Eczema
    [1,1,0,0,0,0,1,1],  // Fungal Infection
    [1,1,1,1,0,0,0,0],  // Scabies
    [1,1,1,0,0,1,0,0]   // Eczema
]

export const y = [
    "Scabies",
    "Fungal Infection",
    "Eczema",
    "Fungal Infection",
    "Scabies",
    "Eczema"
]

export const REMEDIES = {
    "Scabies": [
        "Apply permethrin cream at night.",
        "Wash bedding and clothes in hot water.",
        "Avoid close contact.",
        "Creams available in India:\n- Permite 5% Cream\n- Scabicip Lotion"
    ],
    "Fungal Infection": [
        "Apply antifungal cream twice daily.",
        "Keep area dry.",
        "Avoid tight clothes.",
        "Creams available in India:\n- Candid Cream (Clotrimazole)\n- Canesten Cream"
    ],
    "Eczema": [
        "Use moisturizer regularly.",
        "Avoid harsh soaps.",
        "Avoid triggers.",
        "Creams available in India:\n- CeraVe Moisturizing Cream\n- Bioderma Atoderm"
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
 * Predicts the skin disease using 3-NN algorithm logic based on Hamming distances.
 */
export function predictDisease(userInput) {
  // Array of { dist, label }
  let distances = X.map((row, i) => ({
    dist: hammingDistance(userInput, row),
    label: y[i]
  }))

  // Sort by smallest distance
  distances.sort((a, b) => a.dist - b.dist)

  // Take top 3 neighbors
  let top3 = distances.slice(0, 3)

  // Count frequencies
  let freq = {}
  top3.forEach(item => {
    freq[item.label] = (freq[item.label] || 0) + 1
  })

  // Find majority class
  let bestLabel = ""
  let maxCount = 0
  for (let label in freq) {
    if (freq[label] > maxCount) {
      maxCount = freq[label]
      bestLabel = label
    }
  }

  let confidence = maxCount / 3

  let disease = bestLabel
  let remedies = REMEDIES[disease] ?? []
  let remedyText = remedies.map(r => "- " + r).join("\n")

  // Handle uncertain prediction as instructed
  if (confidence < 0.5) {
      disease = "Uncertain Diagnosis"
      remedyText = "Prediction is uncertain.\nPlease consult a doctor if symptoms increase over time."
  }

  return { disease, remedy: remedyText, confidence }
}
