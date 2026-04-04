import { useLanguage } from '../context/LanguageContext'
import './SymptomCategories.css'

/* ── Category data ───────────────────────────────────────── */
const CATEGORIES = [
  { id: 'common-diseases',   icon: '🦠', label: 'Common Diseases',          accent: '#ef4444' },
  { id: 'self-assessment',   icon: '📋', label: 'Self Assessment',           accent: '#22c55e' },
  { id: 'head',              icon: '🧠', label: 'Head',                      accent: '#a855f7' },
  { id: 'eyes',              icon: '👁️', label: 'Eyes',                      accent: '#3b82f6' },
  { id: 'ears',              icon: '👂', label: 'Ears',                      accent: '#f59e0b' },
  { id: 'nose',              icon: '👃', label: 'Nose',                      accent: '#06b6d4' },
  { id: 'mouth',             icon: '🦷', label: 'Mouth',                     accent: '#ec4899' },
  { id: 'chest',             icon: '🫀', label: 'Chest',                     accent: '#f97316' },
  { id: 'lungs',             icon: '🫁', label: 'Lungs',                     accent: '#14b8a6' },
  { id: 'heart',             icon: '❤️', label: 'Heart',                     accent: '#ef4444' },
  { id: 'stomach',           icon: '🫃', label: 'Stomach',                   accent: '#eab308' },
  { id: 'bones',             icon: '🦴', label: 'Bones',                     accent: '#94a3b8' },
  { id: 'skin',              icon: '🩹', label: 'Skin',                      accent: '#fb923c' },
  { id: 'menstruation',      icon: '🩸', label: 'Menstruation',              accent: '#f43f5e' },
  { id: 'bleeding',          icon: '💉', label: 'Bleeding',                  accent: '#dc2626' },
  { id: 'allergy',           icon: '🤧', label: 'Allergy',                   accent: '#8b5cf6' },
  { id: 'burns-shock',       icon: '⚡', label: 'Burns & Electric Shock',    accent: '#fbbf24' },
  { id: 'heat-cold',         icon: '🌡️', label: 'Heat & Cold Problems',      accent: '#6366f1' },
]

export default function SymptomCategories({ onBack, onSelect }) {
  const { t } = useLanguage()

  return (
    <div className="sc-wrapper">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="sc-header">
        <button
          id="sc-back-btn"
          className="sc-back-btn"
          onClick={onBack}
          aria-label="Go back"
        >
          {t('sc_back')}
        </button>
        <h1 className="sc-title">{t('sc_title')}</h1>
      </div>

      <p className="sc-subtitle">{t('sc_subtitle')}</p>

      {/* ── Cards Grid ──────────────────────────────────────── */}
      <div className="sc-grid" role="list" aria-label="Symptom categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            id={`sc-card-${cat.id}`}
            className="sc-card"
            role="listitem"
            style={{ '--cat-accent': cat.accent }}
            onClick={() => onSelect?.(cat)}
            aria-label={cat.label}
          >
            {/* Glow blob */}
            <div className="sc-card-glow" aria-hidden="true" />

            {/* Icon bubble */}
            <div className="sc-icon-wrap" aria-hidden="true">
              <span className="sc-icon">{cat.icon}</span>
            </div>

            {/* Label */}
            <span className="sc-label">{t(`cat_${cat.id.replace(/-/g, '_')}`)}</span>

            {/* Accent bar */}
            <div className="sc-bar" aria-hidden="true" />
          </button>
        ))}
      </div>

    </div>
  )
}
