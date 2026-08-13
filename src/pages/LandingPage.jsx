import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  Warehouse, ShieldAlert, BarChart3, Users, 
  Menu, X, ChevronDown, CheckCircle, ArrowRight, 
  Lock, LayoutDashboard, Star, Phone, Mail, MapPin, 
  Bell, Calendar, Thermometer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCounter } from '../components/animations/AnimatedCounter';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import { HeroReveal } from '../components/animations/HeroReveal';
import '../styles/LandingPage.css';

export const LandingPage = () => {
  const { theme, setTheme } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Navigation states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Preview tab state
  const [activePreviewTab, setActivePreviewTab] = useState('admin');

  // FAQ Accordion state
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(0);

  // Form states
  const [formData, setFormData] = useState({ name: '', email: '', role: 'farmer', message: '' });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Detect scrolling to add shadow to navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Determine active section for scroll highlights
      const sections = ['home', 'about', 'features', 'stats', 'preview', 'timeline', 'faq', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsFormSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', role: 'farmer', message: '' });
        setIsFormSubmitted(false);
      }, 5000);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const faqs = [
    {
      q: "How do the AgriFreeze IoT sensors communicate?",
      a: "Our sensors use industry-standard low-power WAN protocols (LoRaWAN / NB-IoT) that transmit temperature, humidity, and door closure logs reliably through thick-walled coldrooms without requiring complicated local Wi-Fi pairing."
    },
    {
      q: "Can farmers book cold storage from multiple locations?",
      a: "Yes, our interactive farmer dashboard displays all regional coldrooms with real-time occupancy. Farmers can instantly select a facility, check capacity, and book a specific volume online in under two minutes."
    },
    {
      q: "What happens when temperature thresholds are crossed?",
      a: "The system automatically triggers critical warnings. System administrators, coldroom managers, and depositing farmers are instantly alerted via email, in-app notifications, and optional SMS so corrective action can be taken immediately."
    },
    {
      q: "Does AgriFreeze support dark mode?",
      a: "Absolutely! The entire dashboard suite is built with a dual-theme system that matches premium executive layouts, prioritizing low light comfort for warehouse operators."
    }
  ];

  return (
    <div className="lp-body">
      {/* Gentle Floating Motion for Background Glow Decors */}
      <motion.div 
        animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="lp-bg-glow lp-bg-glow-1"
      />
      <motion.div 
        animate={{ y: [0, 15, 0], x: [0, -12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="lp-bg-glow lp-bg-glow-2"
      />
      <motion.div 
        animate={{ y: [0, -10, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="lp-bg-glow lp-bg-glow-3"
      />

      {/* Sticky Responsive Header */}
      <nav className={`lp-navbar ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'open' : ''}`}>
        <a href="#home" className="lp-logo" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
          <span className="lp-logo-icon"><Warehouse size={28} strokeWidth={2.5} /></span>
          <span>AgriFreeze</span>
        </a>

        <button className="lp-hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <ul className={`lp-nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <li><span className={`lp-nav-link ${activeSection === 'home' ? 'active' : ''}`} onClick={() => scrollToSection('home')}>Home</span></li>
          <li><span className={`lp-nav-link ${activeSection === 'about' ? 'active' : ''}`} onClick={() => scrollToSection('about')}>About</span></li>
          <li><span className={`lp-nav-link ${activeSection === 'features' ? 'active' : ''}`} onClick={() => scrollToSection('features')}>Features</span></li>
          <li><span className={`lp-nav-link ${activeSection === 'preview' ? 'active' : ''}`} onClick={() => scrollToSection('preview')}>Portals</span></li>
          <li><span className={`lp-nav-link ${activeSection === 'timeline' ? 'active' : ''}`} onClick={() => scrollToSection('timeline')}>Workflow</span></li>
          <li><span className={`lp-nav-link ${activeSection === 'faq' ? 'active' : ''}`} onClick={() => scrollToSection('faq')}>FAQ</span></li>
          <li><span className={`lp-nav-link ${activeSection === 'contact' ? 'active' : ''}`} onClick={() => scrollToSection('contact')}>Contact</span></li>
        </ul>

        <div className="lp-nav-actions">
          <button className="lp-btn-theme" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>
          <button className="lp-btn lp-btn-outline" onClick={() => navigate('/login')}>Sign In</button>
          <button className="lp-btn lp-btn-primary" onClick={() => navigate('/login')}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="lp-section lp-hero">
        <div className="lp-container lp-hero-grid">
          <div className="lp-hero-content">
            <HeroReveal>
              <div className="lp-hero-badge">
                <span className="lp-hero-badge-pulse"></span>
                <span>AgriFreeze Cold Chain 2.0</span>
              </div>
              <h1 className="lp-hero-title">
                Intelligent Cold Chain <span>Storage & Spoilage Prevention</span>
              </h1>
              <p className="lp-hero-desc">
                Reduce crop spoilage by 85% with real-time IoT temperature telemetry, machine-learning warnings, and a unified platform connecting farmers, coldroom managers, and admins.
              </p>
              <div className="lp-hero-ctas">
                <motion.button 
                  whileHover={{ scale: 1.03, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="lp-btn lp-btn-primary" 
                  onClick={() => navigate('/login')}
                >
                  <span>Get Started Now</span>
                  <ArrowRight size={16} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.03, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="lp-btn lp-btn-outline" 
                  onClick={() => scrollToSection('preview')}
                >
                  Explore Dashboard
                </motion.button>
              </div>
            </HeroReveal>
          </div>
          
          <div className="lp-hero-visual">
            <ScrollReveal delay={0.25} scale={0.95}>
              <div className="lp-hero-glow-back"></div>
              <div className="lp-hero-mockup-wrapper">
                <div className="lp-hero-mock">
                  <div className="lp-hm-header">
                    <div className="lp-hm-dots">
                      <span className="lp-hm-dot"></span>
                      <span className="lp-hm-dot"></span>
                      <span className="lp-hm-dot"></span>
                    </div>
                    <div className="lp-hm-search"></div>
                    <div style={{ width: '12px' }}></div>
                  </div>
                  <div className="lp-hm-body">
                    <div className="lp-hm-stats">
                      <div className="lp-hm-stat-card">
                        <span className="lp-hm-stat-val">84.2%</span>
                        <span className="lp-hm-stat-lbl">Capacity Occupied</span>
                      </div>
                      <div className="lp-hm-stat-card">
                        <span className="lp-hm-stat-val" style={{ color: 'var(--status-danger)' }}>2</span>
                        <span className="lp-hm-stat-lbl">Active Alerts</span>
                      </div>
                      <div className="lp-hm-stat-card">
                        <span className="lp-hm-stat-val" style={{ color: 'var(--lp-primary)' }}>99.9%</span>
                        <span className="lp-hm-stat-lbl">Sensor Uptime</span>
                      </div>
                    </div>
                    <div className="lp-hm-chart-container">
                      <span className="lp-hm-chart-title">Temp History (Coldroom Alpha)</span>
                      <div className="lp-hm-bars">
                        <span className="lp-hm-bar" style={{ height: '35%' }}></span>
                        <span className="lp-hm-bar" style={{ height: '42%' }}></span>
                        <span className="lp-hm-bar" style={{ height: '39%' }}></span>
                        <span className="lp-hm-bar" style={{ height: '58%' }}></span>
                        <span className="lp-hm-bar active" style={{ height: '82%' }}></span>
                        <span className="lp-hm-bar" style={{ height: '65%' }}></span>
                        <span className="lp-hm-bar" style={{ height: '48%' }}></span>
                      </div>
                    </div>
                    <div className="lp-hm-alerts">
                      <div className="lp-hm-alert-row">
                        <span className="lp-hm-alert-lbl">Temp Anomaly in Beta</span>
                        <span className="lp-hm-alert-time">Just now</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* About AgriFreeze Section */}
      <section id="about" className="lp-section">
        <div className="lp-container lp-about-grid">
          <div className="lp-about-visual">
            <ScrollReveal delay={0.0}>
              <motion.div whileHover={{ translateY: -5 }} className="lp-about-box">
                <span className="lp-about-icon"><Users size={22} /></span>
                <h3>For Farmers</h3>
                <p>Book cold storage online, monitor temperature, and secure optimal market prices for crop yields.</p>
              </motion.div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <motion.div whileHover={{ translateY: 15 }} className="lp-about-box">
                <span className="lp-about-icon"><Warehouse size={22} /></span>
                <h3>For Managers</h3>
                <p>Track real-time capacity, manage active user accounts, and resolve warning incidents instantly.</p>
              </motion.div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <motion.div whileHover={{ translateY: -5 }} className="lp-about-box">
                <span className="lp-about-icon"><BarChart3 size={22} /></span>
                <h3>For Enterprise Admins</h3>
                <p>Gain executive platform-wide insights, control settings, and manage storage logistics.</p>
              </motion.div>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <motion.div whileHover={{ translateY: -5 }} className="lp-about-box">
                <span className="lp-about-icon"><ShieldAlert size={22} /></span>
                <h3>IoT Driven Safety</h3>
                <p>Continuous monitoring predicts and alerts before spoilage damages the agricultural load.</p>
              </motion.div>
            </ScrollReveal>
          </div>
          
          <div className="lp-about-content">
            <ScrollReveal delay={0.2} x={25} y={0}>
              <span className="lp-tagline">About AgriFreeze</span>
              <h2>Bridging the Gap Between Harvest and Sale</h2>
              <p>
                AgriFreeze provides state-of-the-art cold-chain logistics platform that connects local farmers directly with storage providers. Driven by real-time IoT hardware integrations, we make agricultural loss a thing of the past.
              </p>
              <div className="lp-about-bullets">
                <div className="lp-about-bullet">
                  <span className="lp-about-bullet-icon"><CheckCircle size={18} /></span>
                  <span>Optimized temperature & humidity logs</span>
                </div>
                <div className="lp-about-bullet">
                  <span className="lp-about-bullet-icon"><CheckCircle size={18} /></span>
                  <span>Instant alert triggers to prevent shelf life loss</span>
                </div>
                <div className="lp-about-bullet">
                  <span className="lp-about-bullet-icon"><CheckCircle size={18} /></span>
                  <span>Transparent role-based storage lifecycle visibility</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="lp-section">
        <div className="lp-container">
          <ScrollReveal>
            <div className="lp-section-header">
              <span className="lp-tagline">Key Features</span>
              <h2 className="lp-section-title">Everything Needed for Modern Cold Chain Control</h2>
              <p className="lp-section-desc">
                Explore the advanced features engineered to make cold storage management automated, transparent, and secure.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="lp-features-grid">
            <ScrollReveal delay={0.0}>
              <motion.div whileHover={{ translateY: -8, scale: 1.01 }} className="lp-feature-card">
                <div className="lp-feature-icon"><Thermometer size={24} /></div>
                <h3 className="lp-feature-title">IoT Telemetry Logs</h3>
                <p className="lp-feature-desc">Continuous real-time records of temperature, humidity, and door sensor updates directly from active coldrooms.</p>
              </motion.div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <motion.div whileHover={{ translateY: -8, scale: 1.01 }} className="lp-feature-card">
                <div className="lp-feature-icon"><ShieldAlert size={24} /></div>
                <h3 className="lp-feature-title">Predictive Warnings</h3>
                <p className="lp-feature-desc">Algorithms evaluate storage duration and telemetry patterns to warn about Spoilage Risks before crops deteriorate.</p>
              </motion.div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <motion.div whileHover={{ translateY: -8, scale: 1.01 }} className="lp-feature-card">
                <div className="lp-feature-icon"><Calendar size={24} /></div>
                <h3 className="lp-feature-title">Smart online Bookings</h3>
                <p className="lp-feature-desc">Farmers can check regional facilities for capacity, submit reservation logs, and manage active storage space.</p>
              </motion.div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <motion.div whileHover={{ translateY: -8, scale: 1.01 }} className="lp-feature-card">
                <div className="lp-feature-icon"><BarChart3 size={24} /></div>
                <h3 className="lp-feature-title">Platform Analytics</h3>
                <p className="lp-feature-desc">Consolidated operational graphs mapping capacity, energy efficiency, revenue indicators, and crop risk distribution.</p>
              </motion.div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <motion.div whileHover={{ translateY: -8, scale: 1.01 }} className="lp-feature-card">
                <div className="lp-feature-icon"><Bell size={24} /></div>
                <h3 className="lp-feature-title">Low Latency Alerts</h3>
                <p className="lp-feature-desc">Automated alerts broadcast via SMS and in-app logs when coldroom thresholds run out of compliance bounds.</p>
              </motion.div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.3}>
              <motion.div whileHover={{ translateY: -8, scale: 1.01 }} className="lp-feature-card">
                <div className="lp-feature-icon"><Users size={24} /></div>
                <h3 className="lp-feature-title">Role-Based Portals</h3>
                <p className="lp-feature-desc">Three tailored dashboard flows ensuring Farmers, Coldroom Managers, and Enterprise Admins see relevant operations.</p>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="lp-section lp-stats">
        <div className="lp-container lp-stats-grid">
          <ScrollReveal delay={0.0} scale={0.95}>
            <div className="lp-stat-card">
              <span className="lp-stat-number">
                <AnimatedCounter value="85" suffix="%" />
              </span>
              <span className="lp-stat-label">Spoilage Reduction</span>
              <span className="lp-stat-desc">Minimized post-harvest crop waste</span>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.1} scale={0.95}>
            <div className="lp-stat-card">
              <span className="lp-stat-number">
                <AnimatedCounter value="99.9" decimals={1} suffix="%" />
              </span>
              <span className="lp-stat-label">Sensor Uptime</span>
              <span className="lp-stat-desc">Continuous cellular IoT telemetry</span>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2} scale={0.95}>
            <div className="lp-stat-card">
              <span className="lp-stat-number">
                <AnimatedCounter value="1.2" decimals={1} suffix="M+" />
              </span>
              <span className="lp-stat-label">Tons Preserved</span>
              <span className="lp-stat-desc">Agricultural cargo secured in coldrooms</span>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3} scale={0.95}>
            <div className="lp-stat-card">
              <span className="lp-stat-number">
                <AnimatedCounter value="4500" suffix="+" />
              </span>
              <span className="lp-stat-label">Active Users</span>
              <span className="lp-stat-desc">Farmers, operators, and distributors</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="preview" className="lp-section lp-preview">
        <div className="lp-container">
          <ScrollReveal>
            <div className="lp-section-header">
              <span className="lp-tagline">Portal Switcher</span>
              <h2 className="lp-section-title">Designed for Every Participant in the Cold Chain</h2>
              <p className="lp-section-desc">
                AgriFreeze shapes itself around your specific operations. Click the tabs below to preview the customized portal interfaces.
              </p>
            </div>
          </ScrollReveal>

          <div className="lp-preview-tabs">
            <button 
              className={`lp-preview-tab ${activePreviewTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActivePreviewTab('admin')}
            >
              <Lock size={16} />
              <span>Admin Portal</span>
            </button>
            <button 
              className={`lp-preview-tab ${activePreviewTab === 'manager' ? 'active' : ''}`}
              onClick={() => setActivePreviewTab('manager')}
            >
              <Warehouse size={16} />
              <span>Manager Portal</span>
            </button>
            <button 
              className={`lp-preview-tab ${activePreviewTab === 'farmer' ? 'active' : ''}`}
              onClick={() => setActivePreviewTab('farmer')}
            >
              <LayoutDashboard size={16} />
              <span>Farmer Portal</span>
            </button>
          </div>

          <ScrollReveal delay={0.1} scale={0.98}>
            <div className="lp-preview-viewport">
              <div className="lp-pv-header">
                <div className="lp-hm-dots">
                  <span className="lp-hm-dot"></span>
                  <span className="lp-hm-dot"></span>
                  <span className="lp-hm-dot"></span>
                </div>
                <div className="lp-pv-url">https://portal.agrifreeze.com/#/{activePreviewTab}/dashboard</div>
                <div style={{ width: '20px' }}></div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePreviewTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="lp-pv-body"
                >
                  {activePreviewTab === 'admin' && (
                    <>
                      <div className="sim-grid-3">
                        <div className="sim-card">
                          <div className="sim-card-header">
                            <span className="sim-card-title">Total Coldrooms</span>
                            <span className="sim-card-status status-green">Online</span>
                          </div>
                          <span className="sim-card-value">4 Active</span>
                        </div>
                        <div className="sim-card">
                          <div className="sim-card-header">
                            <span className="sim-card-title">Storage Managers</span>
                            <span className="sim-card-status status-green">Active</span>
                          </div>
                          <span className="sim-card-value">4 Registered</span>
                        </div>
                        <div className="sim-card">
                          <div className="sim-card-header">
                            <span className="sim-card-title">Monthly Platform Revenue</span>
                            <span className="sim-card-status status-green">+12.4%</span>
                          </div>
                          <span className="sim-card-value">$29,700</span>
                        </div>
                      </div>
                      <div className="sim-card">
                        <div className="sim-card-header">
                          <span className="sim-card-title" style={{ color: '#fff', fontSize: '0.9rem' }}>Regional Storage Allocation</span>
                        </div>
                        <table className="sim-table">
                          <thead>
                            <tr>
                              <th>Storage Facility</th>
                              <th>Location</th>
                              <th>Manager</th>
                              <th>Occupancy</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>AgriFreeze Coldroom Alpha</td>
                              <td>Salinas Valley, CA</td>
                              <td>Unassigned</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div className="sim-progress-bg" style={{ width: '80px' }}>
                                    <div className="sim-progress-fill status-yellow" style={{ width: '70%' }}></div>
                                  </div>
                                  <span>70%</span>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>AgriFreeze Coldroom Beta</td>
                              <td>Yakima, WA</td>
                              <td>Unassigned</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div className="sim-progress-bg" style={{ width: '80px' }}>
                                    <div className="sim-progress-fill status-red" style={{ width: '93%' }}></div>
                                  </div>
                                  <span>93%</span>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>AgriFreeze Coldroom Gamma</td>
                              <td>Orlando, FL</td>
                              <td>Unassigned</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div className="sim-progress-bg" style={{ width: '80px' }}>
                                    <div className="sim-progress-fill status-green" style={{ width: '30%' }}></div>
                                  </div>
                                  <span>30%</span>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {activePreviewTab === 'manager' && (
                    <>
                      <div className="sim-grid-3">
                        <div className="sim-card">
                          <div className="sim-card-header">
                            <span className="sim-card-title">Average Room Temp</span>
                            <span className="sim-card-status status-green">Optimal</span>
                          </div>
                          <span className="sim-card-value">2.4°C</span>
                        </div>
                        <div className="sim-card">
                          <div className="sim-card-header">
                            <span className="sim-card-title">Mean Humidity</span>
                            <span className="sim-card-status status-green">Stable</span>
                          </div>
                          <span className="sim-card-value">85% RH</span>
                        </div>
                        <div className="sim-card">
                          <div className="sim-card-header">
                            <span className="sim-card-title">Active Products</span>
                            <span className="sim-card-status status-yellow">1 Anomaly</span>
                          </div>
                          <span className="sim-card-value">3 Deposits</span>
                        </div>
                      </div>
                      <div className="sim-grid-2">
                        <div className="sim-card">
                          <span className="sim-card-title" style={{ color: '#fff', fontSize: '0.85rem' }}>Incoming Farmer Stock Logs</span>
                          <table className="sim-table">
                            <thead>
                              <tr>
                                <th>Crop Item</th>
                                <th>Farmer</th>
                                <th>Qty (Tons)</th>
                                <th>Risk Index</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Organic Strawberries</td>
                                <td>Rahul Kumar</td>
                                <td>45 Tons</td>
                                <td><span className="sim-card-status status-green">Healthy</span></td>
                              </tr>
                              <tr>
                                <td>Fresh Broccoli</td>
                                <td>Rahul Kumar</td>
                                <td>15 Tons</td>
                                <td><span className="sim-card-status status-yellow">At Risk (2d)</span></td>
                              </tr>
                              <tr>
                                <td>Red Raspberries</td>
                                <td>Elena Rostova</td>
                                <td>35 Tons</td>
                                <td><span className="sim-card-status status-red">Critical Risk</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="sim-card" style={{ gap: '0.5rem' }}>
                          <span className="sim-card-title" style={{ color: '#fff' }}>Telemetry Triggers</span>
                          <div style={{ background: 'rgba(245, 158, 11, 0.1)', borderLeft: '3px solid #f59e0b', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                            <span style={{ color: '#fbbf24', fontWeight: 600 }}>Warning: door open</span>
                            <p style={{ color: '#94a3b8', margin: '0.15rem 0' }}>Coldroom Alpha door left open &gt; 10 min.</p>
                            <small style={{ color: '#64748b' }}>01:10 AM</small>
                          </div>
                          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #ef4444', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                            <span style={{ color: '#f87171', fontWeight: 600 }}>Critical: Backup Power</span>
                            <p style={{ color: '#94a3b8', margin: '0.15rem 0' }}>Gamma switched to generator supply.</p>
                            <small style={{ color: '#64748b' }}>12:05 AM</small>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activePreviewTab === 'farmer' && (
                    <>
                      <div className="sim-grid-3">
                        <div className="sim-card">
                          <div className="sim-card-header">
                            <span className="sim-card-title">Deposited Stock</span>
                          </div>
                          <span className="sim-card-value">180 Tons</span>
                        </div>
                        <div className="sim-card">
                          <div className="sim-card-header">
                            <span className="sim-card-title">Active Facilities</span>
                          </div>
                          <span className="sim-card-value">1 Coldroom</span>
                        </div>
                        <div className="sim-card">
                          <div className="sim-card-header">
                            <span className="sim-card-title">Confirmed Bookings</span>
                            <span className="sim-card-status status-green">Active</span>
                          </div>
                          <span className="sim-card-value">1 BKG</span>
                        </div>
                      </div>
                      <div className="sim-grid-2">
                        <div className="sim-card">
                          <span className="sim-card-title" style={{ color: '#fff', fontSize: '0.85rem' }}>My Crop Deposition Telemetry</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                <span>Organic Strawberries (Coldroom Alpha)</span>
                                <span style={{ color: '#34d399', fontWeight: 600 }}>2.4°C - Safe</span>
                              </div>
                              <div className="sim-progress-bg">
                                <div className="sim-progress-fill status-green" style={{ width: '80%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                <span>Fresh Broccoli (Coldroom Alpha)</span>
                                <span style={{ color: '#fbbf24', fontWeight: 600 }}>4.1°C - High Risk</span>
                              </div>
                              <div className="sim-progress-bg">
                                <div className="sim-progress-fill status-yellow" style={{ width: '25%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="sim-card" style={{ background: '#162032', border: '1px dashed #3b82f6', justifyContent: 'center', alignItems: 'center', textAlign: 'center', cursor: 'pointer' }}>
                          <span className="lp-about-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', marginBottom: '0.5rem' }}><Calendar size={18} /></span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Book Storage Online</span>
                          <p style={{ fontSize: '0.7rem', color: '#64748b', margin: '0.25rem 0' }}>Instantly lock in coldroom storage slots.</p>
                          <button className="lp-btn lp-btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem', borderRadius: '4px', marginTop: '0.5rem' }} onClick={() => navigate('/login')}>Reserve Slot</button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="timeline" className="lp-section">
        <div className="lp-container">
          <ScrollReveal>
            <div className="lp-section-header">
              <span className="lp-tagline">Workflow</span>
              <h2 className="lp-section-title">Seamless Integration from Farm to Storage</h2>
              <p className="lp-section-desc">
                An intuitive operational cycle designed to get products tracked and preserved in minimal steps.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="lp-steps-timeline">
            <ScrollReveal delay={0.0}>
              <div className="lp-step-item">
                <div className="lp-step-number">01</div>
                <h3 className="lp-step-title">Deploy IoT Hub</h3>
                <p className="lp-step-desc">Place our cellular wireless telemetry sensors in coldrooms to establish live temperature grids.</p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.15}>
              <div className="lp-step-item">
                <div className="lp-step-number">02</div>
                <h3 className="lp-step-title">Rent Storage</h3>
                <p className="lp-step-desc">Farmers search regional active coldroom facilities, reserve capacity, and catalog crop batches online.</p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.3}>
              <div className="lp-step-item">
                <div className="lp-step-number">03</div>
                <h3 className="lp-step-title">Continuous Telemetry</h3>
                <p className="lp-step-desc">IoT hubs send ongoing tracking logs. Risk triggers detect temperature anomalies before spoilage begins.</p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.45}>
              <div className="lp-step-item">
                <div className="lp-step-number">04</div>
                <h3 className="lp-step-title">Safe Dispatch</h3>
                <p className="lp-step-desc">Retrieve preserved crops with verifiable storage telemetry audits, securing optimal buyer prices.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why Choose AgriFreeze Section */}
      <section className="lp-section">
        <div className="lp-container lp-why-grid">
          <ScrollReveal delay={0.0} x={-25} y={0}>
            <div>
              <span className="lp-tagline">Why AgriFreeze</span>
              <h2 className="lp-section-title">The Enterprise Cold Chain Standard</h2>
              <p className="lp-section-desc" style={{ marginBottom: '2rem' }}>
                We build hardware-integrated SaaS that handles the complex realities of agricultural cold chains, offering unmatched protection for storage facilities.
              </p>
              <motion.button 
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                className="lp-btn lp-btn-primary" 
                onClick={() => navigate('/login')}
              >
                <span>Get Started Now</span>
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </ScrollReveal>
          
          <div className="lp-why-bullets">
            <ScrollReveal delay={0.1}>
              <motion.div whileHover={{ translateX: 5 }} className="lp-why-bullet-card">
                <span className="lp-why-bullet-icon"><CheckCircle size={24} /></span>
                <div>
                  <h3 className="lp-why-bullet-title">Low-Latency Incident Dispatch</h3>
                  <p className="lp-why-bullet-desc">Receive threshold anomalies via instant notifications before crop spoilage damages stock logs.</p>
                </div>
              </motion.div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <motion.div whileHover={{ translateX: 5 }} className="lp-why-bullet-card">
                <span className="lp-why-bullet-icon"><CheckCircle size={24} /></span>
                <div>
                  <h3 className="lp-why-bullet-title">Plugin Cellular IoT Hubs</h3>
                  <p className="lp-why-bullet-desc">Pre-configured hardware logs connect automatically. Zero complex ethernet or local Wi-Fi setup needed.</p>
                </div>
              </motion.div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.3}>
              <motion.div whileHover={{ translateX: 5 }} className="lp-why-bullet-card">
                <span className="lp-why-bullet-icon"><CheckCircle size={24} /></span>
                <div>
                  <h3 className="lp-why-bullet-title">Eco-Friendly Efficiency</h3>
                  <p className="lp-why-bullet-desc">Energy telemetry logs help coldrooms optimize compressor schedules, reducing power waste by 18%.</p>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="lp-section">
        <div className="lp-container">
          <ScrollReveal>
            <div className="lp-section-header">
              <span className="lp-tagline">Testimonials</span>
              <h2 className="lp-section-title">Trusted Across the Supply Chain</h2>
              <p className="lp-section-desc">
                Read how farmers, warehouse managers, and admins are securing food stability with AgriFreeze.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="lp-testimonials-grid">
            <ScrollReveal delay={0.0}>
              <motion.div whileHover={{ translateY: -5 }} className="lp-testimonial-card">
                <div className="lp-t-stars">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="lp-t-text">
                  "We were losing nearly 20% of our berry yields to unexpected temperature changes during peak summer. AgriFreeze gave us instant alerts that saved our inventory."
                </p>
                <div className="lp-t-author">
                  <div className="lp-t-avatar">RK</div>
                  <div>
                    <h4 className="lp-t-name">Rahul Kumar</h4>
                    <span className="lp-t-role">Organic Berry Cultivator</span>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <motion.div whileHover={{ translateY: -5 }} className="lp-testimonial-card">
                <div className="lp-t-stars">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="lp-t-text">
                  "As a coldroom manager, tracking bookings manually was a logistical nightmare. AgriFreeze automated reservations while linking live sensor streams directly to our clients."
                </p>
                <div className="lp-t-author">
                  <div className="lp-t-avatar">JS</div>
                  <div>
                    <h4 className="lp-t-name">James Sterling</h4>
                    <span className="lp-t-role">Coldroom Facility Operator</span>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <motion.div whileHover={{ translateY: -5 }} className="lp-testimonial-card">
                <div className="lp-t-stars">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="lp-t-text">
                  "The unified admin portal allows our compliance officers to pull verified audit trail histories instantly. Real-time metrics give us complete oversight."
                </p>
                <div className="lp-t-author">
                  <div className="lp-t-avatar">SJ</div>
                  <div>
                    <h4 className="lp-t-name">Sarah Jenkins</h4>
                    <span className="lp-t-role">Enterprise Operations Director</span>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="lp-section">
        <div className="lp-container">
          <ScrollReveal>
            <div className="lp-section-header">
              <span className="lp-tagline">FAQ</span>
              <h2 className="lp-section-title">Frequently Asked Questions</h2>
              <p className="lp-section-desc">
                Have questions about how AgriFreeze protects your agricultural cold chain? Find key insights below.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="lp-faq-list">
            {faqs.map((faq, index) => {
              const isActive = expandedFaqIndex === index;
              return (
                <ScrollReveal key={index} delay={index * 0.05} scale={0.98}>
                  <div className={`lp-faq-item ${isActive ? 'active' : ''}`}>
                    <button 
                      className="lp-faq-trigger"
                      onClick={() => setExpandedFaqIndex(isActive ? -1 : index)}
                    >
                      <span>{faq.q}</span>
                      <span className="lp-faq-icon"><ChevronDown size={18} /></span>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="lp-faq-panel"
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="lp-faq-panel-inner">
                            <p>{faq.a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="lp-section">
        <div className="lp-container lp-contact-grid">
          <div className="lp-contact-info">
            <ScrollReveal delay={0.0} x={-20} y={0}>
              <div>
                <span className="lp-tagline">Get In Touch</span>
                <h2 className="lp-section-title" style={{ textAlign: 'left' }}>Connect with a Cold Chain Specialist</h2>
                <p className="lp-section-desc">
                  Have questions about custom sensor layouts, enterprise pricing, or scheduling live portal demonstrations? Fill out the contact form, and our specialists will respond within 24 hours.
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div className="lp-contact-card">
                  <span className="lp-contact-icon"><Mail size={20} /></span>
                  <div>
                    <h4 className="lp-contact-card-title">General Inquiries</h4>
                    <span className="lp-contact-card-desc">support@agrifreeze.com</span>
                  </div>
                </div>
                <div className="lp-contact-card">
                  <span className="lp-contact-icon"><Phone size={20} /></span>
                  <div>
                    <h4 className="lp-contact-card-title">Sales Telephony</h4>
                    <span className="lp-contact-card-desc">+1 (555) 303-9988</span>
                  </div>
                </div>
                <div className="lp-contact-card">
                  <span className="lp-contact-icon"><MapPin size={20} /></span>
                  <div>
                    <h4 className="lp-contact-card-title">Corporate Headquarters</h4>
                    <span className="lp-contact-card-desc">100 Tech Parkway, Suite 400, Salinas, CA 93901</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lp-contact-form-container">
            <ScrollReveal delay={0.1} scale={0.98}>
              {isFormSubmitted ? (
                <div className="lp-form-success">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Message Delivered Successfully!</h4>
                    <p style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'inherit', marginTop: '0.25rem' }}>
                      Thank you. An AgriFreeze logistics representative will be in touch shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="lp-form">
                  <div className="lp-form-row">
                    <div className="lp-form-group">
                      <label htmlFor="name" className="lp-form-label">Full Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        className="lp-form-input" 
                        placeholder="Rahul Kumar" 
                        required 
                      />
                    </div>
                    <div className="lp-form-group">
                      <label htmlFor="email" className="lp-form-label">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        className="lp-form-input" 
                        placeholder="rahul@farmfresh.com" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="lp-form-group">
                    <label htmlFor="role" className="lp-form-label">My Operations Role</label>
                    <select 
                      id="role" 
                      name="role" 
                      value={formData.role}
                      onChange={handleInputChange}
                      className="lp-form-select"
                    >
                      <option value="farmer">Farmer / Agricultural Producer</option>
                      <option value="manager">Warehouse Operator / Coldroom Owner</option>
                      <option value="enterprise">Enterprise Distributor / Admin</option>
                    </select>
                  </div>

                  <div className="lp-form-group">
                    <label htmlFor="message" className="lp-form-label">How can we assist you?</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4" 
                      className="lp-form-textarea" 
                      placeholder="Tell us about your storage facility, capacity requirements, or general cold chain challenges..." 
                      required
                    ></textarea>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02, translateY: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="lp-btn lp-btn-primary" 
                    style={{ width: '100%' }}
                  >
                    <span>Submit Inquiry</span>
                    <ArrowRight size={16} />
                  </motion.button>
                </form>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Premium Footer Section */}
      <footer className="lp-footer">
        <ScrollReveal duration={0.8}>
          <div className="lp-container lp-footer-grid">
            <div className="lp-footer-brand">
              <a href="#home" className="lp-footer-logo" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
                <span className="lp-logo-icon"><Warehouse size={26} strokeWidth={2.5} /></span>
                <span>AgriFreeze</span>
              </a>
              <p className="lp-footer-desc">
                Empowering farmers and warehouse managers globally with intelligent, IoT-linked crop preservation solutions.
              </p>
            </div>
            
            <div className="lp-footer-col">
              <h4 className="lp-footer-col-title">Platform</h4>
              <ul className="lp-footer-links">
                <li><span className="lp-footer-link" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('features')}>Features</span></li>
                <li><span className="lp-footer-link" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('preview')}>Portals</span></li>
                <li><span className="lp-footer-link" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('timeline')}>Workflow</span></li>
                <li><span className="lp-footer-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign In Portal</span></li>
              </ul>
            </div>

            <div className="lp-footer-col">
              <h4 className="lp-footer-col-title">Company</h4>
              <ul className="lp-footer-links">
                <li><span className="lp-footer-link" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('about')}>About Us</span></li>
                <li><a href="#" className="lp-footer-link">Sustainability Impact</a></li>
                <li><a href="#" className="lp-footer-link">News & Press</a></li>
                <li><span className="lp-footer-link" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('contact')}>Contact Specialists</span></li>
              </ul>
            </div>

            <div className="lp-footer-col">
              <h4 className="lp-footer-col-title">Legal</h4>
              <ul className="lp-footer-links">
                <li><a href="#" className="lp-footer-link">Terms of Service</a></li>
                <li><a href="#" className="lp-footer-link">Privacy Policy</a></li>
                <li><a href="#" className="lp-footer-link">IoT Security Audits</a></li>
                <li><a href="#" className="lp-footer-link">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="lp-container lp-footer-bottom">
            <span>&copy; {new Date().getFullYear()} AgriFreeze Inc. All rights reserved.</span>
            <div className="lp-footer-status">
              <span className="lp-footer-pulse"></span>
              <span>System Status: Operational</span>
            </div>
          </div>
        </ScrollReveal>
      </footer>
    </div>
  );
};
