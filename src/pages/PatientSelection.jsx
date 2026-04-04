import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './PatientSelection.css';

export default function PatientSelection({ user, onBack, onSelectPatient, onAddNew }) {
  const { t } = useLanguage();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/users/${user.contact_no}/patients`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPatients(data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const maskContactNo = (no) => {
    if (!no) return '';
    return `******${no.slice(-4)}`;
  };

  return (
    <div className="ps-wrapper">
      <div className="ps-header">
        <button className="ps-back-btn" onClick={onBack}>{t('ps_back')}</button>
        <h1 className="ps-title">{t('ps_title')}</h1>
      </div>

      <div className="ps-user-info">
        {t('ps_logged_in')} <strong>{maskContactNo(user?.contact_no)}</strong>
      </div>

      {loading ? (
        <p>{t('ps_loading')}</p>
      ) : (
        <div className="ps-list">
          {patients.length === 0 ? (
            <p className="ps-empty">{t('ps_empty')}</p>
          ) : (
            patients.map(p => (
              <button 
                key={p._id} 
                className="ps-card"
                onClick={() => onSelectPatient(p)}
              >
                <div className="ps-card-icon">👤</div>
                <div className="ps-card-info">
                  <h3>{p.name}</h3>
                  <p>{p.age} {t('ps_years')} • {p.gender}</p>
                </div>
                <div className="ps-card-arrow">→</div>
              </button>
            ))
          )}
        </div>
      )}

      <button className="ps-add-btn" onClick={onAddNew}>
        <span>+</span> {t('ps_add_btn')}
      </button>
    </div>
  );
}
