import { useState, useEffect } from 'react';
import './PatientSelection.css';

export default function PatientSelection({ user, onBack, onSelectPatient, onAddNew }) {
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
        <button className="ps-back-btn" onClick={onBack}>← Back</button>
        <h1 className="ps-title">Select Patient</h1>
      </div>

      <div className="ps-user-info">
        Logged in as: <strong>{maskContactNo(user?.contact_no)}</strong>
      </div>

      {loading ? (
        <p>Loading profiles...</p>
      ) : (
        <div className="ps-list">
          {patients.length === 0 ? (
            <p className="ps-empty">No patient profiles found. Please add one.</p>
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
                  <p>{p.age} years • {p.gender}</p>
                </div>
                <div className="ps-card-arrow">→</div>
              </button>
            ))
          )}
        </div>
      )}

      <button className="ps-add-btn" onClick={onAddNew}>
        <span>+</span> Add New Patient Profile
      </button>
    </div>
  );
}
