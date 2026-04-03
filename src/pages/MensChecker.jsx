import { useState } from 'react'
import './MensChecker.css'
import { SYMPTOMS, predictCondition } from './mensModel'

/* ── Severity metadata per predicted disease ─────────────── */
const SEVERITY = {
  'Normal Menstrual Pain': { level: 'mild',      label: '✓ Mild'                    },
  'Heavy Periods':         { level: 'moderate',   label: '⚠ Moderate'                },
  'PMS':                   { level: 'mild',       label: '✓ Mild'                    },
  'Irregular Periods':     { level: 'moderate',   label: '⚠ Moderate'                },
  'Possible PCOS':         { level: 'attention',  label: '🩺 Needs Attention'         },
  'Mild Discomfort':       { level: 'mild',       label: '✓ Mild'                    },
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
      <div className="mc-result-wrapper">
        <div className="mc-result-header">
          <button className="mc-back-btn" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
          <span className="mc-title">Menstrual Health</span>
        </div>

        <div className="mc-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>😊</div>
          <div className="mc-result-disease">No Symptoms Detected</div>
          <div className="mc-divider" />
          <p className="mc-remedy-item" style={{ justifyContent: 'center' }}>
            You haven't reported any significant symptoms. That's great!
            However, if you feel unwell or symptoms appear later, please
            consult a doctor.
          </p>
        </div>

        <div className="mc-result-actions">
          <button className="mc-restart-btn" onClick={onRestart}>
            🔄 Try Again
          </button>
          <button className="mc-home-btn" onClick={onBack}>
            ← Back to Categories
          </button>
        </div>
      </div>
    )
  }

  /* ── Standard result ───────────────────────────────────── */
  const { disease, remedies, warning } = predictCondition(answers)
  const sev = SEVERITY[disease] ?? { level: 'moderate', label: '⚠ Moderate' }
  const presentSymptoms = SYMPTOMS.filter((_, i) => answers[i] === 1)
  const absentSymptoms  = SYMPTOMS.filter((_, i) => answers[i] === 0)

  return (
    <div className="mc-result-wrapper">

      {/* Header */}
      <div className="mc-result-header">
        <button className="mc-back-btn" onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <span className="mc-title">Your Result</span>
      </div>

      {/* Diagnosis card */}
      <div className="mc-result-card">
        <div className="mc-result-label">Possible Condition</div>
        <div className="mc-result-disease">{disease}</div>

        {/* Severity chip */}
        <span className={`mc-severity-chip ${sev.level}`}>
          {sev.label}
        </span>

        <div className="mc-divider" />

        {/* Remedies */}
        <div className="mc-remedies-label">Suggested Remedies</div>
        <ul className="mc-remedies-list">
          {remedies.map((r, i) => (
            <li key={i} className="mc-remedy-item">
              <span className="mc-remedy-bullet">{i + 1}</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Warning banner (if applicable) */}
      {warning && (
        <div className="mc-warning-banner">
          <span className="mc-warning-icon">⚠️</span>
          <span className="mc-warning-text">{warning}</span>
        </div>
      )}

      {/* Symptom summary */}
      <div className="mc-symptom-summary">
        <div className="mc-symptom-summary-title">Your Symptoms</div>
        <div className="mc-symptom-pills">
          {presentSymptoms.map(s => (
            <span key={s.key} className="mc-symptom-pill present">
              {s.question.replace(/^(Do you have |Are you experiencing |Are your |Do you feel |Are you feeling very )/, '').replace(/\?$/, '')}
            </span>
          ))}
          {absentSymptoms.map(s => (
            <span key={s.key} className="mc-symptom-pill absent">
              {s.question.replace(/^(Do you have |Are you experiencing |Are your |Do you feel |Are you feeling very )/, '').replace(/\?$/, '')}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mc-result-actions">
        <button className="mc-restart-btn" onClick={onRestart}>
          🔄 Retake Quiz
        </button>
        <button className="mc-home-btn" onClick={onBack}>
          ← Back to Categories
        </button>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SCREEN  (one symptom slide at a time)
   ═══════════════════════════════════════════════════════════ */
export default function MensChecker({ onBack }) {
  const total = SYMPTOMS.length                    // 8

  // answers[i] = null (not yet answered) | 0 (No) | 1 (Yes)
  const [answers, setAnswers]       = useState(Array(total).fill(null))
  const [step, setStep]             = useState(0)
  const [showResult, setShowResult] = useState(false)
  // slideKey forces CSS re-animation when slide changes
  const [slideKey, setSlideKey]     = useState(0)

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
    <div className="mc-wrapper">

      {/* Header */}
      <div className="mc-header">
        <button
          className="mc-back-btn"
          onClick={step === 0 ? onBack : goPrev}
          aria-label={step === 0 ? 'Back to categories' : 'Previous question'}
        >
          ← {step === 0 ? 'Back' : 'Prev'}
        </button>
        <span className="mc-title">Menstrual Health</span>
      </div>

      {/* Progress bar */}
      <div className="mc-progress-wrap" role="progressbar"
           aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        <div className="mc-progress-label">
          <span>Question {step + 1} of {total}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="mc-progress-track">
          <div className="mc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card — key re-mounts on every slide change to replay animation */}
      <div className="mc-card" key={slideKey}>
        {/* Symptom badge */}
        <div className="mc-symptom-badge">
          🩸 Menstruation · Question {step + 1}
        </div>

        {/* Question */}
        <p className="mc-question">
          {SYMPTOMS[step].question}
        </p>

        {/* Yes / No */}
        <div className="mc-choices">
          <button
            id={`mc-yes-${step}`}
            className={`mc-choice-btn yes${current === 1 ? ' selected' : ''}`}
            onClick={() => handleChoice(1)}
            aria-pressed={current === 1}
          >
            <span className="mc-choice-icon">{YES_ICON}</span>
            Yes
          </button>

          <button
            id={`mc-no-${step}`}
            className={`mc-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
            aria-pressed={current === 0}
          >
            <span className="mc-choice-icon">{NO_ICON}</span>
            No
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="mc-nav">
        <button
          className="mc-nav-btn"
          onClick={goPrev}
          disabled={step === 0}
          aria-label="Previous question"
        >
          ← Prev
        </button>

        <button
          className="mc-next-btn"
          onClick={goNext}
          disabled={!canProceed}
          aria-label={isLastSlide ? 'See results' : 'Next question'}
        >
          {isLastSlide ? 'See Results →' : 'Next →'}
        </button>
      </div>

      {/* Dot indicators */}
      <div className="mc-dots" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              'mc-dot' +
              (i === step        ? ' current'  : '') +
              (answers[i] !== null && i !== step ? ' answered' : '')
            }
          />
        ))}
      </div>

    </div>
  )
}
