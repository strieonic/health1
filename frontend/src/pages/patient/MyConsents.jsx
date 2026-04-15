import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const MyConsents = () => {
  const { t } = useTranslation();
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsents = async () => {
      try {
        const res = await api.get('/patient/consents');
        setConsents(res.data || []);
      } catch (err) {
        console.error("Failed to fetch consents", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsents();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <FaCheckCircle style={{ color: 'var(--success)' }} />;
      case 'rejected': return <FaTimesCircle style={{ color: 'var(--danger)' }} />;
      default: return <FaClock style={{ color: '#f1c40f' }} />;
    }
  };

  const handleGrantAccess = async (consent) => {
    const otp = prompt("Please enter the 6-digit Consent OTP provided by the hospital:");
    if (!otp) return;

    try {
      await api.post('/consent/verify', {
        consentId: consent._id,
        otp
      });
      alert("Access granted successfully!");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="heading-gradient" style={{ marginBottom: '2rem' }}>{t('patient.consentsTitle')}</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--secondary-color)' }}>{t('patient.loadingConsents')}</div>
      ) : consents.length === 0 ? (
        <div className="glass-panel text-center" style={{ color: 'var(--text-secondary)', padding: '3rem' }}>
          {t('patient.noConsents')}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {consents.map((consent, index) => (
            <motion.div 
              key={consent._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}
            >
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{consent.hospitalId?.hospitalName || t('patient.unknownHospital')}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('patient.requestedOn')} {new Date(consent.createdAt).toLocaleString()}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {consent.status === 'pending' ? (
                  <button 
                    onClick={() => handleGrantAccess(consent)}
                    className="primary-btn" 
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    {t('patient.grantAccess')}
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                    {getStatusIcon(consent.status)}
                    <span style={{ textTransform: 'capitalize', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{t(`common.${consent.status}`) || consent.status}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyConsents;
