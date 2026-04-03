import { useState } from 'react'
import './LungsChecker.css'
import { SYMPTOMS, predictDisease } from './lungsModel'

/* ── Severity metadata per predicted disease ─────────────── */
const SEVERITY = {
  'No Issue':              { level: 'mild',     label: '✓ Healthy' },
  'Mild Issue':            { level: 'mild',     label: '✓ Mild Issue' },
  'Common Cold':           { level: 'mild',     label: '✓ Mild' },
  'Bronchitis':            { level: 'moderate', label: '⚠ Moderate' },
  'Asthma':                { level: 'moderate', label: '⚠ Moderate (Care Needed)' },
  'Pneumonia':             { level: 'serious',  label: '🚨 Serious – See Doctor' },
  'Possible TB':           { level: 'serious',  label: '🚨 URGENT – Get Tested' },
  'Severe Lung Infection': { level: 'serious',  label: '🚨 EMERGENCY' },
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
      <div className="lc-result-wrapper">
        <div className="lc-result-header">
          <button className="lc-back-btn" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
          <span className="lc-title">Lungs Checker</span>
        </div>

        <div className="lc-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>🫁</div>
          <div className="lc-result-disease">No Symptoms Detected</div>
          <div className="lc-divider" />
          <p className="lc-remedy-text">
            You haven't reported any significant lung or breathing symptoms. That's great!
            Maintain good hygiene, avoid pollution when possible, and stay active.
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
  const { disease, remedy } = predictDisease(answers)
  const sev = SEVERITY[disease] ?? { level: 'moderate', label: '⚠ Moderate' }
  const presentSymptoms = SYMPTOMS.filter((_, i) => answers[i] === 1)
  const absentSymptoms  = SYMPTOMS.filter((_, i) => answers[i] === 0)

  return (
    <div className="lc-result-wrapper">

      {/* Header */}
      <div className="lc-result-header">
        <button className="lc-back-btn" onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <span className="lc-title">Your Result</span>
      </div>

      {/* Diagnosis card */}
      <div className="lc-result-card">
        <div className="lc-result-label">Possible Condition</div>
        <div className="lc-result-disease">{disease}</div>

        {/* Severity chip */}
        <span className={`lc-severity-chip ${sev.level}`}>
          {sev.label}
        </span>

        <div className="lc-divider" />

        {/* Remedy */}
        <div className="lc-remedy-label">Suggested Action</div>
        <p className="lc-remedy-text" style={{ whiteSpace: 'pre-line' }}>{remedy}</p>
      </div>

      {/* Symptom summary */}
      <div className="lc-symptom-summary">
        <div className="lc-symptom-summary-title">Your Symptoms</div>
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
   QUIZ SCREEN  (one symptom slide at a time)
   ═══════════════════════════════════════════════════════════ */
export default function LungsChecker({ onBack }) {
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
    <div className="lc-wrapper">

      {/* Header */}
      <div className="lc-header">
        <button
          className="lc-back-btn"
          onClick={step === 0 ? onBack : goPrev}
          aria-label={step === 0 ? 'Back to categories' : 'Previous question'}
        >
          ← {step === 0 ? 'Back' : 'Prev'}
        </button>
        <span className="lc-title">Lungs Checker</span>
      </div>

      {/* Progress bar */}
      <div className="lc-progress-wrap" role="progressbar"
           aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        <div className="lc-progress-label">
          <span>Question {step + 1} of {total}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="lc-progress-track">
          <div className="lc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card — key re-mounts on every slide change to replay animation */}
      <div className="lc-card" key={slideKey}>
        {/* Symptom badge */}
        <div className="lc-symptom-badge">
          🫁 Lungs · Symptom {step + 1}
        </div>

        {/* Question */}
        <p className="lc-question">
          Do you have <strong>{SYMPTOMS[step]}</strong>?
        </p>

        {/* Yes / No */}
        <div className="lc-choices">
          <button
            id={`lc-yes-${step}`}
            className={`lc-choice-btn yes${current === 1 ? ' selected' : ''}`}
            onClick={() => handleChoice(1)}
            aria-pressed={current === 1}
          >
            <span className="lc-choice-icon">{YES_ICON}</span>
            Yes
          </button>

          <button
            id={`lc-no-${step}`}
            className={`lc-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
            aria-pressed={current === 0}
          >
            <span className="lc-choice-icon">{NO_ICON}</span>
            No
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="lc-nav">
        <button
          className="lc-nav-btn"
          onClick={goPrev}
          disabled={step === 0}
          aria-label="Previous question"
        >
          ← Prev
        </button>

        <button
          className="lc-next-btn"
          onClick={goNext}
          disabled={!canProceed}
          aria-label={isLastSlide ? 'See results' : 'Next question'}
        >
          {isLastSlide ? 'See Results →' : 'Next →'}
        </button>
      </div>

      {/* Dot indicators */}
      <div className="lc-dots" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              'lc-dot' +
              (i === step        ? ' current'  : '') +
              (answers[i] !== null && i !== step ? ' answered' : '')
            }
          />
        ))}
      </div>

    </div>
  )
}
