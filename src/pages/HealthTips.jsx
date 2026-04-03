import './HealthTips.css'

/* ─── Data ──────────────────────────────────────────────── */
const TIPS = [
  {
    id: 'wash-hands',
    icon: '🧼',
    title: 'Wash Hands Regularly',
    desc: 'Use soap for at least 20 seconds. Prevents most infections.',
    accent: '#a855f7',   // purple
  },
  {
    id: 'clean-water',
    icon: '💧',
    title: 'Drink Clean Water',
    desc: 'Always boil or purify water before drinking.',
    accent: '#3b82f6',   // blue
  },
  {
    id: 'sleep',
    icon: '😴',
    title: 'Sleep 7–8 Hours',
    desc: 'Good sleep strengthens immunity naturally.',
    accent: '#f59e0b',   // amber
  },
  {
    id: 'iron-foods',
    icon: '🥬',
    title: 'Eat Iron-Rich Foods',
    desc: 'Spinach, jaggery, lentils prevent anaemia.',
    accent: '#22c55e',   // green
  },
  {
    id: 'mosquito-nets',
    icon: '🦟',
    title: 'Use Mosquito Nets',
    desc: 'Prevent malaria, dengue, chikungunya.',
    accent: '#ef4444',   // red
  },
  {
    id: 'vaccinate',
    icon: '💉',
    title: 'Vaccinate Children',
    desc: 'Follow immunisation schedule regularly.',
    accent: '#60a5fa',   // sky-blue
  },
  {
    id: 'ors',
    icon: '🥤',
    title: 'ORS for Diarrhoea',
    desc: '6 tsp sugar + 1 tsp salt in 1 litre water.',
    accent: '#f97316',   // orange
  },
  {
    id: 'sun',
    icon: '🌞',
    title: 'Sun Protection',
    desc: 'Wear a hat and stay hydrated in summer.',
    accent: '#eab308',   // yellow
  },
]

const SEASONS = [
  {
    id: 'summer',
    icon: '🟡',
    label: 'Summer',
    tips: 'Stay hydrated. Drink raw mango panna. Avoid 12–4 PM sun. Use ORS if sweating heavily.',
  },
  {
    id: 'monsoon',
    icon: '🔵',
    label: 'Monsoon',
    tips: 'Boil all water. Use mosquito nets. Avoid street food. Watch for fever after mosquito bites.',
  },
  {
    id: 'winter',
    icon: '❄️',
    label: 'Winter',
    tips: 'Keep warm especially children. Cover mouth/nose. Steam inhalation for congestion.',
  },
]

/* ─── Component ─────────────────────────────────────────── */
export default function HealthTips({ onBack }) {
  return (
    <div className="ht-wrapper">
      {/* Header */}
      <div className="ht-header">
        <button id="ht-back-btn" className="ht-back-btn" onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <h1 className="ht-title">Health Tips</h1>
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
          <span aria-hidden="true">📋</span> Seasonal Precautions
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
