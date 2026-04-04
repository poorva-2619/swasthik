import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './HeatColdChecker.css'
import { SYMPTOMS, predictDisease } from './heatColdModel'

/* ── Severity metadata per predicted disease ─────────────── */
const SEVERITY = {
  'Heat Stroke': { level: 'serious', labelKey: 'sev_serious' },
  'Severe Heat Stroke': { level: 'serious', labelKey: 'sev_serious' },
  'Heat Exhaustion': { level: 'moderate', labelKey: 'sev_moderate' },
  'Mild Hypothermia': { level: 'moderate', labelKey: 'sev_moderate' },
  'Hypothermia': { level: 'serious', labelKey: 'sev_serious' },
  'Severe Hypothermia': { level: 'serious', labelKey: 'sev_serious' },
  'Cold Exposure': { level: 'mild', labelKey: 'sev_mild' },
  'Normal': { level: 'mild', labelKey: 'sev_mild' },
  'Healthy': { level: 'mild', labelKey: 'sev_mild' }
}

/* ── Icons shown on Yes / No buttons ────────────────────── */
const YES_ICON = '✓'
const NO_ICON  = '✗'

/* ═══════════════════════════════════════════════════════════
   RESULT SCREEN
   ═══════════════════════════════════════════════════════════ */
function ResultScreen({ answers, onRestart, onBack }) {
  const { t } = useLanguage()
  const allZero = answers.every(a => a === 0)

  /* ── No-symptom edge case ──────────────────────────────── */
  if (allZero) {
    return (
      <div className="hcc-result-wrapper">
        <div className="hcc-result-header">
          <button className="hcc-back-btn" onClick={onBack} aria-label="Go back">
            {t('hc_back_cat') || '← Back to Categories'}
          </button>
          <span className="hcc-title">{t('heat_cold_checker_title') || 'Heat & Cold Problems'}</span>
        </div>

        <div className="hcc-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>🌡️</div>
          <div className="hcc-result-disease">{t('hc_no_symptoms') || 'No Symptoms Detected'}</div>
          <div className="hcc-divider" />
          <p className="hcc-remedy-text">
            {t('hccc_no_symptoms_desc') || "You haven't reported any heat or cold related symptoms. Stay properly dressed for the weather and stay hydrated!"}
          </p>
        </div>

        <div className="hcc-result-actions">
          <button className="hcc-restart-btn" onClick={onRestart}>
            {t('hc_try_again') || '🔄 Retake Quiz'}
          </button>
          <button className="hcc-home-btn" onClick={onBack}>
            {t('hc_back_cat') || '← Back to Categories'}
          </button>
        </div>
      </div>
    )
  }

  /* ── Standard result ───────────────────────────────────── */
  const { disease, remedy, warning } = predictDisease(answers)
  const sev = SEVERITY[disease] ?? { level: 'moderate', labelKey: 'sev_moderate' }
  const presentSymptoms = SYMPTOMS.filter((_, i) => answers[i] === 1)
  const absentSymptoms  = SYMPTOMS.filter((_, i) => answers[i] === 0)

  return (
    <div className="hcc-result-wrapper">

      {/* Header */}
      <div className="hcc-result-header">
        <button className="hcc-back-btn" onClick={onBack} aria-label="Go back">
          {t('sc_back') || '← Back'}
        </button>
        <span className="hcc-title">{t('hc_result_title') || 'Your Result'}</span>
      </div>

      {/* Diagnosis card */}
      <div className="hcc-result-card">
        <div className="hcc-result-label">{t('hc_possible_cond') || 'Possible Condition'}</div>
        <div className="hcc-result-disease">
           {t(`disease_${disease.toLowerCase().replace(/\s+/g, '_')}`) === `disease_${disease.toLowerCase().replace(/\s+/g, '_')}` 
              ? disease 
              : t(`disease_${disease.toLowerCase().replace(/\s+/g, '_')}`)}
        </div>

        {/* Severity chip */}
        <span className={`hcc-severity-chip ${sev.level}`}>
          {t(sev.labelKey) || sev.level}
        </span>

        <div className="hcc-divider" />

        {/* Remedy */}
        <div className="hcc-remedy-label">{t('hc_sug_action') || 'Suggested Action'}</div>
        <p className="hcc-remedy-text">
          {remedy}
          {warning && (
            <>
              <br /><br />
              <strong style={{ color: 'var(--red-primary)' }}>{warning}</strong>
            </>
          )}
        </p>
      </div>

      {/* Symptom summary */}
      <div className="hcc-symptom-summary">
        <div className="hcc-symptom-summary-title">{t('hc_your_symptoms') || 'Your Symptoms'}</div>
        <div className="hcc-symptom-pills">
          {presentSymptoms.map(s => (
            <span key={s} className="hcc-symptom-pill present">
               {t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`) === `symp_${s.toLowerCase().replace(/\s+/g, '_')}` 
                  ? s 
                  : t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`)}
            </span>
          ))}
          {absentSymptoms.map(s => (
            <span key={s} className="hcc-symptom-pill absent">
               {t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`) === `symp_${s.toLowerCase().replace(/\s+/g, '_')}` 
                  ? s 
                  : t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`)}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="hcc-result-actions">
        <button className="hcc-restart-btn" onClick={onRestart}>
          {t('hc_try_again') || '🔄 Retake Quiz'}
        </button>
        <button className="hcc-home-btn" onClick={onBack}>
          {t('hc_back_cat') || '← Back to Categories'}
        </button>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SCREEN  (one symptom slide at a time)
   ═══════════════════════════════════════════════════════════ */
export default function HeatColdChecker({ onBack }) {
  const { t } = useLanguage()
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
    <div className="hcc-wrapper">

      {/* Header */}
      <div className="hcc-header">
        <button
          className="hcc-back-btn"
          onClick={step === 0 ? onBack : goPrev}
          aria-label={step === 0 ? 'Back to categories' : 'Previous question'}
        >
          {step === 0 ? (t('sc_back') || '← Back') : (t('hc_prev') || '← Prev')}
        </button>
        <span className="hcc-title">{t('heat_cold_checker_title') || 'Heat & Cold Problems'}</span>
      </div>

      {/* Progress bar */}
      <div className="hcc-progress-wrap" role="progressbar"
           aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        <div className="hcc-progress-label">
          <span>{(t('hc_q') || 'Question')} {step + 1} {(t('hc_of') || 'of')} {total}</span>
          <span>{Math.round(progress)}% {(t('hc_complete') || 'complete')}</span>
        </div>
        <div className="hcc-progress-track">
          <div className="hcc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card — key re-mounts on every slide change to replay animation */}
      <div className="hcc-card" key={slideKey}>
        {/* Symptom badge */}
        <div className="hcc-symptom-badge">
          {(t('heat_cold_checker_badge') || '🌡️ Temp · Symptom')} {step + 1}
        </div>

        {/* Question */}
        <p className="hcc-question">
          {(t('hc_do_you_have') || 'Do you have')}{' '}
          <strong>
             {t(`symp_${SYMPTOMS[step].toLowerCase().replace(/\s+/g, '_')}`) === `symp_${SYMPTOMS[step].toLowerCase().replace(/\s+/g, '_')}`
                 ? SYMPTOMS[step]
                 : t(`symp_${SYMPTOMS[step].toLowerCase().replace(/\s+/g, '_')}`)}
          </strong>?
        </p>

        {/* Yes / No */}
        <div className="hcc-choices">
          <button
            id={`hcc-yes-${step}`}
            className={`hcc-choice-btn yes${current === 1 ? ' selected' : ''}`}
            onClick={() => handleChoice(1)}
            aria-pressed={current === 1}
          >
            <span className="hcc-choice-icon">{YES_ICON}</span>
            {t('hc_yes') || 'Yes'}
          </button>

          <button
            id={`hcc-no-${step}`}
            className={`hcc-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
            aria-pressed={current === 0}
          >
            <span className="hcc-choice-icon">{NO_ICON}</span>
            {t('hc_no') || 'No'}
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="hcc-nav">
        <button
          className="hcc-nav-btn"
          onClick={goPrev}
          disabled={step === 0}
          aria-label="Previous question"
        >
          {t('hc_prev') || '← Prev'}
        </button>

        <button
          className="hcc-next-btn"
          onClick={goNext}
          disabled={!canProceed}
          aria-label={isLastSlide ? 'See results' : 'Next question'}
        >
          {isLastSlide ? (t('hc_see_results') || 'See Results →') : (t('hc_next') || 'Next →')}
        </button>
      </div>

      {/* Dot indicators */}
      <div className="hcc-dots" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              'hcc-dot' +
              (i === step        ? ' current'  : '') +
              (answers[i] !== null && i !== step ? ' answered' : '')
            }
          />
        ))}
      </div>

    </div>
  )
}
