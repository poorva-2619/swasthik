import { useState } from 'react'
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

export default function UserProfile({ onBack, onProceed, savedData }) {
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
    if (!form.name.trim())       e.name       = 'Please enter your name'
    if (!form.age || form.age < 1 || form.age > 120) e.age = 'Enter a valid age (1–120)'
    if (!form.gender)            e.gender     = 'Please select your gender'
    if (!form.occupation)        e.occupation = 'Please select your occupation'
    if (!form.locality.trim())   e.locality   = 'Please enter your locality'
    return e
  }

  const handleProceed = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onProceed(form)
  }

  return (
    <div className="up-wrapper">
      {/* Header */}
      <div className="up-header">
        <button id="up-back-btn" className="up-back-btn" onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <h1 className="up-title">Your Profile</h1>
      </div>

      <p className="up-subtitle">
        Help us personalise your health guidance by sharing a few details.
      </p>

      <div className="up-form" role="form" aria-label="User profile form">

        {/* Name */}
        <div className="up-field">
          <label className="up-label" htmlFor="up-name">
            <span className="up-label-icon">👤</span> Full Name
          </label>
          <input
            id="up-name"
            className={`up-input${errors.name ? ' up-input--error' : ''}`}
            type="text"
            placeholder="e.g. Priya Sharma"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            autoComplete="name"
          />
          {errors.name && <span className="up-error">{errors.name}</span>}
        </div>

        {/* Age */}
        <div className="up-field">
          <label className="up-label" htmlFor="up-age">
            <span className="up-label-icon">🎂</span> Age
          </label>
          <input
            id="up-age"
            className={`up-input${errors.age ? ' up-input--error' : ''}`}
            type="number"
            placeholder="e.g. 28"
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
            <span className="up-label-icon">⚧️</span> Gender
          </div>
          <div className="up-pill-group" role="group" aria-label="Gender options">
            {GENDERS.map(g => (
              <button
                key={g}
                id={`up-gender-${g.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                className={`up-pill${form.gender === g ? ' up-pill--active' : ''}${errors.gender ? ' up-pill--err' : ''}`}
                onClick={() => set('gender', g)}
                aria-pressed={form.gender === g}
              >
                {g}
              </button>
            ))}
          </div>
          {errors.gender && <span className="up-error">{errors.gender}</span>}
        </div>

        {/* Occupation */}
        <div className="up-field">
          <label className="up-label" htmlFor="up-occupation">
            <span className="up-label-icon">💼</span> Occupation
          </label>
          <select
            id="up-occupation"
            className={`up-select${errors.occupation ? ' up-input--error' : ''}`}
            value={form.occupation}
            onChange={e => set('occupation', e.target.value)}
          >
            <option value="">Select your occupation…</option>
            {OCCUPATIONS.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          {errors.occupation && <span className="up-error">{errors.occupation}</span>}
        </div>

        {/* Locality */}
        <div className="up-field">
          <label className="up-label" htmlFor="up-locality">
            <span className="up-label-icon">📍</span> Locality / Village / Town
          </label>
          <input
            id="up-locality"
            className={`up-input${errors.locality ? ' up-input--error' : ''}`}
            type="text"
            placeholder="e.g. Rampur, Uttar Pradesh"
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
        aria-label="Proceed to symptom checker"
      >
        <span className="up-proceed-icon">🩺</span>
        Proceed
      </button>
    </div>
  )
}
