import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './PatientHistory.css';

export default function PatientHistory({ patient, onBack }) {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/patients/${patient._id}/records`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecords(data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [patient._id]);

  return (
    <div className="ph-wrapper">
      <div className="ph-header">
        <button className="ph-back-btn" onClick={onBack}>{t('ph_back') || '← Back'}</button>
        <h1 className="ph-title">{t('ph_title') || 'Patient History'}</h1>
      </div>

      <div className="ph-user-info">
        <h3>{patient.name}</h3>
        <p>{patient.age} {t('ph_years') || 'years'} • {t(`gender_${patient.gender.toLowerCase()}`) === `gender_${patient.gender.toLowerCase()}` ? patient.gender : t(`gender_${patient.gender.toLowerCase()}`)}</p>
      </div>

      {loading ? (
        <p>{t('ph_loading') || 'Loading history...'}</p>
      ) : (
        <div className="ph-list">
          {records.length === 0 ? (
            <p className="ph-empty">{t('ph_empty') || 'No diagnosis records found for this patient.'}</p>
          ) : (
            records.map(r => (
              <div key={r._id} className="ph-card">
                <div className="ph-card-date">
                  {new Date(r.timestamp).toLocaleString()}
                </div>
                <div className="ph-card-symptoms">
                  <strong>{t('ph_symptoms') || 'Symptoms:'}</strong> {r.symptoms?.join(', ') || t('ph_na') || 'N/A'}
                </div>
                <div className="ph-card-result">
                  <strong>{t('ph_diagnosis') || 'Diagnosis:'}</strong> {r.diagnosis_result}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
