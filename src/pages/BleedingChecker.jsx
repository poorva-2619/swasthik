import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './BleedingChecker.css'
import { SYMPTOMS, predictDisease } from './bleedingModel'

/* ── Severity metadata per predicted disease ─────────────── */
const SEVERITY = {
  'Laceration (Deep Cut)': { level: 'moderate', labelKey: 'sev_moderate' },
  'Severe Hemorrhage / Trauma': { level: 'serious', labelKey: 'sev_serious' },
  'Epistaxis (Nosebleed)': { level: 'mild', labelKey: 'sev_mild' },
  'Gastrointestinal (Internal) Bleeding': { level: 'serious', labelKey: 'sev_serious' },
  'Possible Bleeding Disorder': { level: 'serious', labelKey: 'sev_serious' },
  'Healthy': { level: 'mild', labelKey: 'sev_mild' },
  'Uncertain / Undiagnosed': { level: 'moderate', labelKey: 'sev_moderate' }
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
      <div className="bc-result-wrapper">
        <div className="bc-result-header">
          <button className="bc-back-btn" onClick={onBack} aria-label="Go back">
            {t('hc_back_cat') || '← Back to Categories'}
          </button>
          <span className="bc-title">{t('bleeding_checker_title') || 'Bleeding Checker'}</span>
        </div>

        <div className="bc-result-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>💉</div>
          <div className="bc-result-disease">{t('hc_no_symptoms') || 'No Symptoms Detected'}</div>
          <div className="bc-divider" />
          <p className="bc-remedy-text">
            {t('bcd_no_symptoms_desc') || "You haven't reported any bleeding instances. Keep a first-aid kit handy just in case!"}
          </p>
        </div>

        <div className="bc-result-actions">
          <button className="bc-restart-btn" onClick={onRestart}>
            {t('hc_try_again') || '🔄 Retake Quiz'}
          </button>
          <button className="bc-home-btn" onClick={onBack}>
            {t('hc_back_cat') || '← Back to Categories'}
          </button>
        </div>
      </div>
    )
  }

  /* ── Standard result ───────────────────────────────────── */
  const { disease, remedy, warning, confidence } = predictDisease(answers)
  const sev = SEVERITY[disease] ?? { level: 'moderate', labelKey: 'sev_moderate' }
  const presentSymptoms = SYMPTOMS.filter((_, i) => answers[i] === 1)
  const absentSymptoms  = SYMPTOMS.filter((_, i) => answers[i] === 0)

  // Confidence is an explicit feature of the Bleeding module
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="bc-result-wrapper">

      {/* Header */}
      <div className="bc-result-header">
        <button className="bc-back-btn" onClick={onBack} aria-label="Go back">
          {t('sc_back') || '← Back'}
        </button>
        <span className="bc-title">{t('hc_result_title') || 'Your Result'}</span>
      </div>

      {/* Diagnosis card */}
      <div className="bc-result-card">
        <div className="bc-result-label">{t('hc_possible_cond') || 'Possible Condition'}</div>
        <div className="bc-result-disease">
           {t(`disease_${disease.toLowerCase().replace(/\s+/g, '_')}`) === `disease_${disease.toLowerCase().replace(/\s+/g, '_')}` 
              ? disease 
              : t(`disease_${disease.toLowerCase().replace(/\s+/g, '_')}`)}
        </div>
        
        {/* Confidence Render Unique to Bleeding model */}
        {disease !== 'Healthy' && (
           <div className="bc-confidence-text">
             Confidence / Severity Match: {confidencePercent}%
           </div>
        )}

        {/* Severity chip */}
        <span className={`bc-severity-chip ${sev.level}`}>
          {t(sev.labelKey) || sev.level}
        </span>

        <div className="bc-divider" />

        {/* Remedy */}
        <div className="bc-remedy-label">{t('hc_sug_action') || 'First Aid & Suggested Steps'}</div>
        <p className="bc-remedy-text">
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
      <div className="bc-symptom-summary">
        <div className="bc-symptom-summary-title">{t('hc_your_symptoms') || 'Your Symptoms'}</div>
        <div className="bc-symptom-pills">
          {presentSymptoms.map(s => (
            <span key={s} className="bc-symptom-pill present">
               {t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`) === `symp_${s.toLowerCase().replace(/\s+/g, '_')}` 
                  ? s 
                  : t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`)}
            </span>
          ))}
          {absentSymptoms.map(s => (
            <span key={s} className="bc-symptom-pill absent">
               {t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`) === `symp_${s.toLowerCase().replace(/\s+/g, '_')}` 
                  ? s 
                  : t(`symp_${s.toLowerCase().replace(/\s+/g, '_')}`)}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bc-result-actions">
        <button className="bc-restart-btn" onClick={onRestart}>
          {t('hc_try_again') || '🔄 Retake Quiz'}
        </button>
        <button className="bc-home-btn" onClick={onBack}>
          {t('hc_back_cat') || '← Back to Categories'}
        </button>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUIZ SCREEN  (one symptom slide at a time)
   ═══════════════════════════════════════════════════════════ */
export default function BleedingChecker({ onBack }) {
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
    <div className="bc-wrapper">

      {/* Header */}
      <div className="bc-header">
        <button
          className="bc-back-btn"
          onClick={step === 0 ? onBack : goPrev}
          aria-label={step === 0 ? 'Back to categories' : 'Previous question'}
        >
          {step === 0 ? (t('sc_back') || '← Back') : (t('hc_prev') || '← Prev')}
        </button>
        <span className="bc-title">{t('bleeding_checker_title') || 'Bleeding Checker'}</span>
      </div>

      {/* Progress bar */}
      <div className="bc-progress-wrap" role="progressbar"
           aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        <div className="bc-progress-label">
          <span>{(t('hc_q') || 'Question')} {step + 1} {(t('hc_of') || 'of')} {total}</span>
          <span>{Math.round(progress)}% {(t('hc_complete') || 'complete')}</span>
        </div>
        <div className="bc-progress-track">
          <div className="bc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card — key re-mounts on every slide change to replay animation */}
      <div className="bc-card" key={slideKey}>
        {/* Symptom badge */}
        <div className="bc-symptom-badge">
          {(t('bleeding_checker_badge') || '💉 Bleed · Symptom')} {step + 1}
        </div>

        {/* Question */}
        <p className="bc-question">
          {(t('hc_do_you_have') || 'Do you have')}{' '}
          <strong>
             {t(`symp_${SYMPTOMS[step].toLowerCase().replace(/\s+/g, '_')}`) === `symp_${SYMPTOMS[step].toLowerCase().replace(/\s+/g, '_')}`
                 ? SYMPTOMS[step]
                 : t(`symp_${SYMPTOMS[step].toLowerCase().replace(/\s+/g, '_')}`)}
          </strong>?
        </p>

        {/* Yes / No */}
        <div className="bc-choices">
          <button
            id={`bc-yes-${step}`}
            className={`bc-choice-btn yes${current === 1 ? ' selected' : ''}`}
            onClick={() => handleChoice(1)}
            aria-pressed={current === 1}
          >
            <span className="bc-choice-icon">{YES_ICON}</span>
            {t('hc_yes') || 'Yes'}
          </button>

          <button
            id={`bc-no-${step}`}
            className={`bc-choice-btn no${current === 0 ? ' selected' : ''}`}
            onClick={() => handleChoice(0)}
            aria-pressed={current === 0}
          >
            <span className="bc-choice-icon">{NO_ICON}</span>
            {t('hc_no') || 'No'}
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="bc-nav">
        <button
          className="bc-nav-btn"
          onClick={goPrev}
          disabled={step === 0}
          aria-label="Previous question"
        >
          {t('hc_prev') || '← Prev'}
        </button>

        <button
          className="bc-next-btn"
          onClick={goNext}
          disabled={!canProceed}
          aria-label={isLastSlide ? 'See results' : 'Next question'}
        >
          {isLastSlide ? (t('hc_see_results') || 'See Results →') : (t('hc_next') || 'Next →')}
        </button>
      </div>

      {/* Dot indicators */}
      <div className="bc-dots" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              'bc-dot' +
              (i === step        ? ' current'  : '') +
              (answers[i] !== null && i !== step ? ' answered' : '')
            }
          />
        ))}
      </div>

    </div>
  )
}
