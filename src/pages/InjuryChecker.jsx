import { useState } from 'react'
import './InjuryChecker.css'
import { SYMPTOMS, predictDisease } from './injuryModel'

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
      <div className="ic-result-wrapper">
        <div className="ic-result-header">
          <button className="ic-back-btn" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
          <span className="ic-title">Assessment Result</span>
        </div>

        <div className="ic-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>🛡️</div>
          <div className="ic-result-disease">No Major Injury Reported</div>
          <div className="ic-divider" />
          <p className="ic-remedy-text">
            You haven't reported any severe symptoms. If the person is stable, keep observing them for any changes.
            If they feel discomfort later, visit a local health centre.
          </p>
        </div>

        <div className="ic-result-actions">
          <button className="ic-restart-btn" onClick={onRestart}>
            🔄 Try Again
          </button>
          <button className="ic-home-btn" onClick={onBack}>
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
    <div className="ic-result-wrapper">

      {/* Header */}
      <div className="ic-result-header">
        <button className="ic-back-btn" onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <span className="ic-title">Assessment Result</span>
      </div>

      {/* Diagnosis card */}
      <div className="ic-result-card">
        <div className="ic-result-label">Potential Condition</div>
        <div className="ic-result-disease">{disease}</div>

        {/* Severity chip */}
        <span className={`ic-severity-chip ${severity}`}>
          {severityLabel}
        </span>

        <div className="ic-divider" />

        {/* Remedy */}
        <div className="ic-remedy-label">Recommended First Aid</div>
        <p className="ic-remedy-text">{remedy}</p>
      </div>

      {/* Symptom summary */}
      <div className="ic-symptom-summary">
        <div className="ic-symptom-summary-title">Summary of Symptoms</div>
        <div className="ic-symptom-pills">
          {presentSymptoms.map(s => (
            <span key={s} className="ic-symptom-pill present">{s}</span>
          ))}
          {absentSymptoms.map(s => (
            <span key={s} className="ic-symptom-pill absent">{s}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="ic-result-actions">
        <button className="ic-restart-btn" onClick={onRestart}>
          🔄 Retake Quiz
        </button>
        <button className="ic-home-btn" onClick={onBack}>
          ← Back to Categories
        </button>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SCREEN ──────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════ */
export default function InjuryChecker({ onBack }) {
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
    <div className="ic-wrapper">

      <div className="ic-header">
        <button
          className="ic-back-btn"
          onClick={step === 0 ? onBack : goPrev}
          aria-label={step === 0 ? 'Back' : 'Previous question'}
        >
          ← {step === 0 ? 'Back' : 'Prev'}
        </button>
        <span className="ic-title">Shock & Burns</span>
      </div>

      <div className="ic-progress-wrap" role="progressbar">
        <div className="ic-progress-label">
          <span>Question {step + 1} of {total}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="ic-progress-track">
          <div className="ic-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="ic-card" key={slideKey}>
        <div className="ic-symptom-badge">
          ⚡ Burns & Shock · Symptom {step + 1}
        </div>

        <p className="ic-question">
          Is there any <strong>{SYMPTOMS[step]}</strong>?
        </p>

        <div className="ic-choices">
          <button
            className={`ic-choice-btn yes${current === 1 ? ' selected' : ''}`}
            onClick={() => handleChoice(1)}
          >
            <span className="ic-choice-icon">{YES_ICON}</span>
            Yes
          </button>

          <button
            className={`ic-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
          >
            <span className="ic-choice-icon">{NO_ICON}</span>
            No
          </button>
        </div>
      </div>

      <div className="ic-nav">
        <button className="ic-nav-btn" onClick={goPrev} disabled={step === 0}>
          ← Prev
        </button>

        <button className="ic-next-btn" onClick={goNext} disabled={!canProceed}>
          {isLastSlide ? 'View Results →' : 'Next →'}
        </button>
      </div>

      <div className="ic-dots">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              'ic-dot' +
              (i === step ? ' current' : '') +
              (answers[i] !== null && i !== step ? ' answered' : '')
            }
          />
        ))}
      </div>

    </div>
  )
}
