import { useState } from 'react'
import './NoseChecker.css'
import { SYMPTOMS, predictDisease } from './noseModel'

/* ── Severity metadata per predicted disease ─────────────── */
const SEVERITY = {
  'Common Cold':           { level: 'mild',     label: '✓ Mild' },
  'Allergic Rhinitis':     { level: 'mild',     label: '✓ Mild allergy' },
  'Sinusitis':             { level: 'moderate', label: '⚠ Moderate' },
  'Flu':                   { level: 'moderate', label: '⚠ Moderate – Monitor fever' },
  'Nasal Infection':       { level: 'serious',  label: '🚨 Consult Doctor' },
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
      <div className="nc-result-wrapper">
        <div className="nc-result-header">
          <button className="nc-back-btn" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
          <span className="nc-title">Nose Checker</span>
        </div>

        <div className="nc-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>👃</div>
          <div className="nc-result-disease">No Symptoms Detected</div>
          <div className="nc-divider" />
          <p className="nc-remedy-text">
            You haven't reported any primary nasal issues. Your respiratory and olfactory 
            health appears clear within these parameters! Let's keep it that way.
          </p>
        </div>

        <div className="nc-result-actions">
          <button className="nc-restart-btn" onClick={onRestart}>
            🔄 Try Again
          </button>
          <button className="nc-home-btn" onClick={onBack}>
            ← Back to Categories
          </button>
        </div>
      </div>
    )
  }

  /* ── Standard result ───────────────────────────────────── */
  const { disease, remedy } = predictDisease(answers)
  const sev = SEVERITY[disease] ?? { level: 'moderate', label: '⚠ Manage condition' }
  const presentSymptoms = SYMPTOMS.filter((_, i) => answers[i] === 1)
  const absentSymptoms  = SYMPTOMS.filter((_, i) => answers[i] === 0)

  return (
    <div className="nc-result-wrapper">

      {/* Header */}
      <div className="nc-result-header">
        <button className="nc-back-btn" onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <span className="nc-title">Your Result</span>
      </div>

      {/* Diagnosis card */}
      <div className="nc-result-card">
        <div className="nc-result-label">Predicted Condition</div>
        <div className="nc-result-disease">{disease}</div>

        {/* Severity chip */}
        <span className={`nc-severity-chip ${sev.level}`}>
          {sev.label}
        </span>

        <div className="nc-divider" />

        {/* Remedy */}
        <div className="nc-remedy-label">Action Plan</div>
        <p className="nc-remedy-text" style={{ whiteSpace: 'pre-line' }}>{remedy}</p>
      </div>

      {/* Symptom summary */}
      <div className="nc-symptom-summary">
        <div className="nc-symptom-summary-title">Your Symptoms</div>
        <div className="nc-symptom-pills">
          {presentSymptoms.map(s => (
            <span key={s} className="nc-symptom-pill present">{s}</span>
          ))}
          {absentSymptoms.map(s => (
            <span key={s} className="nc-symptom-pill absent">{s}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="nc-result-actions">
        <button className="nc-restart-btn" onClick={onRestart}>
          🔄 Retake Quiz
        </button>
        <button className="nc-home-btn" onClick={onBack}>
          ← Back to Categories
        </button>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SCREEN  (one symptom slide at a time)
   ═══════════════════════════════════════════════════════════ */
export default function NoseChecker({ onBack }) {
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
    <div className="nc-wrapper">

      {/* Header */}
      <div className="nc-header">
        <button
          className="nc-back-btn"
          onClick={step === 0 ? onBack : goPrev}
          aria-label={step === 0 ? 'Back to categories' : 'Previous question'}
        >
          ← {step === 0 ? 'Back' : 'Prev'}
        </button>
        <span className="nc-title">Nose Checker</span>
      </div>

      {/* Progress bar */}
      <div className="nc-progress-wrap" role="progressbar"
           aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        <div className="nc-progress-label">
          <span>Question {step + 1} of {total}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="nc-progress-track">
          <div className="nc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card — key re-mounts on every slide change to replay animation */}
      <div className="nc-card" key={slideKey}>
        {/* Symptom badge */}
        <div className="nc-symptom-badge">
          👃 Nose · Symptom {step + 1}
        </div>

        {/* Question */}
        <p className="nc-question">
          Do you have <strong>{SYMPTOMS[step]}</strong>?
        </p>

        {/* Yes / No */}
        <div className="nc-choices">
          <button
            id={`nc-yes-${step}`}
            className={`nc-choice-btn yes${current === 1 ? ' selected' : ''}`}
            onClick={() => handleChoice(1)}
            aria-pressed={current === 1}
          >
            <span className="nc-choice-icon">{YES_ICON}</span>
            Yes
          </button>

          <button
            id={`nc-no-${step}`}
            className={`nc-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
            aria-pressed={current === 0}
          >
            <span className="nc-choice-icon">{NO_ICON}</span>
            No
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="nc-nav">
        <button
          className="nc-nav-btn"
          onClick={goPrev}
          disabled={step === 0}
          aria-label="Previous question"
        >
          ← Prev
        </button>

        <button
          className="nc-next-btn"
          onClick={goNext}
          disabled={!canProceed}
          aria-label={isLastSlide ? 'See results' : 'Next question'}
        >
          {isLastSlide ? 'See Results →' : 'Next →'}
        </button>
      </div>

      {/* Dot indicators */}
      <div className="nc-dots" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              'nc-dot' +
              (i === step        ? ' current'  : '') +
              (answers[i] !== null && i !== step ? ' answered' : '')
            }
          />
        ))}
      </div>

    </div>
  )
}
