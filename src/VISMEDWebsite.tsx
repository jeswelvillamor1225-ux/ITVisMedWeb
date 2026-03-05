import { useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import DocumentaryGallery from './components/DocumentaryGallery';
import CustomLinks from './components/CustomLinks';

const VISMEDWebsite = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Scroll fade-in animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && e.target instanceof HTMLElement) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Stagger cards
    document.querySelectorAll('.services-grid .service-card, .team-grid .team-card, .ann-list .ann-card').forEach((card: Element, i) => {
      if (card instanceof HTMLElement) {
        card.style.transitionDelay = (i * 0.08) + 's';
      }
    });
  }, []);

  const handleAuthClick = () => {
    const event = new CustomEvent('openAuthModal');
    window.dispatchEvent(event);
  };

  const handlePortalClick = () => {
    if (user) {
      window.location.href = '/dashboard';
    } else {
      handleAuthClick();
    }
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <div className="topbar-left">
          <span>
            <svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.53 15.53 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C9.93 21 3 14.07 3 5.5a1 1 0 0 1 1-1H8a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01z"/></svg>
            (+32) 253-1901
          </span>
          <span>
            <svg viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 7L4 6v.01L12 13l8-6.99V6z"/></svg>
            it@visayasmed.com.ph
          </span>
          <span>Help Desk: Mon–Sun 8AM–5PM</span>
        </div>
        <div className="topbar-right">
          <a href="#">🔔 Alerts</a>
          {user ? (
            <a href="/dashboard">👤 {user.email}</a>
          ) : (
            <a href="#" onClick={(e) => { e.preventDefault(); handleAuthClick(); }}>👤 Sign In/Up</a>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <nav>
        <a href="#" className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L20 8v.01l-8 4-8-4V8l8-3.82zM4 9.78l7 3.5V19.4l-7-3.5V9.78zm9 10.62V13.28l7-3.5v6.12l-7 3.5z"/></svg>
          </div>
          <div className="logo-text">
            <strong>VISMED</strong>
            <span>IT Department</span>
          </div>
        </a>

        <div className="nav-links">
          <a href="#" className="active">Home</a>
          <a href="#services">Services</a>
          <a href="#team">Our Team</a>
          <a href="#documentary">Documentary</a>
          <a href="#links">Links</a>
          <a href="#announcements">Announcements</a>
          <a href="#contact">Contact Us</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleAuthClick(); }}>Sign In/Up</a>
        </div>

        <div className="nav-actions">
          <CustomLinks category="navigation" />
          <button className="btn-outline" onClick={() => {
            const contact = document.getElementById('contact');
            if (contact) {
              contact.scrollIntoView({behavior:'smooth'});
            }
          }}>Submit Ticket</button>
          <button className="btn-primary" onClick={handlePortalClick}>
            {user ? '🚀 Enter Portal' : '🔐 IT Portal'}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-breadcrumb">
              <a href="#">🏠 Home</a>
              <span>/</span>
              <span>Departments</span>
              <span>/</span>
              <span>IT Department</span>
            </div>
            <div className="hero-tag">⚙️ Information Technology</div>
            <h1>Powering <em>Healthcare</em><br/>Through Technology</h1>
            <p>The VISMED Hospital IT Department delivers reliable, secure, and innovative technology solutions that enable our clinical and administrative staff to provide excellent patient care.</p>
            <div className="hero-actions">
              <a href="#services" className="btn-hero-primary">
                Explore Services
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h15"/></svg>
              </a>
              <a href="#contact" className="btn-hero-outline">Submit a Request</a>
              <CustomLinks category="hero" />
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>99.9%</strong><span>System Uptime</span></div>
              <div className="hero-stat"><strong>24/7</strong><span>Monitoring</span></div>
              <div className="hero-stat"><strong>&lt;2hr</strong><span>Avg. Response</span></div>
              <div className="hero-stat"><strong>500+</strong><span>Devices Managed</span></div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-cards">
              <div className="hcard">
                <div className="hcard-icon">🛡️</div>
                <h4>Cybersecurity</h4>
                <p>ISO 27001 compliant infrastructure</p>
              </div>
              <div className="hcard">
                <div className="hcard-icon">☁️</div>
                <h4>Cloud Solutions</h4>
                <p>Scalable cloud infrastructure</p>
              </div>
              <div className="hcard">
                <div className="hcard-icon">📊</div>
                <h4>Analytics</h4>
                <p>Data-driven insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section services" id="services">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-tag">What We Do</div>
            <h2>IT Services</h2>
            <p>Comprehensive technology solutions supporting healthcare operations</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card fade-in">
              <div className="service-icon">🏥</div>
              <h3>HIS Support</h3>
              <p>24/7 Hospital Information System maintenance and user support</p>
            </div>
            <div className="service-card fade-in">
              <div className="service-icon">🔐</div>
              <h3>Security</h3>
              <p>Advanced cybersecurity measures and compliance management</p>
            </div>
            <div className="service-card fade-in">
              <div className="service-icon">🌐</div>
              <h3>Network Infrastructure</h3>
              <p>Reliable high-speed network connectivity across all facilities</p>
            </div>
            <div className="service-card fade-in">
              <div className="service-icon">💾</div>
              <h3>Data Management</h3>
              <p>Secure backup, recovery, and data governance solutions</p>
            </div>
            <div className="service-card fade-in">
              <div className="service-icon">📱</div>
              <h3>Mobile Solutions</h3>
              <p>Mobile applications for healthcare providers and patients</p>
            </div>
            <div className="service-card fade-in">
              <div className="service-icon">🔧</div>
              <h3>Technical Support</h3>
              <p>Help desk and hardware maintenance services</p>
            </div>
          </div>

          <div className="custom-services-section">
            <div className="section-header">
              <h3>Additional Resources</h3>
            </div>
            <div className="custom-services-links">
              <CustomLinks category="services" />
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section team" id="team">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-tag">Our Team</div>
            <h2>IT Professionals</h2>
            <p>Skilled professionals dedicated to healthcare technology excellence</p>
          </div>
          
          <div className="team-grid">
            <div className="team-card fade-in">
              <div className="team-avatar">👨‍💼</div>
              <h4>IT Director</h4>
              <p>Strategic technology planning and department leadership</p>
            </div>
            <div className="team-card fade-in">
              <div className="team-avatar">👩‍💻</div>
              <h4>System Administrator</h4>
              <p>Server management and system optimization</p>
            </div>
            <div className="team-card fade-in">
              <div className="team-avatar">👨‍🔧</div>
              <h4>Network Engineer</h4>
              <p>Network infrastructure and connectivity management</p>
            </div>
            <div className="team-card fade-in">
              <div className="team-avatar">👩‍🔧</div>
              <h4>Support Specialist</h4>
              <p>Technical support and user assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* DOCUMENTARY GALLERY */}
      <DocumentaryGallery />

      {/* LINKS SECTION */}
      <section className="section links" id="links">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-tag">Quick Access</div>
            <h2>Useful Links</h2>
            <p>Quick access to important systems, resources, and external services.</p>
          </div>
          
          <div className="links-content">
            <CustomLinks category="hero" />
            <CustomLinks category="services" />
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section className="section announcements" id="announcements">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-tag">Latest Updates</div>
            <h2>IT Announcements</h2>
            <p>System notices, scheduled maintenance, and important IT updates for hospital staff.</p>
          </div>
          <div className="ann-grid">
            <div className="ann-list">
              <div className="ann-card fade-in">
                <div className="ann-icon">🔔</div>
                <div className="ann-content">
                  <h4>System Maintenance</h4>
                  <p>Scheduled maintenance this weekend - expect brief downtime</p>
                  <span className="ann-date">2 hours ago</span>
                </div>
              </div>
              <div className="ann-card fade-in">
                <div className="ann-icon">🛡️</div>
                <div className="ann-content">
                  <h4>Security Update</h4>
                  <p>New security patches deployed across all systems</p>
                  <span className="ann-date">1 day ago</span>
                </div>
              </div>
              <div className="ann-card fade-in">
                <div className="ann-icon">📱</div>
                <div className="ann-content">
                  <h4>Mobile App Update</h4>
                  <p>New features added to the hospital mobile application</p>
                  <span className="ann-date">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section contact" id="contact">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-tag">Get In Touch</div>
            <h2>Contact IT Support</h2>
            <p>Reach out to our team for technical assistance and inquiries</p>
          </div>
          
          <div className="contact-grid">
            <div className="contact-card fade-in">
              <div className="contact-icon">📞</div>
              <h3>Help Desk</h3>
              <p>(+32) 253-1901</p>
              <span>Mon-Sun 8AM-5PM</span>
            </div>
            <div className="contact-card fade-in">
              <div className="contact-icon">📧</div>
              <h3>Email Support</h3>
              <p>it@visayasmed.com.ph</p>
              <span>24/7 Response</span>
            </div>
            <div className="contact-card fade-in">
              <div className="contact-icon">🏥</div>
              <h3>On-Site Support</h3>
              <p>IT Department Office</p>
              <span>Ground Floor, Main Building</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-logo">
                <strong>VISMED</strong>
                <span>IT Department</span>
              </div>
              <p>Delivering technology solutions for healthcare excellence</p>
            </div>
            <div className="footer-links">
              <CustomLinks category="footer" />
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 VISMED Hospital IT Department. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default VISMEDWebsite;
