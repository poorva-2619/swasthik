import React from 'react';
import './NearbyClinic.css';

export default function NearbyClinic({ user, userLocation, onBack }) {
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
    { name: 'Primary Health Centre (PHC)', icon: '🏥' },
    { name: 'Community Health Centre (CHC)', icon: '🏥' }, // Using hospital emoji for CHC as per screenshot roughly
    { name: 'District Hospital', icon: '🏛️' },
    { name: 'AYUSH / Ayurvedic Centre', icon: '🌿' },
    { name: 'ASHA Worker', icon: '👩‍⚕️' }
  ];

  const helplines = [
    { number: '108', label: 'Free Ambulance', icon: '🚑', borderColor: 'border-red-light' },
    { number: '112', label: 'Emergency Services', icon: '🚨', borderColor: 'border-red' },
    { number: '104', label: 'Health Helpline', icon: '📞', borderColor: 'border-pink' },
    { number: '1098', label: 'Child Helpline', icon: '👶', borderColor: 'border-indigo' },
    { number: '181', label: 'Women Helpline', icon: '👩', borderColor: 'border-purple' },
    { number: '1800-180-1104', label: 'Mental Health (NIMHANS)', icon: '🧠', borderColor: 'border-indigo' }
  ];

  return (
    <div className="nc-wrapper" role="main">
      
      {/* Header */}
      <div className="nc-header">
        <button className="nc-back-btn" onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <h1 className="nc-title">Find Nearby Clinic</h1>
      </div>

      {/* Facilities Section */}
      <section className="nc-section" aria-label="Government Health Facilities">
        <h2 className="nc-section-title">Government Health Facilities (Free)</h2>
        
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
                <span className="nc-facility-free-badge">FREE</span>
              </div>
              <span className="nc-facility-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* Emergency Helplines Section */}
      <section className="nc-section" aria-label="Emergency Helplines">
        <h2 className="nc-section-title pinkish">📞 Emergency Helplines</h2>
        
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
          <span aria-hidden="true">💡</span> Did You Know?
        </div>
        <ul className="nc-dyk-list">
          <li>Anti-rabies vaccines are available <span className="text-green-highlight">FREE</span> at government hospitals</li>
          <li>Anti-snake venom is available <span className="text-green-highlight">FREE</span> at District Hospitals</li>
          <li>DOTS treatment for TB is completely <span className="text-green-highlight">FREE</span></li>
          <li>Delivery and maternal care are <span className="text-green-highlight">FREE</span> at PHC/CHC</li>
          <li>Jan Aushadhi stores offer medicines at <span className="text-green-highlight">60-90% discounts</span></li>
        </ul>
      </section>

    </div>
  );
}
