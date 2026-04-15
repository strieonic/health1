import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import { QRCodeSVG } from 'qrcode.react';

const HealthCard = () => {
  const { t } = useTranslation();
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthCard = async () => {
      try {
        const res = await api.get('/patient/healthcard');
        setCardData(res.data);
      } catch (err) {
        console.error("Failed to fetch health card", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHealthCard();
  }, []);

  if (loading) return <div style={{textAlign: 'center', color: 'var(--secondary-color)'}}>{t('common.loading')}</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      
      <motion.div 
        className="glass-panel"
        whileHover={{ rotateY: 5, rotateX: 5, scale: 1.02 }}
        style={{ 
          width: '100%', 
          maxWidth: '500px', 
          background: 'linear-gradient(135deg, rgba(15, 76, 129, 0.4) 0%, rgba(0, 242, 254, 0.1) 100%)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--secondary-color)', opacity: '0.1', filter: 'blur(40px)', borderRadius: '50%' }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ letterSpacing: '2px', fontSize: '1.5rem', color: '#fff' }}>Health<span style={{ color: 'var(--secondary-color)' }}>ID</span></h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{t('patient.republicOfIndia')}</p>
          </div>
          <div style={{ padding: '0.5rem', background: '#fff', borderRadius: '8px' }}>
            {cardData && <QRCodeSVG value={cardData.healthId} size={70} />}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Cardholder Identity */}
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('patient.cardholderName')}</p>
            <h3 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: '700' }}>{cardData?.name || 'N/A'}</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('patient.healthIdNumber')}</p>
              <h3 style={{ fontSize: '1.1rem', letterSpacing: '1px', color: 'var(--secondary-color)', fontFamily: 'monospace' }}>
                {cardData?.healthId ? cardData.healthId : 'N/A'}
              </h3>
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Aadhaar Number</p>
              <h3 style={{ fontSize: '1.1rem', letterSpacing: '1px', color: '#fff', fontFamily: 'monospace' }}>
                {cardData?.aadhaar ? cardData.aadhaar : '—'}
              </h3>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Blood Group</p>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-pink)', fontWeight: '700' }}>{cardData?.bloodGroup || '—'}</h3>
            </div>
             <div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Allergies</p>
              <p style={{ fontSize: '0.9rem', color: '#fff' }}>{cardData?.allergies || 'None'}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Existing Contact</p>
              <h3 style={{ fontSize: '1rem', color: '#fff' }}>{cardData?.phone || '—'}</h3>
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Emergency Contact</p>
              <h3 style={{ fontSize: '1rem', color: 'var(--warning)', fontWeight: '600' }}>{cardData?.emergencyContact || '—'}</h3>
            </div>
          </div>

          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Permanent Address</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{cardData?.address || 'Address not provided'}</p>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default HealthCard;
