import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Auth.css';

export default function Auth({ onBack, onLogin }) {
  const { t } = useLanguage();
  const [contactNo, setContactNo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    if (!contactNo || contactNo.length < 10) {
      setError(t('auth_err_invalid'));
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
        setError(data.error || t('auth_err_failed'));
      }
    } catch (err) {
      setError(t('auth_err_network'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <button className="auth-back-btn" onClick={onBack}>{t('auth_back')}</button>
        <h1 className="auth-title">{t('auth_title')}</h1>
      </div>
      
      <p className="auth-subtitle">
        {t('auth_subtitle')}
      </p>

      <div className="auth-form">
        <div className="auth-field">
          <label className="auth-label" htmlFor="contact-no">
            <span className="auth-label-icon">📱</span> {t('auth_mobile_label')}
          </label>
          <div className="phone-input-group">
            <span className="phone-prefix">+91</span>
            <input
              id="contact-no"
              className={`auth-input ${error ? 'auth-input--error' : ''}`}
              type="text"
              placeholder={t('auth_placeholder')}
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
        {loading ? t('auth_btn_loading') : t('auth_btn_signin')}
      </button>
    </div>
  );
}
