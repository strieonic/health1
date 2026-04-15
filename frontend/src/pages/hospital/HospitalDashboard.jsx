import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaUsers, FaCloudUploadAlt, FaFileContract, FaFileMedical } from 'react-icons/fa';

const HospitalDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading-gradient">{t('hospital.dashboardTitle')}</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{user?.hospitalName}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <Link to="/hospital/search">
          <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ height: '100%', cursor: 'pointer', textAlign: 'center' }}>
            <FaSearch style={{ fontSize: '2.5rem', color: 'var(--secondary-color)', marginBottom: '1rem' }} />
            <h3>{t('hospital.searchPatient')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{t('hospital.findByHealthId')}</p>
          </motion.div>
        </Link>
        
        <Link to="/hospital/consent">
          <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ height: '100%', cursor: 'pointer', textAlign: 'center' }}>
            <FaFileContract style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }} />
            <h3>{t('hospital.requestConsent')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{t('hospital.accessViaOtp')}</p>
          </motion.div>
        </Link>
        
        <Link to="/hospital/upload">
          <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ height: '100%', cursor: 'pointer', textAlign: 'center' }}>
            <FaCloudUploadAlt style={{ fontSize: '2.5rem', color: 'var(--danger)', marginBottom: '1rem' }} />
            <h3>{t('hospital.uploadRecord')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{t('hospital.addToProfile')}</p>
          </motion.div>
        </Link>
        
        <Link to="/hospital/patients">
          <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ height: '100%', cursor: 'pointer', textAlign: 'center' }}>
            <FaUsers style={{ fontSize: '2.5rem', color: 'var(--success)', marginBottom: '1rem' }} />
            <h3>{t('nav.directory')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{t('hospital.previousPatients')}</p>
          </motion.div>
        </Link>
        
        <Link to="/hospital/records">
          <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ height: '100%', cursor: 'pointer', textAlign: 'center' }}>
            <FaFileMedical style={{ fontSize: '2.5rem', color: 'var(--warning)', marginBottom: '1rem' }} />
            <h3>{t('hospital.uploadedRecordsTitle')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{t('hospital.viewAllHistory') || 'View all records uploaded by you'}</p>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default HospitalDashboard;
