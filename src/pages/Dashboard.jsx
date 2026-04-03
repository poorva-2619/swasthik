import './Dashboard.css'

export default function Dashboard({ user, onBack, onCheckSymptoms, onNearbyClinic, onHistoryClick }) {
  return (
    <div className="db-wrapper">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="db-header">
        <button id="db-back-btn" className="db-back-btn" onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <h1 className="db-title">Hi, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
      </div>

      <p className="db-subtitle">What would you like to do today?</p>

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
          <h2 className="db-card-title">Check Symptoms</h2>
          <p className="db-card-desc">
            Answer a few questions and get instant health guidance based on your symptoms.
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
          <h2 className="db-card-title">Nearby Clinic</h2>
          <p className="db-card-desc">
            Locate the nearest PHC, hospital, or health centre in your area.
          </p>
          <div className="db-card-bar db-card-bar--blue" aria-hidden="true" />
        </button>

        {/* Card 3 - History */}
        <button
          className="db-card"
          onClick={onHistoryClick}
          aria-label="View Patient History"
          style={{ '--card-accent': '#f59e0b' }}
        >
          <div className="db-card-glow db-card-glow--yellow" aria-hidden="true" style={{ background: 'radial-gradient(circle at top right, rgba(245, 158, 11, 0.15), transparent 70%)' }} />
          <span className="db-card-icon" aria-hidden="true">📜</span>
          <h2 className="db-card-title">View History</h2>
          <p className="db-card-desc">
            Check your previous diagnoses and symptoms.
          </p>
        </button>

      </div>

      {/* ── User summary pill ────────────────────────────────── */}
      {user && (
        <div className="db-user-pill" aria-label="Logged in user details">
          <span className="db-user-avatar">👤</span>
          <span className="db-user-info">
            {user.name} · {user.age} yrs · {user.gender} · {user.locality}
          </span>
        </div>
      )}

    </div>
  )
}
