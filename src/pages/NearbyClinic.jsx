import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './NearbyClinic.css';

export default function NearbyClinic({ user, userLocation, onBack }) {
  const { t } = useLanguage();
  // Construct a Google Maps search URL based on facility type and user locality or coordinates
  const getMapUrl = (facility) => {
    // If we have precise GPS coordinates
    if (userLocation && userLocation.lat && userLocation.lng) {
      return `https://www.google.com/maps/search/${encodeURIComponent(facility)}/@${userLocation.lat},${userLocation.lng},13z/data=!3m1!4b1`;
    }
    
    // Fallback to text locality or 'near me'
    const loc = user?.locality ? `near ${user.locality}` : 'near me';
    return `https://www.google.com/maps/search/${encodeURIComponent(facility + ' ' + loc)}`;
  };

  const facilities = [
    { name: t('ncl_phc'), icon: '🏥' },
    { name: t('ncl_chc'), icon: '🏥' },
    { name: t('ncl_district'), icon: '🏛️' },
    { name: t('ncl_ayush'), icon: '🌿' },
    { name: t('ncl_asha'), icon: '👩‍⚕️' }
  ];

  const helplines = [
    { number: '108', label: t('ncl_free_amb'), icon: '🚑', borderColor: 'border-red-light' },
    { number: '112', label: t('ncl_emerg_services'), icon: '🚨', borderColor: 'border-red' },
    { number: '104', label: t('ncl_health_helpline'), icon: '📞', borderColor: 'border-pink' },
    { number: '1098', label: t('ncl_child_helpline'), icon: '👶', borderColor: 'border-indigo' },
    { number: '181', label: t('ncl_women_helpline'), icon: '👩', borderColor: 'border-purple' },
    { number: '1800-180-1104', label: t('ncl_mental_health'), icon: '🧠', borderColor: 'border-indigo' }
  ];

  return (
    <div className="nc-wrapper" role="main">
      
      {/* Header */}
      <div className="nc-header">
        <button className="nc-back-btn" onClick={onBack} aria-label="Go back">
          {t('sc_back')}
        </button>
        <h1 className="nc-title">{t('ncl_page_title')}</h1>
      </div>

      {/* Facilities Section */}
      <section className="nc-section" aria-label="Government Health Facilities">
        <h2 className="nc-section-title">{t('ncl_gov_facilities')}</h2>
        
        <div className="nc-facility-list">
          {facilities.map((fac, idx) => (
            <a
              key={idx}
              href={getMapUrl(fac.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="nc-facility-card"
              aria-label={`Find ${fac.name} on Google Maps`}
            >
              <span className="nc-facility-icon" aria-hidden="true">{fac.icon}</span>
              <div className="nc-facility-info">
                <span className="nc-facility-name">{fac.name}</span>
                <span className="nc-facility-free-badge">{t('ncl_free')}</span>
              </div>
              <span className="nc-facility-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* Emergency Helplines Section */}
      <section className="nc-section" aria-label="Emergency Helplines">
        <h2 className="nc-section-title pinkish">📞 {t('ncl_emerg_helplines')}</h2>
        
        <div className="nc-helpline-grid">
          {helplines.map((help, idx) => (
            <a 
              key={idx} 
              href={`tel:${help.number.replace(/-/g, '')}`} 
              className={`nc-helpline-card ${help.borderColor}`}
              aria-label={`Call ${help.label} at ${help.number}`}
            >
              <span className="nc-helpline-icon" aria-hidden="true">{help.icon}</span>
              <span className="nc-helpline-number">{help.number}</span>
              <span className="nc-helpline-label">{help.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Did You Know Box */}
      <section className="nc-dyk-box" aria-label="Did You Know facts">
        <div className="nc-dyk-title">
          <span aria-hidden="true">💡</span> {t('ncl_dyk_title')}
        </div>
        <ul className="nc-dyk-list">
          <li>{t('ncl_dyk_1_1')} <span className="text-green-highlight">{t('ncl_dyk_1_2')}</span>{t('ncl_dyk_1_3')}</li>
          <li>{t('ncl_dyk_2_1')} <span className="text-green-highlight">{t('ncl_dyk_2_2')}</span>{t('ncl_dyk_2_3')}</li>
          <li>{t('ncl_dyk_3_1')} <span className="text-green-highlight">{t('ncl_dyk_3_2')}</span></li>
          <li>{t('ncl_dyk_4_1')} <span className="text-green-highlight">{t('ncl_dyk_4_2')}</span>{t('ncl_dyk_4_3')}</li>
          <li>{t('ncl_dyk_5_1')} <span className="text-green-highlight">{t('ncl_dyk_5_2')}</span>{t('ncl_dyk_5_3')}</li>
        </ul>
      </section>

    </div>
  );
}
