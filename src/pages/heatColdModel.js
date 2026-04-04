/* =========================================================
   heatColdModel.js – Heat & Cold problems engine (JS port)
   Combines two separate Python models (Heat Stroke & Hypothermia)
   into a single intelligent unified questionnaire.
   ========================================================= */

export const SYMPTOMS = [
    "High Body Temperature",  // 0
    "Excess Sweating",        // 1
    "Dizziness",              // 2
    "Confusion",              // 3 (Shared)
    "Dry / Hot Skin",         // 4
    "Shivering",              // 5
    "Cold Skin",              // 6
    "Slow Breathing",         // 7
    "Fatigue"                 // 8
]

// HEAT DATASET (mapped to [high_temp, sweating, dizziness, confusion, dry_skin])
const HEAT_X = [
    [1,1,1,1,0], // Heat Stroke
    [1,0,1,1,1], // Severe Heat Stroke
    [1,1,1,0,0], // Heat Exhaustion
    [0,0,0,0,0], // Normal
    [1,1,1,1,1], // Heat Stroke (alternative from user data)
    [0,0,0,0,0], // Healthy
    [1,1,1,1,1], // Severe Heat Stroke (alternative)
    [0,0,0,0,0]  // Normal
]

const HEAT_Y = [
    "Heat Stroke",
    "Severe Heat Stroke",
    "Heat Exhaustion",
    "Normal",
    "Heat Stroke",
    "Healthy",
    "Severe Heat Stroke",
    "Normal"
]

// WINTER DATASET (mapped to [shivering, cold_skin, confusion, slow_breath, fatigue])
const WINTER_X = [
    [1,1,0,0,1], // Mild Hypothermia
    [1,1,1,1,1], // Severe Hypothermia
    [0,1,0,0,0], // Cold Exposure
    [1,1,1,1,1], // Hypothermia (alternative)
    [0,0,0,0,0], // Normal
    [0,0,0,0,0], // Healthy
    [1,1,1,1,1], // Severe Hypothermia
    [0,0,0,0,0]  // Normal
]

const WINTER_Y = [
    "Mild Hypothermia",
    "Severe Hypothermia",
    "Cold Exposure",
    "Hypothermia",
    "Normal",
    "Healthy",
    "Severe Hypothermia",
    "Normal"
]

export const REMEDIES = {
    // Heat Remedies
    "Heat Stroke": "Move to cool place, drink ORS/water, apply wet cloth.",
    "Severe Heat Stroke": "EMERGENCY: Call 108, cool body immediately with ice packs.",
    "Heat Exhaustion": "Rest, drink fluids, ORS.",
    "Normal": "Stay hydrated.",
    "Healthy": "No issue.",
    
    // Winter Remedies
    "Mild Hypothermia": "Warm clothes, hot drinks, stay indoors.",
    "Hypothermia": "Warm slowly using blankets, avoid direct heat.",
    "Severe Hypothermia": "EMERGENCY: Call ambulance, wrap in blankets.",
    "Cold Exposure": "Warm environment, drink warm fluids."
}

function hammingDistance(a, b) {
  let dist = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) dist++
  }
  return dist
}

/**
 * Predicts whether the condition is heat or cold related by checking both datasets.
 * userInput maps to the 9 SYMPTOMS.
 */
export function predictDisease(userInput) {
    // 1. Extract specifically for HEAT
    const heatInput = [
        userInput[0], // High Body Temp
        userInput[1], // Sweating
        userInput[2], // Dizziness
        userInput[3], // Confusion (shared)
        userInput[4]  // Dry/Hot Skin
    ]

    // 2. Extract specifically for WINTER
    const winterInput = [
        userInput[5], // Shivering
        userInput[6], // Cold Skin
        userInput[3], // Confusion (shared)
        userInput[7], // Slow Breathing
        userInput[8]  // Fatigue
    ]

    // Predict Heat Minimum Distance
    let minHeatDist = Infinity
    let bestHeatIndex = 0
    HEAT_X.forEach((row, i) => {
        const dist = hammingDistance(heatInput, row)
        if (dist < minHeatDist) {
            minHeatDist = dist
            bestHeatIndex = i
        }
    })

    // Predict Winter Minimum Distance
    let minWinterDist = Infinity
    let bestWinterIndex = 0
    WINTER_X.forEach((row, i) => {
        const dist = hammingDistance(winterInput, row)
        if (dist < minWinterDist) {
            minWinterDist = dist
            bestWinterIndex = i
        }
    })

    // If both are absolutely 0 (no symptoms), return Healthy
    if (userInput.every(v => v === 0)) {
        return { disease: "Healthy", remedy: "No issue.", warning: null }
    }

    // Determine which domain won
    let winner = "Normal"
    if (minHeatDist < minWinterDist) {
        winner = HEAT_Y[bestHeatIndex]
    } else if (minWinterDist < minHeatDist) {
        winner = WINTER_Y[bestWinterIndex]
    } else {
        // If tied distance, we weigh by the number of active symptoms in each domain
        const heatSum = heatInput.reduce((a, b) => a + b, 0)
        const winterSum = winterInput.reduce((a, b) => a + b, 0)
        
        if (heatSum > winterSum) {
            winner = HEAT_Y[bestHeatIndex]
        } else if (winterSum > heatSum) {
            winner = WINTER_Y[bestWinterIndex]
        } else {
            // Ultimate tiebreaker fallback, fallback to Normal
            winner = HEAT_Y[bestHeatIndex] === "Healthy" || HEAT_Y[bestHeatIndex] === "Normal" 
                ? WINTER_Y[bestWinterIndex] 
                : HEAT_Y[bestHeatIndex];
        }
    }

    const disease = winner
    const remedy = REMEDIES[disease] ?? "Monitor symptoms."

    // Assign Warnings based on Python scripts
    let warning = null
    if (disease === "Severe Heat Stroke") {
        warning = "EMERGENCY: Can be fatal. Cool body + call ambulance immediately."
    } else if (["Heat Stroke", "Heat Exhaustion"].includes(disease)) {
        warning = "Avoid sun exposure, stay hydrated."
    } else if (disease === "Severe Hypothermia") {
        warning = "EMERGENCY: Life-threatening. Immediate medical help needed."
    } else if (["Hypothermia", "Mild Hypothermia", "Cold Exposure"].includes(disease)) {
        warning = "Avoid cold exposure, keep body warm."
    }

    return { disease, remedy, warning }
}
