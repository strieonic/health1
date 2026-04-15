import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import { FaSearch } from 'react-icons/fa';

const SearchPatient = () => {
  const { t } = useTranslation();
  const [healthId, setHealthId] = useState('');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPatient(null);
    try {
      const res = await api.post('/hospital/search-patient', { healthId });
      setPatient(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Patient not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="glass-panel text-center">
        <h2 className="heading-gradient" style={{ marginBottom: '2rem' }}>{t('hospital.searchTitle')}</h2>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FaSearch style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="glass-input" 
              style={{ paddingLeft: '45px' }} 
              placeholder={t('hospital.enterHealthId')}
              value={healthId}
              onChange={(e) => setHealthId(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? t('hospital.searching') : t('hospital.searchBtn')}
          </button>
        </form>

        {error && <div style={{ color: 'var(--danger)', marginTop: '1rem' }}>{error}</div>}

        {patient && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ background: 'rgba(0, 242, 254, 0.05)', textAlign: 'left', border: '1px solid var(--secondary-color)' }}>
            <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>{t('hospital.patientFound')}</h3>
            <p><strong>{t('hospital.patientName')}</strong> {patient.name}</p>
            <p><strong>{t('hospital.patientPhone')}</strong> {patient.phone?.substring(0, 3)}XXXXXXX</p>
            <p><strong>{t('hospital.patientHealthId')}</strong> {patient.healthId}</p>
            <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('hospital.patientAdded')}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchPatient;
