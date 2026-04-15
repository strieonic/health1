import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const HospitalLogin = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/hospital/login', formData);
      login(res.data.hospital, res.data.token, 'hospital');
      navigate('/hospital/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="auth-container"
      style={{ maxWidth: '400px', margin: '4rem auto' }}
    >
      <div className="glass-panel">
        <h2 className="heading-gradient text-center" style={{ marginBottom: '2rem' }}>{t('hospital.loginTitle')}</h2>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('hospital.emailLabel')}</label>
            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
              <FaEnvelope style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }} />
              <input type="email" name="email" className="glass-input" style={{ paddingLeft: '45px' }} placeholder="hospital@domain.com" required onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('hospital.passwordLabel')}</label>
            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
              <FaLock style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }} />
              <input type="password" name="password" className="glass-input" style={{ paddingLeft: '45px' }} placeholder="••••••••" required onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="primary-btn" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? t('hospital.authenticating') : t('hospital.loginSecurely')}
          </button>
        </form>

        <p className="text-center" style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {t('hospital.noAccount')} <Link to="/hospital/register" style={{ color: 'var(--secondary-color)' }}>{t('hospital.registerYourHospital')}</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default HospitalLogin;
