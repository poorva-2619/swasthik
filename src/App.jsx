import { useState } from 'react'
import './App.css'
import HealthTips from './pages/HealthTips'
import UserProfile from './pages/UserProfile'
import Dashboard from './pages/Dashboard'
import SymptomCategories from './pages/SymptomCategories'
import NearbyClinic from './pages/NearbyClinic'
import Auth from './pages/Auth'
import PatientSelection from './pages/PatientSelection'
import PatientHistory from './pages/PatientHistory'
import HeadChecker from './pages/HeadChecker'
import MensChecker from './pages/MensChecker'
import EyesChecker from './pages/EyesChecker'
import LungsChecker from './pages/LungsChecker'
import StomachChecker from './pages/StomachChecker'
import AllergyChecker from './pages/AllergyChecker'
import HeartChecker from './pages/HeartChecker'
import NoseChecker from './pages/NoseChecker'
import SkinChecker from './pages/SkinChecker'
import BoneChecker from './pages/BoneChecker'
import InjuryChecker from './pages/InjuryChecker'
import CommonChecker from './pages/CommonChecker'
import EarChecker from './pages/EarChecker'
import MouthChecker from './pages/MouthChecker'
import ChestChecker from './pages/ChestChecker'
import HeatColdChecker from './pages/HeatColdChecker'
import BleedingChecker from './pages/BleedingChecker'
import { useLanguage } from './context/LanguageContext'

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
  const { currentLang, setCurrentLang, t } = useLanguage()
  const [page, setPage] = useState('home')
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPatient, setCurrentPatient] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [isLocating, setIsLocating] = useState(false)

  const handleFindClinicWithLocation = () => {
    setIsLocating(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
          setIsLocating(false)
          setPage('nearby-clinic')
        },
        (error) => {
          console.warn('Geolocation failed:', error.message)
          setIsLocating(false)
          setPage('nearby-clinic') // Proceed anyway and fallback to general locality/near me
        },
        { timeout: 10000 }
      )
    } else {
      setIsLocating(false)
      setPage('nearby-clinic')
    }
  }

  const handleMockDiagnosis = async (cat) => {
    try {
      const response = await fetch('http://localhost:3000/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: currentPatient._id,
          symptoms: [cat.label],
          diagnosis_result: 'Mock Diagnosis Result for ' + cat.label
        })
      });
      if(response.ok) {
        setPage('patient-history');
      } else {
        const data = await response.json();
        alert(data.error || "Failed to save record");
      }
    } catch(err) {
      alert("Network Error while saving diagnosis record.");
    }
  };

  if (page === 'health-tips') {
    return <HealthTips onBack={() => setPage('home')} />
  }

  if (page === 'auth') {
    return (
      <Auth 
        onBack={() => setPage('home')} 
        onLogin={(user) => { setCurrentUser(user); setPage('patient-selection'); }} 
      />
    )
  }

  if (page === 'patient-selection') {
    return (
      <PatientSelection 
        user={currentUser}
        onBack={() => setPage('home')}
        onAddNew={() => setPage('add-patient')}
        onSelectPatient={(patient) => { setCurrentPatient(patient); setPage('dashboard'); }}
      />
    )
  }

  if (page === 'add-patient') {
    return (
      <UserProfile
        user={currentUser}
        onBack={() => setPage('patient-selection')}
        onProceed={(data) => { setCurrentPatient(data); setPage('dashboard') }}
      />
    )
  }

  if (page === 'patient-history') {
    return (
      <PatientHistory
        patient={currentPatient}
        onBack={() => setPage('dashboard')}
      />
    )
  }

  if (page === 'dashboard') {
    return (
      <Dashboard
        user={currentPatient}
        onBack={() => setPage('patient-selection')}
        onCheckSymptoms={() => setPage('symptom-categories')}
        onNearbyClinic={handleFindClinicWithLocation}
        onHistoryClick={() => setPage('patient-history')}
      />
    )
  }

  if (page === 'nearby-clinic') {
    return (
      <NearbyClinic 
        user={currentPatient} 
        userLocation={userLocation}
        onBack={() => setPage('dashboard')} 
      />
    )
  }

  if (page === 'symptom-categories') {
    return (
      <SymptomCategories
        onBack={() => setPage('dashboard')}
        onSelect={(cat) => {
          if (cat.id === 'head') setPage('head-checker')
          else if (cat.id === 'menstruation') setPage('mens-checker')
          else if (cat.id === 'eyes') setPage('eyes-checker')
          else if (cat.id === 'bones') setPage('bone-checker')
          else if (cat.id === 'burns-shock') setPage('injury-checker')
          else if (cat.id === 'common-diseases') setPage('common-checker')
          else if (cat.id === 'lungs') setPage('lungs-checker')
          else if (cat.id === 'stomach') setPage('stomach-checker')
          else if (cat.id === 'allergy') setPage('allergy-checker')
          else if (cat.id === 'heart') setPage('heart-checker')
          else if (cat.id === 'nose') setPage('nose-checker')
          else if (cat.id === 'skin') setPage('skin-checker')
          else if (cat.id === 'ears') setPage('ear-checker')
          else if (cat.id === 'mouth') setPage('mouth-checker')
          else if (cat.id === 'chest') setPage('chest-checker')
          else if (cat.id === 'heat-cold') setPage('heat-cold-checker')
          else if (cat.id === 'bleeding') setPage('bleeding-checker')
          else handleMockDiagnosis(cat)
        }}
      />
    )
  }

  if (page === 'bone-checker') {
    return (
      <BoneChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'common-checker') {
    return (
      <CommonChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'injury-checker') {
    return (
      <InjuryChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'head-checker') {
    return (
      <HeadChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'mens-checker') {
    return (
      <MensChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'eyes-checker') {
    return (
      <EyesChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'lungs-checker') {
    return (
      <LungsChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'stomach-checker') {
    return (
      <StomachChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'allergy-checker') {
    return (
      <AllergyChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'heart-checker') {
    return (
      <HeartChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'nose-checker') {
    return (
      <NoseChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'skin-checker') {
    return (
      <SkinChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'ear-checker') {
    return (
      <EarChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'mouth-checker') {
    return (
      <MouthChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'chest-checker') {
    return (
      <ChestChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'heat-cold-checker') {
    return (
      <HeatColdChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  if (page === 'bleeding-checker') {
    return (
      <BleedingChecker
        onBack={() => setPage('symptom-categories')}
      />
    )
  }

  return (
    <main className="app-wrapper" role="main">

      {/* ── Hero / Brand ──────────────────────────────────── */}
      <section className="hero" aria-label={t('app_name') + " brand"}>
        <div className="logo-ring" aria-hidden="true">
          <span className="logo-icon">🌿</span>
        </div>

        <h1 className="app-name">{t('app_name')}</h1>
        <p className="app-tagline">{t('app_tagline')}</p>
        <p className="app-desc">
          {t('app_desc_1')}<br />
          {t('app_desc_2')}
        </p>

        <div className="feature-badges" aria-label="Key features">
          <span className="badge"><span>✓</span> {t('badge_free')}</span>
          <span className="badge"><span>⚡</span> {t('badge_offline')}</span>
          <span className="badge"><span>🔒</span> {t('badge_private')}</span>
        </div>
      </section>

      {/* ── Language Selector ─────────────────────────────── */}
      <div className="card" role="region" aria-labelledby="lang-label">
        <div className="section-label" id="lang-label">
          <span className="globe-icon">🌐</span>
          {t('lang_select')}
        </div>

        <div className="lang-grid" role="group" aria-label="Language options">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              id={`lang-btn-${lang.code}`}
              className={`lang-btn${currentLang === lang.code ? ' active' : ''}`}
              onClick={() => setCurrentLang(lang.code)}
              aria-pressed={currentLang === lang.code}
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
        aria-label={t('btn_start')}
        onClick={() => setPage('auth')}
      >
        <span className="cta-icon">🩺</span>
        {t('btn_start')}
      </button>

      {/* ── Quick Actions ─────────────────────────────────── */}
      <div className="quick-grid" role="region" aria-label="Quick actions">
        <button id="health-tips-btn" className="quick-card" aria-label={t('quick_health_tips')} onClick={() => setPage('health-tips')}>
          <span className="quick-icon">💡</span>
          <span className="quick-label">{t('quick_health_tips')}</span>
        </button>
        <button id="find-clinic-btn" className="quick-card" aria-label={t('quick_find_clinic')} onClick={handleFindClinicWithLocation} disabled={isLocating}>
          <span className="quick-icon">{isLocating ? '⏳' : '🏥'}</span>
          <span className="quick-label">{isLocating ? t('quick_locating') : t('quick_find_clinic')}</span>
        </button>
      </div>

      {/* ── Emergency Buttons ─────────────────────────────── */}
      <div className="emergency-row" role="region" aria-label="Emergency contacts">
        <a
          id="ambulance-btn"
          href="tel:108"
          className="emg-btn"
          aria-label={t('emg_ambulance')}
        >
          <span className="emg-icon">📞</span>
          {t('emg_ambulance')}
        </a>
        <a
          id="emergency-btn"
          href="tel:112"
          className="emg-btn"
          aria-label={t('emg_emergency')}
        >
          <span className="emg-icon">🚨</span>
          {t('emg_emergency')}
        </a>
      </div>

    </main>
  )
}
