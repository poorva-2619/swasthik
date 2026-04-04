import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './UserProfile.css'

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say']
const OCCUPATIONS = [
  'Farmer',
  'Daily Wage Worker',
  'Student',
  'Homemaker',
  'Self-Employed',
  'Government Employee',
  'Private Employee',
  'Other',
]

export default function UserProfile({ user, onBack, onProceed, savedData }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(
    savedData || {
      name: '',
      age: '',
      gender: '',
      occupation: '',
      locality: '',
    }
  )
  const [errors, setErrors] = useState({})

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())       e.name       = t('up_err_name')
    if (!form.age || form.age < 1 || form.age > 120) e.age = t('up_err_age')
    if (!form.gender)            e.gender     = t('up_err_gender')
    if (!form.occupation)        e.occupation = t('up_err_occ')
    if (!form.locality.trim())   e.locality   = t('up_err_loc')
    return e
  }

  const handleProceed = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_no: user.contact_no,
          name: form.name,
          age: Number(form.age),
          gender: form.gender,
          occupation: form.occupation,
          locality: form.locality
        })
      });
      const data = await response.json();
      if (response.ok) {
        onProceed(data);
      } else {
        alert(data.error || t('up_err_failed'));
      }
    } catch (err) {
      alert(t('up_err_network'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="up-wrapper">
      {/* Header */}
      <div className="up-header">
        <button id="up-back-btn" className="up-back-btn" onClick={onBack} aria-label="Go back">
          {t('up_back')}
        </button>
        <h1 className="up-title">{t('up_title')}</h1>
      </div>

      <p className="up-subtitle">
        {t('up_subtitle')}
      </p>

      <div className="up-form" role="form" aria-label="User profile form">

        {/* Name */}
        <div className="up-field">
          <label className="up-label" htmlFor="up-name">
            <span className="up-label-icon">👤</span> {t('up_name_label')}
          </label>
          <input
            id="up-name"
            className={`up-input${errors.name ? ' up-input--error' : ''}`}
            type="text"
            placeholder={t('up_name_ph')}
            value={form.name}
            onChange={e => set('name', e.target.value)}
            autoComplete="name"
          />
          {errors.name && <span className="up-error">{errors.name}</span>}
        </div>

        {/* Age */}
        <div className="up-field">
          <label className="up-label" htmlFor="up-age">
            <span className="up-label-icon">🎂</span> {t('up_age_label')}
          </label>
          <input
            id="up-age"
            className={`up-input${errors.age ? ' up-input--error' : ''}`}
            type="number"
            placeholder={t('up_age_ph')}
            min="1"
            max="120"
            value={form.age}
            onChange={e => set('age', e.target.value)}
          />
          {errors.age && <span className="up-error">{errors.age}</span>}
        </div>

        {/* Gender */}
        <div className="up-field">
          <div className="up-label">
            <span className="up-label-icon">⚧️</span> {t('up_gender_label')}
          </div>
          <div className="up-pill-group" role="group" aria-label="Gender options">
            {GENDERS.map(g => {
              // Convert to key: Male -> gender_male, Prefer not to say -> gender_prefer_not_to_say
              const key = `gender_${g.toLowerCase().replace(/\s+/g, '_')}`;
              return (
                <button
                  key={g}
                  id={`up-gender-${g.toLowerCase().replace(/\s+/g, '-')}`}
                  type="button"
                  className={`up-pill${form.gender === g ? ' up-pill--active' : ''}${errors.gender ? ' up-pill--err' : ''}`}
                  onClick={() => set('gender', g)}
                  aria-pressed={form.gender === g}
                >
                  {t(key)}
                </button>
              );
            })}
          </div>
          {errors.gender && <span className="up-error">{errors.gender}</span>}
        </div>

        {/* Occupation */}
        <div className="up-field">
          <label className="up-label" htmlFor="up-occupation">
            <span className="up-label-icon">💼</span> {t('up_occ_label')}
          </label>
          <select
            id="up-occupation"
            className={`up-select${errors.occupation ? ' up-input--error' : ''}`}
            value={form.occupation}
            onChange={e => set('occupation', e.target.value)}
          >
            <option value="">{t('up_occ_select')}</option>
            {OCCUPATIONS.map(o => {
              const key = o === 'Daily Wage Worker' ? 'occ_daily_wage' 
                         : o === 'Self-Employed' ? 'occ_self_employed'
                         : o === 'Government Employee' ? 'occ_govt_employee'
                         : o === 'Private Employee' ? 'occ_pvt_employee'
                         : `occ_${o.toLowerCase()}`;
              return <option key={o} value={o}>{t(key)}</option>;
            })}
          </select>
          {errors.occupation && <span className="up-error">{errors.occupation}</span>}
        </div>

        {/* Locality */}
        <div className="up-field">
          <label className="up-label" htmlFor="up-locality">
            <span className="up-label-icon">📍</span> {t('up_loc_label')}
          </label>
          <input
            id="up-locality"
            className={`up-input${errors.locality ? ' up-input--error' : ''}`}
            type="text"
            placeholder={t('up_loc_ph')}
            value={form.locality}
            onChange={e => set('locality', e.target.value)}
          />
          {errors.locality && <span className="up-error">{errors.locality}</span>}
        </div>

      </div>

      {/* Proceed Button */}
      <button
        id="up-proceed-btn"
        className="up-proceed-btn"
        onClick={handleProceed}
        aria-label="Save Patient Profile"
        disabled={loading}
      >
        <span className="up-proceed-icon">{loading ? '⏳' : '🩺'}</span>
        {loading ? t('up_btn_saving') : t('up_btn_save')}
      </button>
    </div>
  )
}
