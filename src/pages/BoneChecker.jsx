import { useState } from 'react'
import './BoneChecker.css'
import { SYMPTOMS, predictDisease } from './boneModel'

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
      <div className="bc-result-wrapper">
        <div className="bc-result-header">
          <button className="bc-back-btn" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
          <span className="bc-title">Bone Assessment</span>
        </div>

        <div className="bc-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>🦴</div>
          <div className="bc-result-disease">No Symptoms Detected</div>
          <div className="bc-divider" />
          <p className="bc-remedy-text">
            You haven't reported any significant bone-related symptoms. That's great!
            However, if you feel persistent pain or stiffness later, please consult a doctor.
          </p>
        </div>

        <div className="bc-result-actions">
          <button className="bc-restart-btn" onClick={onRestart}>
            🔄 Try Again
          </button>
          <button className="bc-home-btn" onClick={onBack}>
            ← Back to Categories
          </button>
        </div>
      </div>
    )
  }

  /* ── Standard result ───────────────────────────────────── */
  const { disease, remedy, severity, severityLabel } = predictDisease(answers)
  const presentSymptoms = SYMPTOMS.filter((_, i) => answers[i] === 1)
  const absentSymptoms  = SYMPTOMS.filter((_, i) => answers[i] === 0)

  return (
    <div className="bc-result-wrapper">

      {/* Header */}
      <div className="bc-result-header">
        <button className="bc-back-btn" onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <span className="bc-title">Your Result</span>
      </div>

      {/* Diagnosis card */}
      <div className="bc-result-card">
        <div className="bc-result-label">Possible Condition</div>
        <div className="bc-result-disease">{disease}</div>

        {/* Severity chip */}
        <span className={`bc-severity-chip ${severity}`}>
          {severityLabel}
        </span>

        <div className="bc-divider" />

        {/* Remedy */}
        <div className="bc-remedy-label">Suggested Action</div>
        <p className="bc-remedy-text">{remedy}</p>
      </div>

      {/* Symptom summary */}
      <div className="bc-symptom-summary">
        <div className="bc-symptom-summary-title">Your Symptoms</div>
        <div className="bc-symptom-pills">
          {presentSymptoms.map(s => (
            <span key={s} className="bc-symptom-pill present">{s}</span>
          ))}
          {absentSymptoms.map(s => (
            <span key={s} className="bc-symptom-pill absent">{s}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bc-result-actions">
        <button className="bc-restart-btn" onClick={onRestart}>
          🔄 Retake Quiz
        </button>
        <button className="bc-home-btn" onClick={onBack}>
          ← Back to Categories
        </button>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SCREEN  (one symptom slide at a time)
   ═══════════════════════════════════════════════════════════ */
export default function BoneChecker({ onBack }) {
  const total = SYMPTOMS.length

  // answers[i] = null (not yet answered) | 0 (No) | 1 (Yes)
  const [answers, setAnswers]     = useState(Array(total).fill(null))
  const [step, setStep]           = useState(0)
  const [showResult, setShowResult] = useState(false)
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

  const current     = answers[step]
  const canProceed  = current !== null
  const isLastSlide = step === total - 1
  const progress    = ((step + (canProceed ? 1 : 0)) / total) * 100

  return (
    <div className="bc-wrapper">

      <div className="bc-header">
        <button
          className="bc-back-btn"
          onClick={step === 0 ? onBack : goPrev}
          aria-label={step === 0 ? 'Back to categories' : 'Previous question'}
        >
          ← {step === 0 ? 'Back' : 'Prev'}
        </button>
        <span className="bc-title">Bone Assessment</span>
      </div>

      <div className="bc-progress-wrap" role="progressbar">
        <div className="bc-progress-label">
          <span>Symptom {step + 1} of {total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="bc-progress-track">
          <div className="bc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bc-card" key={slideKey}>
        <div className="bc-symptom-badge">
          🦴 Bones · Question {step + 1}
        </div>

        <p className="bc-question">
          Do you have <strong>{SYMPTOMS[step]}</strong>?
        </p>

        <div className="bc-choices">
          <button
            className={`bc-choice-btn yes${current === 1 ? ' selected' : ''}`}
            onClick={() => handleChoice(1)}
          >
            <span className="bc-choice-icon">{YES_ICON}</span>
            Yes
          </button>

          <button
            className={`bc-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
          >
            <span className="bc-choice-icon">{NO_ICON}</span>
            No
          </button>
        </div>
      </div>

      <div className="bc-nav">
        <button className="bc-nav-btn" onClick={goPrev} disabled={step === 0}>
          ← Prev
        </button>

        <button className="bc-next-btn" onClick={goNext} disabled={!canProceed}>
          {isLastSlide ? 'See Results →' : 'Next →'}
        </button>
      </div>

      <div className="bc-dots">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              'bc-dot' +
              (i === step ? ' current' : '') +
              (answers[i] !== null && i !== step ? ' answered' : '')
            }
          />
        ))}
      </div>

    </div>
  )
}
