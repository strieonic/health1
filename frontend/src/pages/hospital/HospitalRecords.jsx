import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import { FaFileMedical, FaUser, FaIdCard, FaCalendarAlt, FaDownload } from 'react-icons/fa';

const HospitalRecords = () => {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get('/hospital/records');
        setRecords(res.data || []);
      } catch (err) {
        console.error("Failed to fetch hospital records", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 className="heading-gradient" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <FaFileMedical /> {t('hospital.uploadedRecordsTitle')}
      </h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--secondary-color)' }}>{t('common.loading')}</div>
      ) : records.length === 0 ? (
        <div className="glass-panel text-center" style={{ color: 'var(--text-secondary)', padding: '3rem' }}>
          {t('hospital.noRecordsUploaded')}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {records.map((record, index) => (
            <motion.div 
              key={record._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel"
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {t(`hospital.${record.recordType}`) || record.recordType}
                  </h3>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <FaUser /> {record.patient?.name || t('patient.unknown')}
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <FaIdCard /> {record.patient?.healthId || t('patient.unknown')}
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <FaCalendarAlt /> {new Date(record.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {record.fileUrl && (
                  <a 
                    href={record.fileUrl?.startsWith('http') ? record.fileUrl : `${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')}${record.fileUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ghost-btn"
                    style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem' }}
                  >
                    <FaDownload /> {t('patient.viewDocument')}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default HospitalRecords;
