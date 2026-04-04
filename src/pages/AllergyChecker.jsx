import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './AllergyChecker.css'
import { SYMPTOMS, predictDisease } from './allergyModel'

/* ── Severity metadata per predicted disease ─────────────── */
const SEVERITY = {
  'Mild Allergy':              { level: 'mild',     labelKey: 'sev_mild' },
  'Dust Allergy':              { level: 'moderate', labelKey: 'sev_moderate' },
  'Pollen Allergy':            { level: 'moderate', labelKey: 'sev_moderate' },
  'Food Allergy':              { level: 'moderate', labelKey: 'sev_moderate' },
  'Insect Sting Allergy':      { level: 'moderate', labelKey: 'sev_moderate' },
  'Severe Allergic Reaction':  { level: 'serious',  labelKey: 'sev_emergency' },
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
      <div className="alc-result-wrapper">
        <div className="alc-result-header">
          <button className="alc-back-btn" onClick={onBack} aria-label="Go back">
            {t('hc_back_cat')}
          </button>
          <span className="alc-title">{t('allergy_checker_title')}</span>
        </div>

        <div className="alc-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>🤧</div>
          <div className="alc-result-disease">{t('hc_no_symptoms')}</div>
          <div className="alc-divider" />
          <p className="alc-remedy-text">
             {t('remedy_allergy_no_symptoms')}
          </p>
        </div>

        <div className="alc-result-actions">
          <button className="alc-restart-btn" onClick={onRestart}>
            {t('hc_try_again')}
          </button>
          <button className="alc-home-btn" onClick={onBack}>
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
    <div className="alc-result-wrapper">

      {/* Header */}
      <div className="alc-result-header">
        <button className="alc-back-btn" onClick={onBack} aria-label="Go back">
          {t('sc_back')}
        </button>
        <span className="alc-title">{t('hc_result_title')}</span>
      </div>

      {/* Diagnosis card */}
      <div className="alc-result-card">
        <div className="alc-result-label">{t('nc_predicted_cond')}</div>
        <div className="alc-result-disease">{t(`disease_${disease.toLowerCase().replace(/\s+/g, '_')}`)}</div>

        {/* Severity chip */}
        <span className={`alc-severity-chip ${sev.level}`}>
          {t(sev.labelKey)}
        </span>

        <div className="alc-divider" />

        {/* Remedy */}
        <div className="alc-remedy-label">{t('nc_action_plan')}</div>
        <p className="alc-remedy-text" style={{ whiteSpace: 'pre-line' }}>{t(`remedy_allergy_${disease.toLowerCase().replace(/\s+/g, '_')}`)}</p>
      </div>

      {/* Symptom summary */}
      <div className="alc-symptom-summary">
        <div className="alc-symptom-summary-title">{t('hc_your_symptoms')}</div>
        <div className="alc-symptom-pills">
          {presentSymptoms.map(s => (
            <span key={s} className="alc-symptom-pill present">{t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`)}</span>
          ))}
          {absentSymptoms.map(s => (
            <span key={s} className="alc-symptom-pill absent">{t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`)}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="alc-result-actions">
        <button className="alc-restart-btn" onClick={onRestart}>
          {t('hc_try_again')}
        </button>
        <button className="alc-home-btn" onClick={onBack}>
          {t('hc_back_cat')}
        </button>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SCREEN  (one symptom slide at a time)
   ═══════════════════════════════════════════════════════════ */
export default function AllergyChecker({ onBack }) {
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
    <div className="alc-wrapper">

      {/* Header */}
      <div className="alc-header">
        <button
          className="alc-back-btn"
          onClick={step === 0 ? onBack : goPrev}
          aria-label={step === 0 ? 'Back to categories' : 'Previous question'}
        >
          {step === 0 ? t('sc_back') : t('hc_prev')}
        </button>
        <span className="alc-title">{t('allergy_checker_title')}</span>
      </div>

      {/* Progress bar */}
      <div className="alc-progress-wrap" role="progressbar"
           aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        <div className="alc-progress-label">
          <span>{t('hc_q')} {step + 1} {t('hc_of')} {total}</span>
          <span>{Math.round(progress)}{t('hc_complete')}</span>
        </div>
        <div className="alc-progress-track">
          <div className="alc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card — key re-mounts on every slide change to replay animation */}
      <div className="alc-card" key={slideKey}>
        {/* Symptom badge */}
        <div className="alc-symptom-badge">
          {t('allergy_checker_badge')} {step + 1}
        </div>

        {/* Question */}
        <p className="alc-question">
          {t('hc_do_you_have')} <strong>{t(`symp_${SYMPTOMS[step].toLowerCase().replace(/\s+/g, '_')}`)}</strong>?
        </p>

        {/* Yes / No */}
        <div className="alc-choices">
          <button
            id={`alc-yes-${step}`}
            className={`alc-choice-btn yes${current === 1 ? ' selected' : ''}`}
            onClick={() => handleChoice(1)}
            aria-pressed={current === 1}
          >
            <span className="alc-choice-icon">{YES_ICON}</span>
            {t('hc_yes')}
          </button>

          <button
            id={`alc-no-${step}`}
            className={`alc-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
            aria-pressed={current === 0}
          >
            <span className="alc-choice-icon">{NO_ICON}</span>
            {t('hc_no')}
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="alc-nav">
        <button
          className="alc-nav-btn"
          onClick={goPrev}
          disabled={step === 0}
          aria-label="Previous question"
        >
          {t('hc_prev')}
        </button>

        <button
          className="alc-next-btn"
          onClick={goNext}
          disabled={!canProceed}
          aria-label={isLastSlide ? 'See results' : 'Next question'}
        >
          {isLastSlide ? t('hc_see_results') : t('hc_next')}
        </button>
      </div>

      {/* Dot indicators */}
      <div className="alc-dots" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              'alc-dot' +
              (i === step        ? ' current'  : '') +
              (answers[i] !== null && i !== step ? ' answered' : '')
            }
          />
        ))}
      </div>

    </div>
  )
}
