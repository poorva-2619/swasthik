/* =========================================================
   bleedingModel.js – Bleeding problems engine (JS port)
   Translates the Python weighted dot product scoring model.
   ========================================================= */

export const SYMPTOMS = [
    "Deep cut, open wound, or visible injury",
    "Heavy, spurting, or uncontrolled bleeding",
    "Bleeding that persists after 10 mins of pressure",
    "Bleeding from the nose",
    "Vomiting blood or bloody/black stools",
    "Frequent bleeding from gums or minor scratches",
    "Unexplained large bruises on the body",
    "Severe dizziness, weakness, or pale skin"
]

const CONDITIONS = [
    {
        name: "Laceration (Deep Cut)",
        weights: [1.0, 0.4, 0.2, 0.0, 0.0, 0.0, 0.0, 0.1]
    },
    {
        name: "Severe Hemorrhage / Trauma",
        weights: [1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]
    },
    {
        name: "Epistaxis (Nosebleed)",
        weights: [0.0, 0.0, 0.2, 1.0, 0.0, 0.0, 0.0, 0.0]
    },
    {
        name: "Gastrointestinal (Internal) Bleeding",
        weights: [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.8]
    },
    {
        name: "Possible Bleeding Disorder",
        weights: [0.0, 0.0, 0.5, 0.4, 0.0, 1.0, 1.0, 0.2]
    }
]

export const REMEDIES = {
    "Laceration (Deep Cut)": "- Rinse the cut gently with clean water.\n- Apply direct pressure with a clean cloth for 10–15 minutes.\n- Cover with a sterile bandage (like Band-Aid or Leukoplast).\n- Seek stitches at a nearby clinic if the cut is deep, gaping, or over a joint.\n- Get a Tetanus shot if you haven't had one in the last 5 years.",
    "Severe Hemorrhage / Trauma": "🚨 EMERGENCY: Severe blood loss detected.\n- Do NOT remove any embedded objects.\n- Apply FIRM, continuous pressure directly on the wound using a clean thick cloth.\n- Elevate the bleeding area above the heart if possible.\n- Keep the patient warm and lying down to prevent shock.\n- Call 108 (Ambulance) or go to the emergency room IMMEDIATELY.",
    "Epistaxis (Nosebleed)": "- Sit upright and lean slightly FORWARD (not backward, to prevent swallowing blood).\n- Firmly pinch the soft part of the nose for 10–15 continuous minutes.\n- Breathe through your mouth.\n- Apply an ice pack wrapped in a cloth to the bridge of the nose.\n- If bleeding doesn't stop after 20 minutes, seek medical care.",
    "Gastrointestinal (Internal) Bleeding": "🚨 EMERGENCY: Internal bleeding suspected.\n- Do NOT eat, drink, or take any oral medications.\n- Lie down, rest, and try to stay calm.\n- Do NOT take pain relievers like Aspirin or Ibuprofen.\n- Go to the nearest hospital Emergency Room immediately for endoscopy/scans.",
    "Possible Bleeding Disorder": "⚠️ Consult a Hematologist or Physician.\n- Prolonged bleeding or unexplained bruising can indicate platelet or clotting issues (like Dengue, Hemophilia, or vitamin deficiencies).\n- Avoid blood thinners (like Aspirin) unless prescribed.\n- Get a Complete Blood Count (CBC) and Coagulation Profile (PT/INR, aPTT) done at a lab."
}

/**
 * Predicts the most likely bleeding condition using weighted dot product scoring.
 */
export function predictDisease(userInput) {
    if (userInput.every(v => v === 0)) {
        return { disease: "Healthy", remedy: "No symptoms reported. Keep a first-aid kit handy.", warning: null, confidence: 1 }
    }

    let bestName = "Unknown"
    let bestScore = -1

    for (const condition of CONDITIONS) {
        let rawScore = 0
        let maxScore = 0

        for (let i = 0; i < userInput.length; i++) {
            rawScore += userInput[i] * condition.weights[i]
            maxScore += condition.weights[i]
        }

        const normalized = maxScore > 0 ? rawScore / maxScore : 0.0

        if (normalized > bestScore) {
            bestScore = normalized
            bestName = condition.name
        }
    }

    let warning = null
    let remedy = REMEDIES[bestName] ?? "Monitor symptoms and consult a doctor."

    if (bestScore < 0.4) {
        bestName = "Uncertain / Undiagnosed"
        remedy = "Prediction is uncertain based on given symptoms."
        warning = "Please consult a doctor immediately for proper diagnosis."
    } else if (bestName === "Gastrointestinal Bleeding") {
        warning = "EMERGENCY: Visit a hospital immediately."
    } else if (bestName === "Bleeding Disorder / Coagulopathy") {
        warning = "WARNING: May indicate a serious underlying condition."
    }

    warning = warning ? warning + "\n\n⚠️ Disclaimer: This tool is for first-aid guidance only. Always consult a qualified medical professional for proper treatment." : "⚠️ Disclaimer: This tool is for first-aid guidance only. Always consult a qualified medical professional for proper treatment."

    return { 
        disease: bestName, 
        remedy: remedy, 
        warning: warning, 
        confidence: bestScore 
    }
}
