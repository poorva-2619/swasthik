import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './NoseChecker.css'
import { SYMPTOMS, predictDisease } from './noseModel'

/* ── Severity metadata per predicted disease ─────────────── */
const SEVERITY = {
  'Common Cold':           { level: 'mild',     labelKey: 'sev_mild' },
  'Allergic Rhinitis':     { level: 'mild',     labelKey: 'sev_mild_allergy' },
  'Sinusitis':             { level: 'moderate', labelKey: 'sev_moderate' },
  'Flu':                   { level: 'moderate', labelKey: 'sev_moderate_monitor' },
  'Nasal Infection':       { level: 'serious',  labelKey: 'sev_serious_consult' },
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
      <div className="nc-result-wrapper">
        <div className="nc-result-header">
          <button className="nc-back-btn" onClick={onBack} aria-label="Go back">
            {t('hc_back_cat')}
          </button>
          <span className="nc-title">{t('nc_title')}</span>
        </div>

        <div className="nc-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>👃</div>
          <div className="nc-result-disease">{t('hc_no_symptoms')}</div>
          <div className="nc-divider" />
          <p className="nc-remedy-text">
            {t('nc_no_symptoms_desc')}
          </p>
        </div>

        <div className="nc-result-actions">
          <button className="nc-restart-btn" onClick={onRestart}>
            {t('hc_try_again')}
          </button>
          <button className="nc-home-btn" onClick={onBack}>
            {t('hc_back_cat')}
          </button>
        </div>
      </div>
    )
  }

  /* ── Standard result ───────────────────────────────────── */
  const { disease } = predictDisease(answers)
  const sev = SEVERITY[disease] ?? { level: 'moderate', labelKey: 'sev_moderate' }
  const presentSymptoms = SYMPTOMS.filter((_, i) => answers[i] === 1)
  const absentSymptoms  = SYMPTOMS.filter((_, i) => answers[i] === 0)

  return (
    <div className="nc-result-wrapper">

      {/* Header */}
      <div className="nc-result-header">
        <button className="nc-back-btn" onClick={onBack} aria-label="Go back">
          {t('sc_back')}
        </button>
        <span className="nc-title">{t('hc_result_title')}</span>
      </div>

      {/* Diagnosis card */}
      <div className="nc-result-card">
        <div className="nc-result-label">{t('nc_predicted_cond')}</div>
        <div className="nc-result-disease">{t(`disease_${disease.toLowerCase().replace(/\s+/g, '_')}`)}</div>

        {/* Severity chip */}
        <span className={`nc-severity-chip ${sev.level}`}>
          {t(sev.labelKey)}
        </span>

        <div className="nc-divider" />

        {/* Remedy */}
        <div className="nc-remedy-label">{t('nc_action_plan')}</div>
        <p className="nc-remedy-text" style={{ whiteSpace: 'pre-line' }}>{t(`remedy_nose_${disease.toLowerCase().replace(/\s+/g, '_')}`)}</p>
      </div>

      {/* Symptom summary */}
      <div className="nc-symptom-summary">
        <div className="nc-symptom-summary-title">{t('hc_your_symptoms')}</div>
        <div className="nc-symptom-pills">
          {presentSymptoms.map(s => (
            <span key={s} className="nc-symptom-pill present">{t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`)}</span>
          ))}
          {absentSymptoms.map(s => (
            <span key={s} className="nc-symptom-pill absent">{t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`)}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="nc-result-actions">
        <button className="nc-restart-btn" onClick={onRestart}>
          {t('hc_try_again')}
        </button>
        <button className="nc-home-btn" onClick={onBack}>
          {t('hc_back_cat')}
        </button>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SCREEN  (one symptom slide at a time)
   ═══════════════════════════════════════════════════════════ */
export default function NoseChecker({ onBack }) {
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
          {step === 0 ? t('sc_back') : t('hc_prev')}
        </button>
        <span className="nc-title">{t('nc_title')}</span>
      </div>

      {/* Progress bar */}
      <div className="nc-progress-wrap" role="progressbar"
           aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        <div className="nc-progress-label">
          <span>{t('hc_q')} {step + 1} {t('hc_of')} {total}</span>
          <span>{Math.round(progress)}{t('hc_complete')}</span>
        </div>
        <div className="nc-progress-track">
          <div className="nc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card — key re-mounts on every slide change to replay animation */}
      <div className="nc-card" key={slideKey}>
        {/* Symptom badge */}
        <div className="nc-symptom-badge">
          {t('nc_badge')} {step + 1}
        </div>

        {/* Question */}
        <p className="nc-question">
          {t('hc_do_you_have')} <strong>{t(`symp_${SYMPTOMS[step].toLowerCase().replace(/\s+/g, '_')}`)}</strong>?
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
            {t('hc_yes')}
          </button>

          <button
            id={`nc-no-${step}`}
            className={`nc-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
            aria-pressed={current === 0}
          >
            <span className="nc-choice-icon">{NO_ICON}</span>
            {t('hc_no')}
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
          {t('hc_prev')}
        </button>

        <button
          className="nc-next-btn"
          onClick={goNext}
          disabled={!canProceed}
          aria-label={isLastSlide ? 'See results' : 'Next question'}
        >
          {isLastSlide ? t('hc_see_results') : t('hc_next')}
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
