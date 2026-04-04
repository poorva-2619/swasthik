import { useLanguage } from '../context/LanguageContext'
import './Dashboard.css'

export default function Dashboard({ user, onBack, onCheckSymptoms, onNearbyClinic, onHistoryClick }) {
  const { t } = useLanguage()
  return (
    <div className="db-wrapper">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="db-header">
        <button id="db-back-btn" className="db-back-btn" onClick={onBack} aria-label="Go back">
          {t('db_back')}
        </button>
        <h1 className="db-title">{t('db_hi')} {user?.name?.split(' ')[0] || t('db_there')} 👋</h1>
      </div>

      <p className="db-subtitle">{t('db_subtitle')}</p>

      {/* ── Two Action Cards ─────────────────────────────────── */}
      <div className="db-grid" role="region" aria-label="Main actions">

        {/* Card 1 – Check Symptoms */}
        <button
          id="db-check-symptoms-btn"
          className="db-card db-card--green"
          onClick={onCheckSymptoms}
          aria-label="Check Symptoms"
        >
          <div className="db-card-glow db-card-glow--green" aria-hidden="true" />
          <span className="db-card-icon" aria-hidden="true">🩺</span>
          <h2 className="db-card-title">{t('db_check_symp')}</h2>
          <p className="db-card-desc">
            {t('db_check_symp_desc')}
          </p>
          <div className="db-card-bar db-card-bar--green" aria-hidden="true" />
        </button>

        {/* Card 2 – Nearby Clinic */}
        <button
          id="db-nearby-clinic-btn"
          className="db-card db-card--blue"
          onClick={onNearbyClinic}
          aria-label="Find Nearby Clinic"
        >
          <div className="db-card-glow db-card-glow--blue" aria-hidden="true" />
          <span className="db-card-icon" aria-hidden="true">🏥</span>
          <h2 className="db-card-title">{t('db_nearby')}</h2>
          <p className="db-card-desc">
            {t('db_nearby_desc')}
          </p>
          <div className="db-card-bar db-card-bar--blue" aria-hidden="true" />
        </button>

        {/* Card 3 - History */}
        <button
          id="db-history-btn"
          className="db-card db-card--amber"
          onClick={onHistoryClick}
          aria-label="View Patient History"
        >
          <div className="db-card-glow db-card-glow--amber" aria-hidden="true" />
          <span className="db-card-icon" aria-hidden="true">📜</span>
          <h2 className="db-card-title">{t('db_history')}</h2>
          <p className="db-card-desc">
            {t('db_history_desc')}
          </p>
          <div className="db-card-bar db-card-bar--amber" aria-hidden="true" />
        </button>

      </div>

      {/* ── User summary pill ────────────────────────────────── */}
      {user && (
        <div className="db-user-pill" aria-label="Logged in user details">
          <span className="db-user-avatar">👤</span>
          <span className="db-user-info">
            {user.name} · {user.age} {t('db_yrs')} · {t(`gender_${user.gender?.toLowerCase()?.replace(/\s+/g, '_')}`)} · {user.locality}
          </span>
        </div>
      )}

    </div>
  )
}
