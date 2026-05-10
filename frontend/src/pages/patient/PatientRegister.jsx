import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaPhoneAlt, FaIdCard, FaEnvelope } from 'react-icons/fa';

const PatientRegister = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', aadhaar: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/patient/register', formData);
      setSuccess(true);
      setTimeout(() => navigate('/patient/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="auth-container"
      style={{ maxWidth: '450px', margin: '4rem auto' }}
    >
      <div className="glass-panel">
        <h2 className="heading-gradient text-center" style={{ marginBottom: '2rem' }}>{t('patient.registerTitle')}</h2>
        
        {error && <div className="alert alert-danger" style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ color: 'var(--success)', marginBottom: '1rem' }}>{t('patient.registerSuccess')}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('patient.fullName')}</label>
            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
              <FaUser style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }} />
              <input type="text" name="name" className="glass-input" style={{ paddingLeft: '45px' }} placeholder={t('patient.fullNamePlaceholder')} required onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('patient.phoneNumber')}</label>
            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
              <FaPhoneAlt style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }} />
              <input type="tel" name="phone" className="glass-input" style={{ paddingLeft: '45px' }} placeholder={t('patient.phonePlaceholder')} required onChange={handleChange} />
            </div>
          </div>
          <div className="input-group">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email Address</label>
            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
              <FaEnvelope style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }} />
              <input type="email" name="email" className="glass-input" style={{ paddingLeft: '45px' }} placeholder="Enter email address" required onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('patient.aadhaarOptional')}</label>
            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
              <FaIdCard style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }} />
              <input type="text" name="aadhaar" className="glass-input" style={{ paddingLeft: '45px' }} placeholder={t('patient.aadhaarPlaceholder')} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="primary-btn" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? t('patient.creating') : t('patient.registerBtn')}
          </button>
        </form>

        <p className="text-center" style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {t('patient.alreadyAccount')} <Link to="/patient/login" style={{ color: 'var(--secondary-color)' }}>{t('patient.loginHere')}</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default PatientRegister;
