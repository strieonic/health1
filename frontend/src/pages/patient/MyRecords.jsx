import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import { FaFilePdf, FaImage, FaStethoscope } from 'react-icons/fa';

const MyRecords = () => {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get('/patient/records');
        setRecords(res.data.records || []);
      } catch (err) {
        console.error("Failed to fetch records", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const getIcon = (type) => {
    if (type?.toLowerCase().includes('report')) return <FaFilePdf />;
    if (type?.toLowerCase().includes('prescription')) return <FaStethoscope />;
    return <FaImage />;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="heading-gradient" style={{ marginBottom: '2rem' }}>{t('patient.recordsTitle')}</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--secondary-color)' }}>{t('patient.loadingRecords')}</div>
      ) : records.length === 0 ? (
        <div className="glass-panel text-center" style={{ color: 'var(--text-secondary)', padding: '3rem' }}>
          {t('patient.noRecords')}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {records.map((record, index) => (
            <motion.div 
              key={record._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel"
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2rem', color: 'var(--secondary-color)' }}>
                  {getIcon(record.recordType)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>{record.recordType || t('patient.medicalRecord')}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {t('patient.uploaded')} {new Date(record.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <strong>{t('patient.hospital')}</strong> {record.hospital?.hospitalName || t('patient.unknown')}
                </p>
              </div>
              <a href={record.fileUrl?.startsWith('http') ? record.fileUrl : `${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')}${record.fileUrl}`} target="_blank" rel="noreferrer" className="secondary-btn" style={{ textAlign: 'center', marginTop: 'auto' }}>
                {t('patient.viewDocument')}
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyRecords;
