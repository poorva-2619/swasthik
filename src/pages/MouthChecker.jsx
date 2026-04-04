import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './MouthChecker.css'
import { SYMPTOMS, predictDisease } from './mouthModel'

/* ── Severity metadata per predicted disease ─────────────── */
const SEVERITY = {
  'Mouth Ulcers': { level: 'mild', labelKey: 'sev_mild' },
  'Aphthous Ulcer': { level: 'moderate', labelKey: 'sev_moderate' },
  'Severe Ulcer': { level: 'serious', labelKey: 'sev_serious' },
  'Vitamin Deficiency Ulcer': { level: 'moderate', labelKey: 'sev_moderate' },
  'Tooth Decay': { level: 'moderate', labelKey: 'sev_moderate' },
  'Gingivitis': { level: 'mild', labelKey: 'sev_mild' },
  'Periodontitis': { level: 'serious', labelKey: 'sev_serious' },
  'Oral Infection': { level: 'serious', labelKey: 'sev_serious' },
  'Cavity': { level: 'moderate', labelKey: 'sev_moderate' },
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
      <div className="mc-result-wrapper">
        <div className="mc-result-header">
          <button className="mc-back-btn" onClick={onBack} aria-label="Go back">
            {t('hc_back_cat') || '← Back to Categories'}
          </button>
          <span className="mc-title">{t('mouth_checker_title') || 'Mouth Checker'}</span>
        </div>

        <div className="mc-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>🦷</div>
          <div className="mc-result-disease">{t('hc_no_symptoms') || 'No Symptoms Detected'}</div>
          <div className="mc-divider" />
          <p className="mc-remedy-text">
            {t('mouthc_no_symptoms_desc') || "You haven't reported any significant mouth symptoms. Keep up the good oral hygiene, brush twice a day, and visit your dentist for regular checkups."}
          </p>
        </div>

        <div className="mc-result-actions">
          <button className="mc-restart-btn" onClick={onRestart}>
            {t('hc_try_again') || '🔄 Retake Quiz'}
          </button>
          <button className="mc-home-btn" onClick={onBack}>
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
    <div className="mc-result-wrapper">

      {/* Header */}
      <div className="mc-result-header">
        <button className="mc-back-btn" onClick={onBack} aria-label="Go back">
          {t('sc_back') || '← Back'}
        </button>
        <span className="mc-title">{t('hc_result_title') || 'Your Result'}</span>
      </div>

      {/* Diagnosis card */}
      <div className="mc-result-card">
        <div className="mc-result-label">{t('hc_possible_cond') || 'Possible Condition'}</div>
        <div className="mc-result-disease">
           {t(`disease_${disease.toLowerCase().replace(/\s+/g, '_')}`) === `disease_${disease.toLowerCase().replace(/\s+/g, '_')}` 
              ? disease 
              : t(`disease_${disease.toLowerCase().replace(/\s+/g, '_')}`)}
        </div>

        {/* Severity chip */}
        <span className={`mc-severity-chip ${sev.level}`}>
          {t(sev.labelKey) || sev.level}
        </span>

        <div className="mc-divider" />

        {/* Remedy */}
        <div className="mc-remedy-label">{t('hc_sug_action') || 'Suggested Action'}</div>
        <p className="mc-remedy-text">
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
      <div className="mc-symptom-summary">
        <div className="mc-symptom-summary-title">{t('hc_your_symptoms') || 'Your Symptoms'}</div>
        <div className="mc-symptom-pills">
          {presentSymptoms.map(s => (
            <span key={s} className="mc-symptom-pill present">
               {t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`) === `symp_${s.toLowerCase().replace(/\s+/g, '_')}` 
                  ? s 
                  : t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`)}
            </span>
          ))}
          {absentSymptoms.map(s => (
            <span key={s} className="mc-symptom-pill absent">
               {t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`) === `symp_${s.toLowerCase().replace(/\s+/g, '_')}` 
                  ? s 
                  : t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`)}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mc-result-actions">
        <button className="mc-restart-btn" onClick={onRestart}>
          {t('hc_try_again') || '🔄 Retake Quiz'}
        </button>
        <button className="mc-home-btn" onClick={onBack}>
          {t('hc_back_cat') || '← Back to Categories'}
        </button>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SCREEN  (one symptom slide at a time)
   ═══════════════════════════════════════════════════════════ */
export default function MouthChecker({ onBack }) {
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
    <div className="mc-wrapper">

      {/* Header */}
      <div className="mc-header">
        <button
          className="mc-back-btn"
          onClick={step === 0 ? onBack : goPrev}
          aria-label={step === 0 ? 'Back to categories' : 'Previous question'}
        >
          {step === 0 ? (t('sc_back') || '← Back') : (t('hc_prev') || '← Prev')}
        </button>
        <span className="mc-title">{t('mouth_checker_title') || 'Mouth Checker'}</span>
      </div>

      {/* Progress bar */}
      <div className="mc-progress-wrap" role="progressbar"
           aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        <div className="mc-progress-label">
          <span>{(t('hc_q') || 'Question')} {step + 1} {(t('hc_of') || 'of')} {total}</span>
          <span>{Math.round(progress)}% {(t('hc_complete') || 'complete')}</span>
        </div>
        <div className="mc-progress-track">
          <div className="mc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card — key re-mounts on every slide change to replay animation */}
      <div className="mc-card" key={slideKey}>
        {/* Symptom badge */}
        <div className="mc-symptom-badge">
          {(t('mouth_checker_badge') || '🦷 Mouth · Symptom')} {step + 1}
        </div>

        {/* Question */}
        <p className="mc-question">
          {(t('hc_do_you_have') || 'Do you have')}{' '}
          <strong>
             {t(`symp_${SYMPTOMS[step].toLowerCase().replace(/\s+/g, '_')}`) === `symp_${SYMPTOMS[step].toLowerCase().replace(/\s+/g, '_')}`
                 ? SYMPTOMS[step]
                 : t(`symp_${SYMPTOMS[step].toLowerCase().replace(/\s+/g, '_')}`)}
          </strong>?
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
            {t('hc_yes') || 'Yes'}
          </button>

          <button
            id={`mc-no-${step}`}
            className={`mc-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
            aria-pressed={current === 0}
          >
            <span className="mc-choice-icon">{NO_ICON}</span>
            {t('hc_no') || 'No'}
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
          {t('hc_prev') || '← Prev'}
        </button>

        <button
          className="mc-next-btn"
          onClick={goNext}
          disabled={!canProceed}
          aria-label={isLastSlide ? 'See results' : 'Next question'}
        >
          {isLastSlide ? (t('hc_see_results') || 'See Results →') : (t('hc_next') || 'Next →')}
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
