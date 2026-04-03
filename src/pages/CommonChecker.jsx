import { useState } from 'react'
import './CommonChecker.css'
import { SYMPTOMS, predictDisease } from './commonModel'

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
      <div className="cc-result-wrapper">
        <div className="cc-result-header">
          <button className="cc-back-btn" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
          <span className="cc-title">Common Diseases</span>
        </div>

        <div className="cc-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>💊</div>
          <div className="cc-result-disease">Condition: Healthy</div>
          <div className="cc-divider" />
          <p className="cc-remedy-text">
            No symptoms detected. You seem to be doing fine! 
            Continue maintaining a healthy diet and stay hydrated.
          </p>
        </div>

        <div className="cc-result-actions">
          <button className="cc-restart-btn" onClick={onRestart}>
            🔄 Try Again
          </button>
          <button className="cc-home-btn" onClick={onBack}>
            ← Back to Categories
          </button>
        </div>
      </div>
    )
  }

  /* ── Standard result ───────────────────────────────────── */
  const { disease, remedies, severity, severityLabel, criticalWarning } = predictDisease(answers)
  const presentSymptoms = SYMPTOMS.filter((_, i) => answers[i] === 1)
  const absentSymptoms  = SYMPTOMS.filter((_, i) => answers[i] === 0)

  return (
    <div className="cc-result-wrapper">

      {/* Header */}
      <div className="cc-result-header">
        <button className="cc-back-btn" onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <span className="cc-title">Assessment Result</span>
      </div>

       {/* Critical Warning (if any) */}
       {criticalWarning && (
        <div className="cc-warning-box">
          <span className="cc-warning-icon">🚨</span>
          <div className="cc-warning-content">
            <h4 className="cc-warning-title">CRITICAL WARNING</h4>
            <p className="cc-warning-desc">{criticalWarning}</p>
          </div>
        </div>
      )}

      {/* Diagnosis card */}
      <div className="cc-result-card">
        <div className="cc-result-label">Predicted Condition</div>
        <div className="cc-result-disease">{disease}</div>

        {/* Severity chip */}
        <span className={`cc-severity-chip ${severity}`}>
          {severityLabel}
        </span>

        <div className="cc-divider" />

        {/* Remedy List */}
        <div className="cc-remedy-label">Recommended Actions</div>
        <ul className="cc-remedy-list">
          {remedies.map((r, i) => (
            <li key={i} className="cc-remedy-item">{r}</li>
          ))}
        </ul>
      </div>

      {/* Symptom summary */}
      <div className="cc-symptom-summary">
        <div className="cc-symptom-summary-title">Your Symptoms</div>
        <div className="cc-symptom-pills">
          {presentSymptoms.map(s => (
            <span key={s} className="cc-symptom-pill present">{s}</span>
          ))}
          {absentSymptoms.map(s => (
            <span key={s} className="cc-symptom-pill absent">{s}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="cc-result-actions">
        <button className="cc-restart-btn" onClick={onRestart}>
          🔄 Retake Quiz
        </button>
        <button className="cc-home-btn" onClick={onBack}>
          ← Back to Categories
        </button>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SCREEN ──────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════ */
export default function CommonChecker({ onBack }) {
  const total = SYMPTOMS.length

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
    <div className="cc-wrapper">

      <div className="cc-header" style={{ borderBottomColor: '#ef444455' }}>
        <button
          className="cc-back-btn"
          onClick={step === 0 ? onBack : goPrev}
          aria-label={step === 0 ? 'Back' : 'Previous question'}
        >
          ← {step === 0 ? 'Back' : 'Prev'}
        </button>
        <span className="cc-title">Common Diseases</span>
      </div>

      <div className="cc-progress-wrap" role="progressbar">
        <div className="cc-progress-label">
          <span>Symptom {step + 1} of {total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="cc-progress-track">
          <div className="cc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="cc-card" key={slideKey}>
        <div className="cc-symptom-badge">
          🦠 Common · Item {step + 1}
        </div>

        <p className="cc-question">
          Do you have <strong>{SYMPTOMS[step]}</strong>?
        </p>

        <div className="cc-choices">
          <button
            className={`cc-choice-btn yes${current === 1 ? ' selected' : ''}`}
            onClick={() => handleChoice(1)}
          >
            <span className="cc-choice-icon">{YES_ICON}</span>
            Yes
          </button>

          <button
            className={`cc-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
          >
            <span className="cc-choice-icon">{NO_ICON}</span>
            No
          </button>
        </div>
      </div>

      <div className="cc-nav">
        <button className="cc-nav-btn" onClick={goPrev} disabled={step === 0}>
          ← Prev
        </button>

        <button className="cc-next-btn" onClick={goNext} disabled={!canProceed}>
          {isLastSlide ? 'Get Result →' : 'Next →'}
        </button>
      </div>

      <div className="cc-dots">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              'cc-dot' +
              (i === step ? ' current' : '') +
              (answers[i] !== null && i !== step ? ' answered' : '')
            }
          />
        ))}
      </div>

    </div>
  )
}
