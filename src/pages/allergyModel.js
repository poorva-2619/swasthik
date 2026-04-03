/* =========================================================
   allergyModel.js – Allergy symptom engine (JS port)
   Replaces Python's DecisionTreeClassifier with a nearest-
   neighbour classifier based on Hamming distance.
   ========================================================= */

export const SYMPTOMS = [
    "Sneezing",
    "a Runny Nose",
    "Itching",
    "a Skin Rash",
    "Swelling",
    "Breathing Difficulty",
    "Recent Exposure to Dust or Smoke",
    "Recent Exposure to Fields or Plants",
    "Symptoms After Eating Something",
    "a Recent Insect Sting"
]

export const X = [
    [1, 1, 1, 0, 0, 0, 1, 1, 0, 0], // Row 0
    [1, 1, 0, 0, 0, 0, 1, 0, 0, 0], // Row 1
    [0, 0, 1, 1, 1, 0, 0, 1, 0, 1], // Row 2
    [0, 0, 1, 1, 0, 0, 0, 0, 1, 0], // Row 3
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Row 4
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1], // Row 5
    [1, 1, 0, 0, 0, 0, 1, 0, 0, 0], // Row 6
    [0, 0, 1, 1, 1, 1, 0, 1, 1, 1], // Row 7
    [1, 1, 1, 0, 0, 0, 1, 1, 0, 0], // Row 8
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  // Row 9
]

export const y = [
    "Dust Allergy",
    "Dust Allergy",
    "Insect Sting Allergy",
    "Food Allergy",
    "Severe Allergic Reaction",
    "Food Allergy",
    "Dust Allergy",
    "Severe Allergic Reaction",
    "Pollen Allergy",
    "Mild Allergy"
]

export const REMEDIES = {
    "Dust Allergy": [
        "Wear mask while sweeping or near smoke",
        "Avoid chulha smoke exposure",
        "Steam inhalation",
        "Take cetirizine tablet"
    ],
    "Pollen Allergy": [
        "Avoid going to fields early morning",
        "Wash face and hands after exposure",
        "Use antihistamine (cetirizine/loratadine)"
    ],
    "Insect Sting Allergy": [
        "Apply ice pack immediately",
        "Apply calamine lotion",
        "Take antihistamine",
        "Avoid scratching"
    ],
    "Food Allergy": [
        "Stop eating suspected food immediately",
        "Drink water",
        "Take antihistamine",
        "Avoid same food in future"
    ],
    "Mild Allergy": [
        "Rest and hydration",
        "Avoid trigger",
        "Basic antihistamine if needed"
    ],
    "Severe Allergic Reaction": [
        "EMERGENCY",
        "Take antihistamine immediately",
        "If swelling of throat or breathing issue → hospital immediately",
        "Possible anaphylaxis"
    ]
}

/**
 * Computes the Hamming distance between two binary vectors.
 */
function hammingDistance(a, b) {
  let dist = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) dist++
  }
  return dist
}

/**
 * Predicts the most likely allergic condition.
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

  // Resolving ties to prefer severity if needed based on the user's specific warning.
  const disease = y[bestIndex]
  const remedies = REMEDIES[disease] ?? ["Consult doctor"]
  
  let remedyText = remedies.map(r => "- " + r).join("\n")

  // Critical Warning logic
  if (disease === "Severe Allergic Reaction") {
      remedyText += "\n\nCRITICAL WARNING:\nBreathing problem / throat swelling = LIFE THREATENING\nGo to nearest hospital immediately"
  }

  return { disease, remedy: remedyText }
}
