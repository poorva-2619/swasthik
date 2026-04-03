import { useState } from 'react'
import './SkinChecker.css'
import { SYMPTOMS, predictDisease } from './skinModel'

/* ── Severity metadata per predicted disease ─────────────── */
const SEVERITY = {
  'Scabies':               { level: 'moderate', label: '⚠ Contagious - Treat Promptly' },
  'Fungal Infection':      { level: 'mild',     label: '✓ Treatable' },
  'Eczema':                { level: 'mild',     label: '✓ Manageable' },
  'Uncertain Diagnosis':   { level: 'moderate', label: '⚠ Consult Doctor' },
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
      <div className="skc-result-wrapper">
        <div className="skc-result-header">
          <button className="skc-back-btn" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
          <span className="skc-title">Skin Checker</span>
        </div>

        <div className="skc-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>🩹</div>
          <div className="skc-result-disease">No Symptoms Detected</div>
          <div className="skc-divider" />
          <p className="skc-remedy-text">
            You haven't reported any primary dermatological issues. 
            Maintain a good skincare routine, stay hydrated, and use sunscreen!
          </p>
        </div>

        <div className="skc-result-actions">
          <button className="skc-restart-btn" onClick={onRestart}>
            🔄 Try Again
          </button>
          <button className="skc-home-btn" onClick={onBack}>
            ← Back to Categories
          </button>
        </div>
      </div>
    )
  }

  /* ── Standard result ───────────────────────────────────── */
  const { disease, remedy, confidence } = predictDisease(answers)
  const sev = SEVERITY[disease] ?? { level: 'moderate', label: '⚠ Manage condition' }
  const presentSymptoms = SYMPTOMS.filter((_, i) => answers[i] === 1)
  const absentSymptoms  = SYMPTOMS.filter((_, i) => answers[i] === 0)

  return (
    <div className="skc-result-wrapper">

      {/* Header */}
      <div className="skc-result-header">
        <button className="skc-back-btn" onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <span className="skc-title">Your Result</span>
      </div>

      {/* Diagnosis card */}
      <div className="skc-result-card">
        <div className="skc-result-label">Predicted Condition</div>
        <div className="skc-result-disease">{disease}</div>

        {/* Severity chip */}
        <span className={`skc-severity-chip ${sev.level}`}>
          {sev.label}
        </span>
        
        {disease !== "Uncertain Diagnosis" && (
            <div style={{fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "-10px", marginBottom: "15px"}}>
                Confidence: {Math.round(confidence * 100)}%
            </div>
        )}

        <div className="skc-divider" />

        {/* Remedy */}
        <div className="skc-remedy-label">Action Plan</div>
        <p className="skc-remedy-text" style={{ whiteSpace: 'pre-line' }}>{remedy}</p>
      </div>

      {/* Symptom summary */}
      <div className="skc-symptom-summary">
        <div className="skc-symptom-summary-title">Your Symptoms</div>
        <div className="skc-symptom-pills">
          {presentSymptoms.map(s => (
            <span key={s} className="skc-symptom-pill present">{s}</span>
          ))}
          {absentSymptoms.map(s => (
            <span key={s} className="skc-symptom-pill absent">{s}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="skc-result-actions">
        <button className="skc-restart-btn" onClick={onRestart}>
          🔄 Retake Quiz
        </button>
        <button className="skc-home-btn" onClick={onBack}>
          ← Back to Categories
        </button>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SCREEN  (one symptom slide at a time)
   ═══════════════════════════════════════════════════════════ */
export default function SkinChecker({ onBack }) {
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
    <div className="skc-wrapper">

      {/* Header */}
      <div className="skc-header">
        <button
          className="skc-back-btn"
          onClick={step === 0 ? onBack : goPrev}
          aria-label={step === 0 ? 'Back to categories' : 'Previous question'}
        >
          ← {step === 0 ? 'Back' : 'Prev'}
        </button>
        <span className="skc-title">Skin Checker</span>
      </div>

      {/* Progress bar */}
      <div className="skc-progress-wrap" role="progressbar"
           aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        <div className="skc-progress-label">
          <span>Question {step + 1} of {total}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="skc-progress-track">
          <div className="skc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card — key re-mounts on every slide change to replay animation */}
      <div className="skc-card" key={slideKey}>
        {/* Symptom badge */}
        <div className="skc-symptom-badge">
          🩹 Skin · Symptom {step + 1}
        </div>

        {/* Question */}
        <p className="skc-question">
          Do you have <strong>{SYMPTOMS[step]}</strong>?
        </p>

        {/* Yes / No */}
        <div className="skc-choices">
          <button
            id={`skc-yes-${step}`}
            className={`skc-choice-btn yes${current === 1 ? ' selected' : ''}`}
            onClick={() => handleChoice(1)}
            aria-pressed={current === 1}
          >
            <span className="skc-choice-icon">{YES_ICON}</span>
            Yes
          </button>

          <button
            id={`skc-no-${step}`}
            className={`skc-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
            aria-pressed={current === 0}
          >
            <span className="skc-choice-icon">{NO_ICON}</span>
            No
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="skc-nav">
        <button
          className="skc-nav-btn"
          onClick={goPrev}
          disabled={step === 0}
          aria-label="Previous question"
        >
          ← Prev
        </button>

        <button
          className="skc-next-btn"
          onClick={goNext}
          disabled={!canProceed}
          aria-label={isLastSlide ? 'See results' : 'Next question'}
        >
          {isLastSlide ? 'See Results →' : 'Next →'}
        </button>
      </div>

      {/* Dot indicators */}
      <div className="skc-dots" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              'skc-dot' +
              (i === step        ? ' current'  : '') +
              (answers[i] !== null && i !== step ? ' answered' : '')
            }
          />
        ))}
      </div>

    </div>
  )
}
