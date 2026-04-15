import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaNotesMedical, FaRegIdCard, FaClipboardCheck, FaHospitalUser, FaQrcode, FaHospital, FaUsers, FaHeartbeat } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import MagneticButton from '../../components/MagneticButton';
import { QRCodeSVG } from 'qrcode.react';

const PatientDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Artificial delay to show off the premium skeleton loaders
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      toast.success(t('patient.timelineSynced'), {
        description: t('patient.timelineSyncedDesc'),
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleActionClick = (path, actionName) => {
    toast(`Accessing ${actionName}...`, { 
      duration: 1500,
      icon: <FaHeartbeat className="animate-pulse" />
    });
    setTimeout(() => {
      toast.dismiss();
      navigate(path);
    }, 800);
  };

  const tileVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 className="heading-gradient" style={{ marginBottom: '2rem' }}>{t('patient.authenticating')}</h1>
        <div className="bento-wrapper">
          <div className="skeleton bento-tile span-2 row-span-2" style={{ minHeight: '300px' }} />
          <div className="skeleton bento-tile span-2" style={{ minHeight: '140px' }} />
          <div className="skeleton bento-tile" style={{ minHeight: '140px' }} />
          <div className="skeleton bento-tile" style={{ minHeight: '140px' }} />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden" animate="visible"
      transition={{ staggerChildren: 0.1 }}
      className="dashboard-container"
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}
    >
      <motion.div variants={tileVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-gradient" style={{ fontSize: '2.5rem' }}>{t('patient.dashboardTitle')}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{t('patient.welcomeMessage')}</p>
        </div>
      </motion.div>

      <div className="bento-wrapper">
        
        {/* HERO TILE (Span 2x2) */}
        <motion.div variants={tileVariants} className="bento-tile span-2 row-span-2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(135deg, #1d1d1f 0%, #0a2540 100%)', color: 'white', border: 'none' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div>
                 <p style={{ color: '#86868b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('patient.globalHealthId')}</p>
                 <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>{user?.name}</h2>
                 <p style={{ fontSize: '1.5rem', letterSpacing: '2px', color: 'var(--accent-pink)', fontFamily: 'monospace' }}>{user?.healthId}</p>
               </div>
               <div style={{ background: 'white', padding: '10px', borderRadius: '12px' }}>
                 <QRCodeSVG value={user?.healthId || 'GUEST'} size={80} level="M" />
               </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#86868b' }}>{t('patient.statusEncrypted')} <span style={{ color: '#34c759' }}>{t('patient.fullyEncrypted')}</span></span>
            <MagneticButton className="primary-btn" onClick={() => handleActionClick('/patient/healthcard', 'Digital Passport')}>
              {t('patient.viewPassport')}
            </MagneticButton>
          </div>
        </motion.div>

        {/* WIDE STATS TILE */}
        <motion.div variants={tileVariants} className="bento-tile span-2" style={{ background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' opacity=\'0.05\'%3E%3Cdefs%3E%3Cpattern id=\'p\' width=\'50\' height=\'50\' patternUnits=\'userSpaceOnUse\'%3E%3Ccircle cx=\'25\' cy=\'25\' r=\'2\' fill=\'%23000\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23p)\'/%3E%3C/svg%3E")', backgroundColor: 'var(--surface-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(52, 199, 89, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
              <FaClipboardCheck style={{ fontSize: '2rem', color: '#34c759' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('patient.dataFlow')}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{t('patient.noPendingConsents')}</p>
            </div>
          </div>
        </motion.div>

        {/* ACTION TILE: RECORDS */}
        <motion.div variants={tileVariants} className="bento-tile" onClick={() => handleActionClick('/patient/records', 'Medical Records')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <FaNotesMedical style={{ fontSize: '2.5rem', color: '#007aff', marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700 }}>{t('patient.myRecordsTitle')}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{t('patient.viewEncrypted')}</p>
        </motion.div>

        {/* ACTION TILE: CONSENTS */}
        <motion.div variants={tileVariants} className="bento-tile" onClick={() => handleActionClick('/patient/consents', 'Access Controls')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <FaHospitalUser style={{ fontSize: '2.5rem', color: 'var(--accent-pink)', marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700 }}>{t('patient.accessControl')}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{t('patient.manageDoctorKeys')}</p>
        </motion.div>

        {/* ACTION TILE: HOSPITALS */}
        <motion.div variants={tileVariants} className="bento-tile" onClick={() => handleActionClick('/patient/hospitals', 'My Hospitals')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <FaHospital style={{ fontSize: '2.5rem', color: 'var(--success)', marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700 }}>{t('patient.myHospitalsTitle')}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{t('patient.viewVisitedHospitals')}</p>
        </motion.div>

        {/* ACTION TILE: FAMILY MEMBERS */}
        <motion.div variants={tileVariants} className="bento-tile" onClick={() => handleActionClick('/patient/family', 'Family Members')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <FaUsers style={{ fontSize: '2.5rem', color: '#ff9500', marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700 }}>Family Members</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Link dependent profiles</p>
        </motion.div>

        {/* ACTION TILE: MEDICAL PROFILE */}
        <motion.div variants={tileVariants} className="bento-tile" onClick={() => handleActionClick('/patient/profile', 'Medical Profile')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <FaHeartbeat style={{ fontSize: '2.5rem', color: '#ff3b30', marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700 }}>Medical Profile</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Allergies & Contacts</p>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default PatientDashboard;
