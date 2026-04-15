import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MorphingShape from '../components/MorphingShape';
import TextReveal from '../components/TextReveal';
import AnimatedCounter from '../components/AnimatedCounter';
import GlowCard from '../components/GlowCard';
import api from '../api/axios';
import './Landing.css';

/* ─── Animation Helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }
  })
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }
  })
};

/* ─── Testimonial static authors (names/roles stay English) ─── */
const testimonialAuthors = [
  { name: 'Priya S.', role: 'Patient, Mumbai', color: '#FF3366', key: 'testimonial1' },
  { name: 'Rahul M.', role: 'Patient, Delhi', color: '#00D4AA', key: 'testimonial2' },
  { name: 'Dr. Anjali K.', role: 'Apollo Hospitals', color: '#FFB347', key: 'testimonial3' },
  { name: 'Dr. Vikram P.', role: 'Max Healthcare', color: '#8B5CF6', key: 'testimonial4' },
  { name: 'Sneha T.', role: 'Patient, Pune', color: '#FF3366', key: 'testimonial5' },
  { name: 'Arjun D.', role: 'Patient, Bangalore', color: '#00D4AA', key: 'testimonial6' },
];

/* ─── FAQ Item Component ─── */
const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <motion.div
      className="faq-item"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        className="faq-question"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <svg
          className={`faq-chevron ${isOpen ? 'open' : ''}`}
          width="20" height="20" viewBox="0 0 20 20" fill="none"
        >
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div
        className="faq-answer"
        style={{
          maxHeight: isOpen ? height + 'px' : '0px',
          transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div ref={contentRef} className="faq-answer-inner">
          {answer}
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════ */
const Landing = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    patients: 12000,
    hospitals: 50,
    statesCovered: 28,
    uptime: 99.9
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/public/stats');
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch public stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Build FAQ and testimonial data from translations
  const faqData = [
    { q: t('landing.faq1Q'), a: t('landing.faq1A') },
    { q: t('landing.faq2Q'), a: t('landing.faq2A') },
    { q: t('landing.faq3Q'), a: t('landing.faq3A') },
    { q: t('landing.faq4Q'), a: t('landing.faq4A') },
    { q: t('landing.faq5Q'), a: t('landing.faq5A') },
  ];

  const testimonials = testimonialAuthors.map(a => ({
    ...a,
    text: t(`landing.${a.key}`),
  }));
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.8], [1, 0.96]);

  const brandRef = useRef(null);
  const brandInView = useInView(brandRef, { once: true, margin: '-150px' });

  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        className="hero-section"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <MorphingShape />

        <div className="hero-inner">
          {/* Left — Content */}
          <motion.div
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0}>
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                {t('landing.badge')}
              </div>
            </motion.div>

            <motion.h1 className="hero-headline" variants={fadeUp} custom={0.1}>
              {t('landing.headline').split('<accent>').map((part, i) => {
                if (i === 0) return <React.Fragment key={i}>{part}</React.Fragment>;
                const [accent, rest] = part.split('</accent>');
                return <React.Fragment key={i}><span className="accent">{accent}</span>{rest}</React.Fragment>;
              })}
            </motion.h1>

            <motion.p className="hero-description" variants={fadeUp} custom={0.2}>
              {t('landing.description')}
            </motion.p>

            <motion.div className="hero-actions" variants={fadeUp} custom={0.3}>
              <Link to="/patient/register" className="primary-btn" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
                {t('landing.ctaPrimary')}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/hospital/login" className="secondary-btn" style={{ padding: '16px 32px' }}>
                {t('landing.ctaHospital')}
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — Floating Card Composition */}
          <div className="hero-visual">
            <div className="hero-floating-cards">
              {/* Card 1 — Health Card Preview */}
              <motion.div
                className="floating-card floating-card-1"
                initial={{ opacity: 0, y: 40, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="card-header">
                  <div className="card-icon" style={{ background: 'var(--accent-primary-soft)' }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 1.5v15M1.5 9h15" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="card-title">{t('landing.card1Title')}</div>
                    <div className="card-subtitle">{t('landing.card1Subtitle')}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ height: '8px', width: '80%', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} />
                  <div style={{ height: '8px', width: '60%', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} />
                </div>
                <div className="card-bar">
                  <motion.div
                    className="card-bar-fill"
                    style={{ background: 'var(--accent-primary)' }}
                    initial={{ width: '0%' }}
                    animate={{ width: '85%' }}
                    transition={{ delay: 1.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>

              {/* Card 2 — Consent Notification */}
              <motion.div
                className="floating-card floating-card-2"
                initial={{ opacity: 0, y: 30, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="card-header">
                  <div className="card-icon" style={{ background: 'var(--accent-secondary-soft)' }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 1.5L2 6v6c0 3.5 3 5.5 7 6.5 4-1 7-3 7-6.5V6L9 1.5z" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6.5 9.5l2 2 3.5-4" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="card-title">{t('landing.card2Title')}</div>
                    <div className="card-subtitle">{t('landing.card2Subtitle')}</div>
                  </div>
                </div>
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(0,212,170,0.08)',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  color: 'var(--accent-secondary)',
                  fontWeight: 600,
                  marginTop: '8px'
                }}>
                  {t('landing.card2Status')}
                </div>
              </motion.div>

              {/* Card 3 — Record Tile */}
              <motion.div
                className="floating-card floating-card-3"
                initial={{ opacity: 0, y: 20, x: -10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="card-header">
                  <div className="card-icon" style={{ background: 'rgba(255,179,71,0.1)' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="1" width="12" height="14" rx="2" stroke="#FFB347" strokeWidth="1.5"/>
                      <path d="M5 5h6M5 8h4" stroke="#FFB347" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="card-title">{t('landing.card3Title')}</div>
                    <div className="card-subtitle">{t('landing.card3Subtitle')}</div>
                  </div>
                </div>
                <div className="card-bar">
                  <motion.div
                    className="card-bar-fill"
                    style={{ background: 'var(--accent-tertiary)' }}
                    initial={{ width: '0%' }}
                    animate={{ width: '65%' }}
                    transition={{ delay: 1.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            zIndex: 5,
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {t('common.scroll')}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '1px', height: '24px', background: 'linear-gradient(to bottom, var(--text-tertiary), transparent)' }}
          />
        </motion.div>
      </motion.section>

      {/* ════════════════════════════════════
          BRAND STATEMENT
      ════════════════════════════════════ */}
      <section className="brand-statement-section" ref={brandRef}>
        <motion.div
          className="brand-statement-text"
          initial={{ opacity: 0 }}
          animate={brandInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <TextReveal delay={0.1}>
            {t('landing.brandStatement')}
          </TextReveal>
        </motion.div>
      </section>

      {/* ════════════════════════════════════
          FEATURES — Asymmetric Bento Grid
      ════════════════════════════════════ */}
      <section className="features-section">
        <motion.div
          className="features-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label">{t('landing.featuresLabel')}</div>
          <h2 className="section-title">
            {t('landing.featuresTitle')}
          </h2>
        </motion.div>

        <div className="features-grid">
          {/* Feature 1 — Large */}
          <GlowCard className="feature-card large" glowColor="rgba(255,51,102,0.1)">
            <div className="feature-icon" style={{ background: 'var(--accent-primary-soft)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="2" width="18" height="20" rx="3" stroke="var(--accent-primary)" strokeWidth="1.5"/>
                <path d="M8 7h8M8 11h5M8 15h7" stroke="var(--accent-primary)" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="feature-title">{t('landing.feature1Title')}</h3>
            <p className="feature-description">
              {t('landing.feature1Desc')}
            </p>
          </GlowCard>

          {/* Feature 2 */}
          <GlowCard className="feature-card" glowColor="rgba(0,212,170,0.1)">
            <div className="feature-icon" style={{ background: 'var(--accent-secondary-soft)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 7v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V7l-8-5z" stroke="var(--accent-secondary)" strokeWidth="1.5"/>
                <path d="M9 12l2 2 4-4" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-title">{t('landing.feature2Title')}</h3>
            <p className="feature-description">
              {t('landing.feature2Desc')}
            </p>
          </GlowCard>

          {/* Feature 3 */}
          <GlowCard className="feature-card" glowColor="rgba(255,179,71,0.1)">
            <div className="feature-icon" style={{ background: 'rgba(255,179,71,0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#FFB347" strokeWidth="1.5"/>
                <path d="M9 12l2 2 4-4" stroke="#FFB347" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-title">{t('landing.feature3Title')}</h3>
            <p className="feature-description">
              {t('landing.feature3Desc')}
            </p>
          </GlowCard>

          {/* Feature 4 */}
          <GlowCard className="feature-card" glowColor="rgba(139,92,246,0.1)">
            <div className="feature-icon" style={{ background: 'rgba(139,92,246,0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="3" stroke="#8B5CF6" strokeWidth="1.5"/>
                <path d="M12 9v4M10 11h4" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="feature-title">{t('landing.feature4Title')}</h3>
            <p className="feature-description">
              {t('landing.feature4Desc')}
            </p>
          </GlowCard>

          {/* Feature 5 — Large */}
          <GlowCard className="feature-card large" glowColor="rgba(0,212,170,0.08)">
            <div className="feature-icon" style={{ background: 'var(--accent-secondary-soft)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16v16H4z" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M4 9h16M9 9v11" stroke="var(--accent-secondary)" strokeWidth="1.3"/>
              </svg>
            </div>
            <h3 className="feature-title">{t('landing.feature5Title')}</h3>
            <p className="feature-description">
              {t('landing.feature5Desc')}
            </p>
          </GlowCard>
        </div>
      </section>

      {/* ════════════════════════════════════
          STATS / TRUST SECTION
      ════════════════════════════════════ */}
      <section className="stats-section">
        <div className="stats-inner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-label" style={{ textAlign: 'center' }}>{t('landing.statsLabel')}</div>
            <h2 className="section-title" style={{ textAlign: 'center', margin: '0 auto' }}>
              {t('landing.statsTitle')}
            </h2>
          </motion.div>

          <div className="stats-grid">
            <motion.div className="stat-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <div className="stat-number">
                <AnimatedCounter end={stats.patients} suffix="+" useIndianFormat />
              </div>
              <div className="stat-label">{t('landing.statHealthIds')}</div>
            </motion.div>

            <motion.div className="stat-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <div className="stat-number">
                <AnimatedCounter end={stats.hospitals} suffix="+" />
              </div>
              <div className="stat-label">{t('landing.statHospitals')}</div>
            </motion.div>

            <motion.div className="stat-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <div className="stat-number">
                <AnimatedCounter end={stats.statesCovered} suffix="" />
              </div>
              <div className="stat-label">{t('landing.statStates')}</div>
            </motion.div>

            <motion.div className="stat-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <div className="stat-number">
                <AnimatedCounter end={stats.uptime} suffix="%" decimals={1} />
              </div>
              <div className="stat-label">{t('landing.statUptime')}</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          HOW IT WORKS — Process Timeline
      ════════════════════════════════════ */}
      <section className="process-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label">{t('landing.processLabel')}</div>
          <h2 className="section-title">
            {t('landing.processTitle')}
          </h2>
        </motion.div>

        <div className="process-steps">
          {[
            { num: '01', title: t('landing.step1Title'), desc: t('landing.step1Desc') },
            { num: '02', title: t('landing.step2Title'), desc: t('landing.step2Desc') },
            { num: '03', title: t('landing.step3Title'), desc: t('landing.step3Desc') },
            { num: '04', title: t('landing.step4Title'), desc: t('landing.step4Desc') },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="process-step"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="process-step-number">{step.num}</div>
              <h4 className="process-step-title">{step.title}</h4>
              <p className="process-step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          TESTIMONIALS — Auto-scroll Marquee
      ════════════════════════════════════ */}
      <section className="testimonials-section">
        <motion.div
          className="testimonials-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label">{t('landing.testimonialsLabel')}</div>
          <h2 className="section-title">
            {t('landing.testimonialsTitle')}
          </h2>
        </motion.div>

        <div className="testimonials-track" aria-label="Testimonials">
          {/* Duplicate for infinite scroll */}
          {[...testimonials, ...testimonials].map((tm, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-text">"{tm.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: `${tm.color}20`, color: tm.color }}>
                  {tm.name.charAt(0)}
                </div>
                <div>
                  <div className="testimonial-name">{tm.name}</div>
                  <div className="testimonial-role">{tm.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          FAQ SECTION
      ════════════════════════════════════ */}
      <section className="faq-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center' }}
        >
          <div className="section-label">{t('landing.faqLabel')}</div>
          <h2 className="section-title" style={{ margin: '0 auto' }}>
            {t('landing.faqTitle')}
          </h2>
        </motion.div>

        <div className="faq-list">
          {faqData.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════ */}
      <section className="cta-section">
        <div className="cta-bg" />
        <motion.div
          className="cta-inner"
          initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="cta-headline">
            {t('landing.ctaHeadline')}<br />
            <span className="accent-gradient">{t('landing.ctaAccent')}</span>
          </h2>
          <p className="cta-description">
            {t('landing.ctaDescription')}
          </p>
          <div className="cta-actions">
            <Link to="/patient/register" className="primary-btn" style={{ padding: '18px 40px', fontSize: '1.05rem' }}>
              {t('landing.ctaPrimary')}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/hospital/register" className="secondary-btn" style={{ padding: '18px 36px' }}>
              {t('landing.ctaRegisterHospital')}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════
          PREMIUM FOOTER
      ════════════════════════════════════ */}
      <footer className="premium-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <path d="M2 14h5l3-8 4 16 3-10 2 4h7" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Health<span style={{ color: 'var(--accent-primary)' }}>ID</span>
            </div>
            <p className="footer-brand-desc">
              {t('landing.footerDesc')}
            </p>
          </div>

          <div>
            <h4 className="footer-column-title">{t('landing.footerPatients')}</h4>
            <ul className="footer-links">
              <li><Link to="/patient/register">{t('landing.footerCreateHealthId')}</Link></li>
              <li><Link to="/patient/login">{t('landing.footerPatientLogin')}</Link></li>
              <li><Link to="/patient/records">{t('landing.footerMyRecords')}</Link></li>
              <li><Link to="/patient/healthcard">{t('landing.footerHealthCard')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-column-title">{t('landing.footerHospitals')}</h4>
            <ul className="footer-links">
              <li><Link to="/hospital/register">{t('landing.footerRegisterHospital')}</Link></li>
              <li><Link to="/hospital/login">{t('landing.footerHospitalLogin')}</Link></li>
              <li><Link to="/hospital/search">{t('landing.footerSearchPatients')}</Link></li>
              <li><Link to="/hospital/upload">{t('landing.footerUploadRecords')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-column-title">{t('landing.footerPlatform')}</h4>
            <ul className="footer-links">
              <li><Link to="/admin/login">{t('landing.footerAdminPortal')}</Link></li>
              <li><a href="#privacy">{t('landing.footerPrivacy')}</a></li>
              <li><a href="#terms">{t('landing.footerTerms')}</a></li>
              <li><a href="#security">{t('landing.footerSecurity')}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copyright">
            {t('landing.footerCopyright', { year: new Date().getFullYear() })}
          </span>
          <div className="footer-india-badge">
            {t('common.madeInIndia')}
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
