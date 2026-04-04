import { useLanguage } from '../context/LanguageContext'
import './HealthTips.css'

/* ─── Data ──────────────────────────────────────────────── */
// Moved to inside component to allow 't' hook usage

/* ─── Component ─────────────────────────────────────────── */
export default function HealthTips({ onBack }) {
  const { t } = useLanguage()

  const TIPS = [
    { id: '1', icon: '🧼', title: t('ht_tip1_title'), desc: t('ht_tip1_desc'), accent: '#a855f7' },
    { id: '2', icon: '💧', title: t('ht_tip2_title'), desc: t('ht_tip2_desc'), accent: '#3b82f6' },
    { id: '3', icon: '😴', title: t('ht_tip3_title'), desc: t('ht_tip3_desc'), accent: '#f59e0b' },
    { id: '4', icon: '🥬', title: t('ht_tip4_title'), desc: t('ht_tip4_desc'), accent: '#22c55e' },
    { id: '5', icon: '🦟', title: t('ht_tip5_title'), desc: t('ht_tip5_desc'), accent: '#ef4444' },
    { id: '6', icon: '💉', title: t('ht_tip6_title'), desc: t('ht_tip6_desc'), accent: '#60a5fa' },
    { id: '7', icon: '🥤', title: t('ht_tip7_title'), desc: t('ht_tip7_desc'), accent: '#f97316' },
    { id: '8', icon: '🌞', title: t('ht_tip8_title'), desc: t('ht_tip8_desc'), accent: '#eab308' },
  ]
  
  const SEASONS = [
    { id: '1', icon: '🟡', label: t('ht_season1_label'), tips: t('ht_season1_tips') },
    { id: '2', icon: '🔵', label: t('ht_season2_label'), tips: t('ht_season2_tips') },
    { id: '3', icon: '❄️', label: t('ht_season3_label'), tips: t('ht_season3_tips') },
  ]


  return (
    <div className="ht-wrapper">
      {/* Header */}
      <div className="ht-header">
        <button id="ht-back-btn" className="ht-back-btn" onClick={onBack} aria-label="Go back">
          {t('sc_back')}
        </button>
        <h1 className="ht-title">{t('ht_page_title')}</h1>
      </div>

      {/* Tips grid */}
      <div className="ht-grid" role="list" aria-label="Health tips">
        {TIPS.map(tip => (
          <div
            key={tip.id}
            id={`tip-${tip.id}`}
            className="ht-card"
            role="listitem"
            style={{ '--tip-accent': tip.accent }}
          >
            <span className="ht-card-icon" aria-hidden="true">{tip.icon}</span>
            <h2 className="ht-card-title">{tip.title}</h2>
            <p className="ht-card-desc">{tip.desc}</p>
            <div className="ht-card-bar" aria-hidden="true" />
          </div>
        ))}
      </div>

      {/* Seasonal precautions */}
      <div className="ht-seasonal" role="region" aria-labelledby="seasonal-heading">
        <h2 className="ht-seasonal-title" id="seasonal-heading">
          <span aria-hidden="true">📋</span> {t('ht_seasonal_title')}
        </h2>

        <div className="ht-season-list">
          {SEASONS.map(s => (
            <div key={s.id} id={`season-${s.id}`} className="ht-season-card">
              <div className="ht-season-header">
                <span className="ht-season-icon" aria-hidden="true">{s.icon}</span>
                <span className="ht-season-label">{s.label}</span>
              </div>
              <p className="ht-season-tips">{s.tips}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
