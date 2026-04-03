import { useState } from 'react'
import './AllergyChecker.css'
import { SYMPTOMS, predictDisease } from './allergyModel'

/* ── Severity metadata per predicted disease ─────────────── */
const SEVERITY = {
  'Mild Allergy':              { level: 'mild',     label: '✓ Mild' },
  'Dust Allergy':              { level: 'moderate', label: '⚠ Moderate' },
  'Pollen Allergy':            { level: 'moderate', label: '⚠ Moderate' },
  'Food Allergy':              { level: 'moderate', label: '⚠ Moderate – Avoid specific foods' },
  'Insect Sting Allergy':      { level: 'moderate', label: '⚠ Moderate – Treat immediately' },
  'Severe Allergic Reaction':  { level: 'serious',  label: '🚨 EMERGENCY – Go to Hospital' },
}

/* ── Icons shown on Yes / No buttons ────────────────────── */
const YES_ICON = '✓'
const NO_ICON  = '✗'

/* ═══════════════════════════════════════════════════════════
   RESULT SCREEN
   ═══════════════════════════════════════════════════════════ */
function ResultScreen({ answers, onRestart, onBack }) {
  const allZero = answers.every(a => a === 0)

  /* ── No-symptom edge case ──────────────────────────────── */
  if (allZero) {
    return (
      <div className="alc-result-wrapper">
        <div className="alc-result-header">
          <button className="alc-back-btn" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
          <span className="alc-title">Allergy Checker</span>
        </div>

        <div className="alc-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>🤧</div>
          <div className="alc-result-disease">No Symptoms Detected</div>
          <div className="alc-divider" />
          <p className="alc-remedy-text">
            You haven't reported any allergy-like symptoms. That's great!
            Enjoy your normal routine and maintain general hygiene.
          </p>
        </div>

        <div className="alc-result-actions">
          <button className="alc-restart-btn" onClick={onRestart}>
            🔄 Try Again
          </button>
          <button className="alc-home-btn" onClick={onBack}>
            ← Back to Categories
          </button>
        </div>
      </div>
    )
  }

  /* ── Standard result ───────────────────────────────────── */
  const { disease, remedy } = predictDisease(answers)
  const sev = SEVERITY[disease] ?? { level: 'moderate', label: '⚠ Moderate' }
  const presentSymptoms = SYMPTOMS.filter((_, i) => answers[i] === 1)
  const absentSymptoms  = SYMPTOMS.filter((_, i) => answers[i] === 0)

  return (
    <div className="alc-result-wrapper">

      {/* Header */}
      <div className="alc-result-header">
        <button className="alc-back-btn" onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <span className="alc-title">Your Result</span>
      </div>

      {/* Diagnosis card */}
      <div className="alc-result-card">
        <div className="alc-result-label">Possible Condition</div>
        <div className="alc-result-disease">{disease}</div>

        {/* Severity chip */}
        <span className={`alc-severity-chip ${sev.level}`}>
          {sev.label}
        </span>

        <div className="alc-divider" />

        {/* Remedy */}
        <div className="alc-remedy-label">Suggested Action</div>
        <p className="alc-remedy-text" style={{ whiteSpace: 'pre-line' }}>{remedy}</p>
      </div>

      {/* Symptom summary */}
      <div className="alc-symptom-summary">
        <div className="alc-symptom-summary-title">Your Symptoms</div>
        <div className="alc-symptom-pills">
          {presentSymptoms.map(s => (
            <span key={s} className="alc-symptom-pill present">{s}</span>
          ))}
          {absentSymptoms.map(s => (
            <span key={s} className="alc-symptom-pill absent">{s}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="alc-result-actions">
        <button className="alc-restart-btn" onClick={onRestart}>
          🔄 Retake Quiz
        </button>
        <button className="alc-home-btn" onClick={onBack}>
          ← Back to Categories
        </button>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SCREEN  (one symptom slide at a time)
   ═══════════════════════════════════════════════════════════ */
export default function AllergyChecker({ onBack }) {
  const total = SYMPTOMS.length

  // answers[i] = null (not yet answered) | 0 (No) | 1 (Yes)
  const [answers, setAnswers]     = useState(Array(total).fill(null))
  const [step, setStep]           = useState(0)
  const [showResult, setShowResult] = useState(false)
  // slideKey forces CSS re-animation when slide changes
  const [slideKey, setSlideKey]   = useState(0)

  /* ── Handlers ──────────────────────────────────────────── */
  function handleChoice(value) {
    setAnswers(prev => {
      const next = [...prev]
      next[step] = value
      return next
    })
  }

  function goNext() {
    if (step < total - 1) {
      setStep(s => s + 1)
      setSlideKey(k => k + 1)
    } else {
      // Final slide → show result
      // Any remaining null treated as 0 (no symptom)
      setAnswers(prev => prev.map(a => (a === null ? 0 : a)))
      setShowResult(true)
    }
  }

  function goPrev() {
    if (step > 0) {
      setStep(s => s - 1)
      setSlideKey(k => k + 1)
    }
  }

  function restart() {
    setAnswers(Array(total).fill(null))
    setStep(0)
    setSlideKey(k => k + 1)
    setShowResult(false)
  }

  /* ── Result screen ─────────────────────────────────────── */
  if (showResult) {
    const finalAnswers = answers.map(a => (a === null ? 0 : a))
    return (
      <ResultScreen
        answers={finalAnswers}
        onRestart={restart}
        onBack={onBack}
      />
    )
  }

  /* ── Quiz screen ───────────────────────────────────────── */
  const current     = answers[step]           // null | 0 | 1
  const canProceed  = current !== null
  const isLastSlide = step === total - 1
  const progress    = ((step + (canProceed ? 1 : 0)) / total) * 100

  return (
    <div className="alc-wrapper">

      {/* Header */}
      <div className="alc-header">
        <button
          className="alc-back-btn"
          onClick={step === 0 ? onBack : goPrev}
          aria-label={step === 0 ? 'Back to categories' : 'Previous question'}
        >
          ← {step === 0 ? 'Back' : 'Prev'}
        </button>
        <span className="alc-title">Allergy Checker</span>
      </div>

      {/* Progress bar */}
      <div className="alc-progress-wrap" role="progressbar"
           aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        <div className="alc-progress-label">
          <span>Question {step + 1} of {total}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="alc-progress-track">
          <div className="alc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card — key re-mounts on every slide change to replay animation */}
      <div className="alc-card" key={slideKey}>
        {/* Symptom badge */}
        <div className="alc-symptom-badge">
          🤧 Allergy · Symptom {step + 1}
        </div>

        {/* Question */}
        <p className="alc-question">
          Do you have <strong>{SYMPTOMS[step]}</strong>?
        </p>

        {/* Yes / No */}
        <div className="alc-choices">
          <button
            id={`alc-yes-${step}`}
            className={`alc-choice-btn yes${current === 1 ? ' selected' : ''}`}
            onClick={() => handleChoice(1)}
            aria-pressed={current === 1}
          >
            <span className="alc-choice-icon">{YES_ICON}</span>
            Yes
          </button>

          <button
            id={`alc-no-${step}`}
            className={`alc-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
            aria-pressed={current === 0}
          >
            <span className="alc-choice-icon">{NO_ICON}</span>
            No
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="alc-nav">
        <button
          className="alc-nav-btn"
          onClick={goPrev}
          disabled={step === 0}
          aria-label="Previous question"
        >
          ← Prev
        </button>

        <button
          className="alc-next-btn"
          onClick={goNext}
          disabled={!canProceed}
          aria-label={isLastSlide ? 'See results' : 'Next question'}
        >
          {isLastSlide ? 'See Results →' : 'Next →'}
        </button>
      </div>

      {/* Dot indicators */}
      <div className="alc-dots" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              'alc-dot' +
              (i === step        ? ' current'  : '') +
              (answers[i] !== null && i !== step ? ' answered' : '')
            }
          />
        ))}
      </div>

    </div>
  )
}
