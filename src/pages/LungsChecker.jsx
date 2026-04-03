import { useState } from 'react'
import './LungsChecker.css'
import { SYMPTOMS, predictDisease } from './lungsModel'

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
      <div className="lc-result-wrapper">
        <div className="lc-result-header">
          <button className="lc-back-btn" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
          <span className="lc-title">Lung Health</span>
        </div>

        <div className="lc-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>🫁</div>
          <div className="lc-result-disease">Condition: Healthy</div>
          <div className="cc-divider" />
          <p className="lc-remedy-text">
            No respiratory symptoms detected. Your lungs seem to be in good shape! 
            Maintain a smoke-free environment and practice deep breathing.
          </p>
        </div>

        <div className="lc-result-actions">
          <button className="lc-restart-btn" onClick={onRestart}>
            🔄 Try Again
          </button>
          <button className="lc-home-btn" onClick={onBack}>
            ← Back to Categories
          </button>
        </div>
      </div>
    )
  }

  /* ── Standard result ───────────────────────────────────── */
  const { disease, remedies, severity, severityLabel, criticalWarning, managementLabel } = predictDisease(answers)
  const presentSymptoms = SYMPTOMS.filter((_, i) => answers[i] === 1)
  const absentSymptoms  = SYMPTOMS.filter((_, i) => answers[i] === 0)

  return (
    <div className="lc-result-wrapper">

      {/* Header */}
      <div className="lc-result-header">
        <button className="lc-back-btn" onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <span className="lc-title">Assessment Result</span>
      </div>

       {/* Critical Warning (if any) */}
       {criticalWarning && (
        <div className="lc-warning-box">
          <span className="lc-warning-icon">🚨</span>
          <div className="lc-warning-content">
            <h4 className="lc-warning-title">MEDICAL WARNING</h4>
            <p className="lc-warning-desc">{criticalWarning}</p>
          </div>
        </div>
      )}

      {/* Diagnosis card */}
      <div className="lc-result-card">
        <div className="lc-result-label">Potential Condition</div>
        <div className="lc-result-disease">{disease}</div>

        {/* Severity chip */}
        <span className={`lc-severity-chip ${severity}`}>
          {severityLabel}
        </span>

        <div className="lc-divider" />

        {/* Labels based on category */}
        {managementLabel && <div className="lc-meta-label">📋 {managementLabel}</div>}

        {/* Remedy List */}
        <div className="lc-remedy-label">Essential Actions</div>
        <ul className="lc-remedy-list">
          {remedies.map((r, i) => (
            <li key={i} className="lc-remedy-item">{r}</li>
          ))}
        </ul>
      </div>

      {/* Symptom summary */}
      <div className="lc-symptom-summary">
        <div className="lc-symptom-summary-title">Summary of Symptoms</div>
        <div className="lc-symptom-pills">
          {presentSymptoms.map(s => (
            <span key={s} className="lc-symptom-pill present">{s}</span>
          ))}
          {absentSymptoms.map(s => (
            <span key={s} className="lc-symptom-pill absent">{s}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="lc-result-actions">
        <button className="lc-restart-btn" onClick={onRestart}>
          🔄 Retake Quiz
        </button>
        <button className="lc-home-btn" onClick={onBack}>
          ← Back to Categories
        </button>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SCREEN ──────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════ */
export default function LungsChecker({ onBack }) {
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
    <div className="lc-wrapper">

      <div className="lc-header">
        <button
          className="lc-back-btn"
          onClick={step === 0 ? onBack : goPrev}
          aria-label={step === 0 ? 'Back' : 'Previous question'}
        >
          ← {step === 0 ? 'Back' : 'Prev'}
        </button>
        <span className="lc-title">Lung Health</span>
      </div>

      <div className="lc-progress-wrap" role="progressbar">
        <div className="lc-progress-label">
          <span>Question {step + 1} of {total}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="lc-progress-track">
          <div className="lc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="lc-card" key={slideKey}>
        <div className="lc-symptom-badge">
          🫁 Lungs · Item {step + 1}
        </div>

        <p className="lc-question">
          Is there any <strong>{SYMPTOMS[step]}</strong>?
        </p>

        <div className="lc-choices">
          <button
            className={`lc-choice-btn yes${current === 1 ? ' selected' : ''}`}
            onClick={() => handleChoice(1)}
          >
            <span className="lc-choice-icon">{YES_ICON}</span>
            Yes
          </button>

          <button
            className={`lc-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
          >
            <span className="lc-choice-icon">{NO_ICON}</span>
            No
          </button>
        </div>
      </div>

      <div className="lc-nav">
        <button className="lc-nav-btn" onClick={goPrev} disabled={step === 0}>
          ← Prev
        </button>

        <button className="lc-next-btn" onClick={goNext} disabled={!canProceed}>
          {isLastSlide ? 'Get Result →' : 'Next →'}
        </button>
      </div>

      <div className="lc-dots">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              'lc-dot' +
              (i === step ? ' current' : '') +
              (answers[i] !== null && i !== step ? ' answered' : '')
            }
          />
        ))}
      </div>

    </div>
  )
}
