import { useState } from 'react'
import './App.css'
import HealthTips from './pages/HealthTips'
import UserProfile from './pages/UserProfile'

/* ─── Language data ─────────────────────────────────────── */
const LANGUAGES = [
  { code: 'en',  label: 'English',  script: 'English' },
  { code: 'hi',  label: 'Hindi',    script: 'हिंदी'   },
  { code: 'gu',  label: 'Gujarati', script: 'ગુજરાતી' },
  { code: 'bn',  label: 'Bengali',  script: 'বাংলা'   },
  { code: 'ta',  label: 'Tamil',    script: 'தமிழ்'   },
  { code: 'mr',  label: 'Marathi',  script: 'मराठी'   },
  { code: 'te',  label: 'Telugu',   script: 'తెలుగు'  },
]

export default function App() {
  const [selectedLang, setSelectedLang] = useState('en')
  const [page, setPage] = useState('home')
  const [userProfile, setUserProfile] = useState(null)

  if (page === 'health-tips') {
    return <HealthTips onBack={() => setPage('home')} />
  }

  if (page === 'user-profile') {
    return (
      <UserProfile
        onBack={() => setPage('home')}
        onProceed={(data) => { setUserProfile(data); setPage('home') }}
        savedData={userProfile}
      />
    )
  }

  return (
    <main className="app-wrapper" role="main">

      {/* ── Hero / Brand ──────────────────────────────────── */}
      <section className="hero" aria-label="Swasth brand">
        <div className="logo-ring" aria-hidden="true">
          <span className="logo-icon">🌿</span>
        </div>

        <h1 className="app-name">Swasth</h1>
        <p className="app-tagline">Your Rural Health Assistant</p>
        <p className="app-desc">
          Get instant symptom-based health guidance –<br />
          offline, free, and in your language.
        </p>

        <div className="feature-badges" aria-label="Key features">
          <span className="badge"><span>✓</span> Free</span>
          <span className="badge"><span>⚡</span> Offline</span>
          <span className="badge"><span>🔒</span> Private</span>
        </div>
      </section>

      {/* ── Language Selector ─────────────────────────────── */}
      <div className="card" role="region" aria-labelledby="lang-label">
        <div className="section-label" id="lang-label">
          <span className="globe-icon">🌐</span>
          Select your language
        </div>

        <div className="lang-grid" role="group" aria-label="Language options">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              id={`lang-btn-${lang.code}`}
              className={`lang-btn${selectedLang === lang.code ? ' active' : ''}`}
              onClick={() => setSelectedLang(lang.code)}
              aria-pressed={selectedLang === lang.code}
              aria-label={lang.label}
            >
              {lang.script}
            </button>
          ))}
        </div>
      </div>


      {/* ── Check Symptoms CTA ────────────────────────────── */}
      <button
        id="check-symptoms-btn"
        className="cta-btn"
        aria-label="Check symptoms"
        onClick={() => setPage('user-profile')}
      >
        <span className="cta-icon">🩺</span>
        Check Symptoms
      </button>

      {/* ── Quick Actions ─────────────────────────────────── */}
      <div className="quick-grid" role="region" aria-label="Quick actions">
        <button id="health-tips-btn" className="quick-card" aria-label="Health Tips" onClick={() => setPage('health-tips')}>
          <span className="quick-icon">💡</span>
          <span className="quick-label">Health Tips</span>
        </button>
        <button id="find-clinic-btn" className="quick-card" aria-label="Find Clinic">
          <span className="quick-icon">🏥</span>
          <span className="quick-label">Find Clinic</span>
        </button>
      </div>

      {/* ── Emergency Buttons ─────────────────────────────── */}
      <div className="emergency-row" role="region" aria-label="Emergency contacts">
        <a
          id="ambulance-btn"
          href="tel:108"
          className="emg-btn"
          aria-label="Call 108 – Free Ambulance"
        >
          <span className="emg-icon">📞</span>
          108 – Free Ambulance
        </a>
        <a
          id="emergency-btn"
          href="tel:112"
          className="emg-btn"
          aria-label="Call 112 – Emergency"
        >
          <span className="emg-icon">🚨</span>
          112 – Emergency
        </a>
      </div>

    </main>
  )
}
