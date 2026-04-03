import { useState } from 'react';
import './Auth.css';

export default function Auth({ onBack, onLogin }) {
  const [contactNo, setContactNo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    if (!contactNo || contactNo.length < 10) {
      setError('Please enter a valid 10-digit number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact_no: contactNo })
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data.user);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Could not connect to server. Is MongoDB running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <button className="auth-back-btn" onClick={onBack}>← Back</button>
        <h1 className="auth-title">Login / Register</h1>
      </div>
      
      <p className="auth-subtitle">
        Enter your mobile number to view past records or create patient profiles.
      </p>

      <div className="auth-form">
        <div className="auth-field">
          <label className="auth-label" htmlFor="contact-no">
            <span className="auth-label-icon">📱</span> Mobile Number
          </label>
          <div className="phone-input-group">
            <span className="phone-prefix">+91</span>
            <input
              id="contact-no"
              className={`auth-input ${error ? 'auth-input--error' : ''}`}
              type="text"
              placeholder="e.g. 9876543210"
              value={contactNo}
              onChange={e => setContactNo(e.target.value.replace(/\D/g, ''))}
              maxLength="10"
            />
          </div>
          {error && <span className="auth-error">{error}</span>}
        </div>
      </div>

      <button
        className="auth-proceed-btn"
        onClick={handleProceed}
        disabled={loading}
      >
        <span className="auth-proceed-icon">{loading ? '⏳' : '🔓'}</span>
        {loading ? 'Authenticating...' : 'Sign In'}
      </button>
    </div>
  );
}
