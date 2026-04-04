import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './InjuryChecker.css'
import { SYMPTOMS, predictDisease } from './injuryModel'

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
      <div className="ic-result-wrapper">
        <div className="ic-result-header">
          <button className="ic-back-btn" onClick={onBack} aria-label="Go back">
            {t('hc_back_cat')}
          </button>
          <span className="ic-title">{t('injury_checker_title')}</span>
        </div>

        <div className="ic-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>🛡️</div>
          <div className="ic-result-disease">{t('hc_no_symptoms')}</div>
          <div className="ic-divider" />
          <p className="ic-remedy-text">
            {t('remedy_injury_no_symptoms')}
          </p>
        </div>

        <div className="ic-result-actions">
          <button className="ic-restart-btn" onClick={onRestart}>
            {t('hc_try_again')}
          </button>
          <button className="ic-home-btn" onClick={onBack}>
            {t('hc_back_cat')}
          </button>
        </div>
      </div>
    )
  }

  /* ── Standard result ───────────────────────────────────── */
  const { disease, severity } = predictDisease(answers)
  
  const sevKey = {
    'critical': 'sev_critical',
    'serious': 'sev_serious_consult',
    'moderate': 'sev_moderate',
    'mild': 'sev_mild'
  }[severity] || 'sev_moderate';

  const presentSymptoms = SYMPTOMS.filter((_, i) => answers[i] === 1)
  const absentSymptoms  = SYMPTOMS.filter((_, i) => answers[i] === 0)

  return (
    <div className="ic-result-wrapper">

      {/* Header */}
      <div className="ic-result-header">
        <button className="ic-back-btn" onClick={onBack} aria-label="Go back">
          {t('sc_back')}
        </button>
        <span className="ic-title">{t('hc_result_title')}</span>
      </div>

      {/* Diagnosis card */}
      <div className="ic-result-card">
        <div className="ic-result-label">{t('nc_predicted_cond')}</div>
        <div className="ic-result-disease">{t(`disease_${disease.toLowerCase().replace(/\s|\(|\)/g, '_')}`)}</div>

        {/* Severity chip */}
        <span className={`ic-severity-chip ${severity}`}>
          {t(sevKey)}
        </span>

        <div className="ic-divider" />

        {/* Remedy List */}
        <div className="ic-remedy-label">{t('nc_action_plan')}</div>
        <p className="ic-remedy-text" style={{ whiteSpace: 'pre-line' }}>{t(`remedy_injury_${disease.toLowerCase().replace(/\s|\(|\)/g, '_')}`)}</p>
      </div>

      {/* Symptom summary */}
      <div className="ic-symptom-summary">
        <div className="ic-symptom-summary-title">{t('hc_your_symptoms')}</div>
        <div className="ic-symptom-pills">
          {presentSymptoms.map(s => (
            <span key={s} className="ic-symptom-pill present">{t(`symp_${s.toLowerCase().replace(/\s|\(|\)/g, '_')}`)}</span>
          ))}
          {absentSymptoms.map(s => (
            <span key={s} className="ic-symptom-pill absent">{t(`symp_${s.toLowerCase().replace(/\s|\(|\)/g, '_')}`)}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="ic-result-actions">
        <button className="ic-restart-btn" onClick={onRestart}>
          {t('hc_try_again')}
        </button>
        <button className="ic-home-btn" onClick={onBack}>
          {t('hc_back_cat')}
        </button>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SCREEN  ──────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════ */
export default function InjuryChecker({ onBack }) {
  const { t } = useLanguage()
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
          {step === 0 ? t('sc_back') : t('hc_prev')}
        </button>
        <span className="ic-title">{t('injury_checker_title')}</span>
      </div>

      <div className="ic-progress-wrap" role="progressbar">
        <div className="ic-progress-label">
          <span>{t('hc_q')} {step + 1} {t('hc_of')} {total}</span>
          <span>{Math.round(progress)}{t('hc_complete')}</span>
        </div>
        <div className="ic-progress-track">
          <div className="ic-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="ic-card" key={slideKey}>
        <div className="ic-symptom-badge">
          {t('injury_checker_badge')} {step + 1}
        </div>

        <p className="ic-question">
          {t('hc_do_you_have')} <strong>{t(`symp_${SYMPTOMS[step].toLowerCase().replace(/\s|\(|\)/g, '_')}`)}</strong>?
        </p>

        <div className="ic-choices">
          <button
            className={`ic-choice-btn yes${current === 1 ? ' selected' : ''}`}
            onClick={() => handleChoice(1)}
          >
            <span className="ic-choice-icon">{YES_ICON}</span>
            {t('hc_yes')}
          </button>

          <button
            className={`ic-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
          >
            <span className="ic-choice-icon">{NO_ICON}</span>
            {t('hc_no')}
          </button>
        </div>
      </div>

      <div className="ic-nav">
        <button className="ic-nav-btn" onClick={goPrev} disabled={step === 0}>
          {t('hc_prev')}
        </button>

        <button className="ic-next-btn" onClick={goNext} disabled={!canProceed}>
          {isLastSlide ? t('hc_see_results') : t('hc_next')}
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
