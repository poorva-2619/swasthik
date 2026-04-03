/* =========================================================
   stomachModel.js – Stomach-section symptom engine (JS port)
   Replaces Python's DecisionTreeClassifier with a nearest-
   neighbour classifier based on Hamming distance.
   ========================================================= */

export const SYMPTOMS = [
    "Burning in stomach",
    "Nausea",
    "Vomiting",
    "Bloating",
    "Abdominal pain",
    "Diarrhea",
    "Acidity after eating",
    "Loss of appetite"
]

// Synthesized dataset since stomach_dataset.csv was not provided in plain text:
export const X = [
    [1, 0, 0, 0, 0, 0, 1, 0], // Acidity
    [1, 1, 1, 1, 1, 0, 0, 1], // Gastritis
    [0, 1, 0, 1, 0, 0, 0, 0], // Indigestion
    [0, 1, 1, 0, 1, 1, 0, 1], // Food Poisoning
    [1, 1, 0, 1, 1, 0, 1, 1]  // Peptic Ulcer
]

export const y = [
    "Acidity",
    "Gastritis",
    "Indigestion",
    "Food Poisoning",
    "Peptic Ulcer"
]

export const REMEDIES = {
    "Acidity": [
        "Drink a glass of warm water with a pinch of baking soda",
        "Avoid spicy and oily foods",
        "Eat smaller meals more frequently",
        "Avoid lying down immediately after eating"
    ],
    "Gastritis": [
        "Avoid alcohol and smoking",
        "Eat bland, soft foods",
        "Take antacids as prescribed",
        "Reduce stress through meditation or light exercise"
    ],
    "Indigestion": [
        "Drink ginger or peppermint tea",
        "Eat slowly and chew food properly",
        "Avoid overeating",
        "Limit caffeine and carbonated drinks"
    ],
    "Food Poisoning": [
        "Stay hydrated with oral rehydration solutions",
        "Eat light, easily digestible foods",
        "Avoid dairy and fatty foods until recovery",
        "Rest properly"
    ],
    "Peptic Ulcer": [
        "Avoid spicy and acidic foods",
        "Take prescribed medications (antacids/proton pump inhibitors)",
        "Eat smaller, frequent meals",
        "Avoid smoking and alcohol"
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
 * Predicts the most likely stomach-related condition given the user's symptom vector.
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

  if (remedyText.trim() === "") {
      remedyText = "No specific remedies found. Consult a doctor if symptoms persist."
  }

  return { disease, remedy: remedyText }
}
