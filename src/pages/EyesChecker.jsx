import { useState } from 'react'
import './EyesChecker.css'
import { SYMPTOMS, predictDisease } from './eyesModel'

/* ── Severity metadata per predicted disease ─────────────── */
const SEVERITY = {
  'Conjunctivitis':   { level: 'moderate', label: '⚠ Moderate' },
  'Dry Eyes':         { level: 'mild',     label: '✓ Mild' },
  'Glaucoma':         { level: 'serious',  label: '🚨 Serious – See Doctor' },
  'Eye Strain':       { level: 'mild',     label: '✓ Mild' },
  'Cataract':         { level: 'moderate', label: '⚠ Consult Doctor' },
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
      <div className="ec-result-wrapper">
        <div className="ec-result-header">
          <button className="ec-back-btn" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
          <span className="ec-title">Eyes Checker</span>
        </div>

        <div className="ec-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBotton: '14px' }}>👁️</div>
          <div className="ec-result-disease">No Symptoms Detected</div>
          <div className="ec-divider" />
          <p className="ec-remedy-text">
            You haven't reported any significant eye symptoms. That's great!
            However, please consult an eye doctor if irritation, pain, or redness increases over time.
          </p>
        </div>

        <div className="ec-result-actions">
          <button className="ec-restart-btn" onClick={onRestart}>
            🔄 Try Again
          </button>
          <button className="ec-home-btn" onClick={onBack}>
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
    <div className="ec-result-wrapper">

      {/* Header */}
      <div className="ec-result-header">
        <button className="ec-back-btn" onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <span className="ec-title">Your Result</span>
      </div>

      {/* Diagnosis card */}
      <div className="ec-result-card">
        <div className="ec-result-label">Possible Condition</div>
        <div className="ec-result-disease">{disease}</div>

        {/* Severity chip */}
        <span className={`ec-severity-chip ${sev.level}`}>
          {sev.label}
        </span>

        <div className="ec-divider" />

        {/* Remedy */}
        <div className="ec-remedy-label">Suggested Action</div>
        <p className="ec-remedy-text">{remedy}</p>
      </div>

      {/* Symptom summary */}
      <div className="ec-symptom-summary">
        <div className="ec-symptom-summary-title">Your Symptoms</div>
        <div className="ec-symptom-pills">
          {presentSymptoms.map(s => (
            <span key={s} className="ec-symptom-pill present">{s}</span>
          ))}
          {absentSymptoms.map(s => (
            <span key={s} className="ec-symptom-pill absent">{s}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="ec-result-actions">
        <button className="ec-restart-btn" onClick={onRestart}>
          🔄 Retake Quiz
        </button>
        <button className="ec-home-btn" onClick={onBack}>
          ← Back to Categories
        </button>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SCREEN  (one symptom slide at a time)
   ═══════════════════════════════════════════════════════════ */
export default function EyesChecker({ onBack }) {
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
    <div className="ec-wrapper">

      {/* Header */}
      <div className="ec-header">
        <button
          className="ec-back-btn"
          onClick={step === 0 ? onBack : goPrev}
          aria-label={step === 0 ? 'Back to categories' : 'Previous question'}
        >
          ← {step === 0 ? 'Back' : 'Prev'}
        </button>
        <span className="ec-title">Eyes Checker</span>
      </div>

      {/* Progress bar */}
      <div className="ec-progress-wrap" role="progressbar"
           aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        <div className="ec-progress-label">
          <span>Question {step + 1} of {total}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="ec-progress-track">
          <div className="ec-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card — key re-mounts on every slide change to replay animation */}
      <div className="ec-card" key={slideKey}>
        {/* Symptom badge */}
        <div className="ec-symptom-badge">
          👁️ Eyes · Symptom {step + 1}
        </div>

        {/* Question */}
        <p className="ec-question">
          Do you have <strong>{SYMPTOMS[step]}</strong>?
        </p>

        {/* Yes / No */}
        <div className="ec-choices">
          <button
            id={`ec-yes-${step}`}
            className={`ec-choice-btn yes${current === 1 ? ' selected' : ''}`}
            onClick={() => handleChoice(1)}
            aria-pressed={current === 1}
          >
            <span className="ec-choice-icon">{YES_ICON}</span>
            Yes
          </button>

          <button
            id={`ec-no-${step}`}
            className={`ec-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
            aria-pressed={current === 0}
          >
            <span className="ec-choice-icon">{NO_ICON}</span>
            No
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="ec-nav">
        <button
          className="ec-nav-btn"
          onClick={goPrev}
          disabled={step === 0}
          aria-label="Previous question"
        >
          ← Prev
        </button>

        <button
          className="ec-next-btn"
          onClick={goNext}
          disabled={!canProceed}
          aria-label={isLastSlide ? 'See results' : 'Next question'}
        >
          {isLastSlide ? 'See Results →' : 'Next →'}
        </button>
      </div>

      {/* Dot indicators */}
      <div className="ec-dots" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              'ec-dot' +
              (i === step        ? ' current'  : '') +
              (answers[i] !== null && i !== step ? ' answered' : '')
            }
          />
        ))}
      </div>

    </div>
  )
}
