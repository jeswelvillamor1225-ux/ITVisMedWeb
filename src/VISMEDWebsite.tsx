import { useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';

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
          <a href="/admin">Admin Portal</a>
          <a href="#services">Services</a>
          <a href="#team">Our Team</a>
          <a href="#announcements">Announcements</a>
          <a href="#contact">Contact Us</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleAuthClick(); }}>Sign In/Up</a>
        </div>

        <div className="nav-actions">
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
                <div className="hcard-icon">🖥️</div>
                <h4>HIS / EMR</h4>
                <p>Integrated hospital systems</p>
              </div>
              <div className="hcard">
                <div className="hcard-icon">📡</div>
                <h4>Network Ops</h4>
                <p>Campus-wide connectivity</p>
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
            <h2>IT Services & Support</h2>
            <p>Comprehensive technology services designed to keep VISMED Hospital running at peak performance.</p>
          </div>
          <div className="services-grid">
            <div className="service-card fade-in">
              <div className="svc-icon">🖥️</div>
              <h3>Help Desk & Technical Support</h3>
              <p>First-line IT support for all hospital staff. Hardware troubleshooting, software assistance, and account management.</p>
              <a href="#contact" className="svc-link">Submit a ticket →</a>
            </div>
            <div className="service-card fade-in">
              <div className="svc-icon">🏥</div>
              <h3>Hospital Information System</h3>
              <p>Administration and support for the HIS/EMR platform, ensuring clinical workflows run smoothly for all departments.</p>
              <a href="#" className="svc-link">Learn more →</a>
            </div>
            <div className="service-card fade-in">
              <div className="svc-icon">📡</div>
              <h3>Network & Connectivity</h3>
              <p>Wired and wireless network management across all hospital buildings, ensuring fast and reliable connections.</p>
              <a href="#" className="svc-link">Network status →</a>
            </div>
            <div className="service-card fade-in">
              <div className="svc-icon">🛡️</div>
              <h3>Cybersecurity & Compliance</h3>
              <p>Data protection, firewall management, threat monitoring, and compliance with healthcare data security regulations.</p>
              <a href="#" className="svc-link">Security policy →</a>
            </div>
            <div className="service-card fade-in">
              <div className="svc-icon">☁️</div>
              <h3>Server & Cloud Infrastructure</h3>
              <p>On-premise server administration and cloud service management to ensure high availability of critical systems.</p>
              <a href="#" className="svc-link">Infrastructure map →</a>
            </div>
            <div className="service-card fade-in">
              <div className="svc-icon">📊</div>
              <h3>Data Management & Reporting</h3>
              <p>Database administration, backup systems, and business intelligence tools for hospital analytics and decision-making.</p>
              <a href="#" className="svc-link">Data portal →</a>
            </div>
            <div className="service-card fade-in">
              <div className="svc-icon">📱</div>
              <h3>Device & Asset Management</h3>
              <p>Inventory tracking, provisioning, and lifecycle management for all hospital computers, tablets, and medical devices.</p>
              <a href="#" className="svc-link">Asset portal →</a>
            </div>
            <div className="service-card fade-in">
              <div className="svc-icon">🎓</div>
              <h3>IT Training & Onboarding</h3>
              <p>System orientation for new staff and periodic training for software updates, security best practices, and digital tools.</p>
              <a href="#" className="svc-link">Schedule training →</a>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section" id="team">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-tag">Our People</div>
            <h2>Meet the IT Team</h2>
            <p>Dedicated professionals ensuring seamless technology across VISMED Hospital.</p>
          </div>
          <div className="team-grid">
            <div className="team-card fade-in">
              <div className="team-avatar">👨‍💼</div>
              <div className="team-info">
                <h4>Romel B. Banquil</h4>
                <span>IT Manager</span>
                <p>Infrastructure & Operations Lead</p>
              </div>
            </div>
            <div className="team-card fade-in">
              <div className="team-avatar">👩‍💻</div>
              <div className="team-info">
                <h4>Loudisah "liling" Laspiñas</h4>
                <span>Systems Analyst</span>
                <p>HIS / EMR Integration</p>
              </div>
            </div>
            <div className="team-card fade-in">
              <div className="team-avatar">👨‍🔧</div>
              <div className="team-info">
                <h4>John Agustin Baylon</h4>
                <span>Network Engineer Sr. Staff</span>
                <p>LAN / WAN & Connectivity</p>
              </div>
            </div>
            <div className="team-card fade-in">
              <div className="team-avatar">👩‍🛡️</div>
              <div className="team-info">
                <h4>Jeswel B. Villamor</h4>
                <span>Network Engineer Jr. Staff</span>
                <p>LAN / WAN & Connectivity</p>
              </div>
            </div>
            <div className="team-card fade-in">
              <div className="team-avatar">👨‍💻</div>
              <div className="team-info">
                <h4>John Roli Yakit, Aljun Montecalvo, Angelu Banogbanog, Kerry Ecuasion</h4>
                <span>IT OJT'S</span>
                <p>Help Desk & Hardware</p>
              </div>
            </div>
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
                <div className="ann-date"><strong>28</strong><span>Feb</span></div>
                <div className="ann-body">
                  <span className="ann-tag maintenance">🔧 Maintenance</span>
                  <h4>Scheduled Network Maintenance – 3rd Floor</h4>
                  <p>Network switches on the 3rd floor will undergo preventive maintenance on March 1, 2:00–4:00 AM. Temporary disruptions expected.</p>
                </div>
              </div>
              <div className="ann-card fade-in">
                <div className="ann-date"><strong>25</strong><span>Feb</span></div>
                <div className="ann-body">
                  <span className="ann-tag upgrade">⬆️ Upgrade</span>
                  <h4>HIS Platform Updated to Version 4.7</h4>
                  <p>The Hospital Information System has been updated. Please clear browser cache and log in again. New features include improved billing module and faster lab results view.</p>
                </div>
              </div>
              <div className="ann-card fade-in">
                <div className="ann-date"><strong>20</strong><span>Feb</span></div>
                <div className="ann-body">
                  <span className="ann-tag security">🔒 Security</span>
                  <h4>Mandatory Password Reset – All Staff Accounts</h4>
                  <p>All hospital staff are required to reset their Active Directory passwords by March 5. Please follow the new 12-character policy.</p>
                </div>
              </div>
              <div className="ann-card fade-in">
                <div className="ann-date"><strong>15</strong><span>Feb</span></div>
                <div className="ann-body">
                  <span className="ann-tag training">📚 Training</span>
                  <h4>IT Security Awareness Seminar – All Departments</h4>
                  <p>Mandatory phishing awareness and data security training for all staff. Schedule your slot via the IT portal before March 10.</p>
                </div>
              </div>
            </div>
            <div>
              <div className="sidebar-widget fade-in" style={{marginBottom:'1rem'}}>
                <h3>⚡ Quick Links</h3>
                <a href="#" className="quick-link"><div className="quick-link-icon">🎫</div> Submit IT Ticket</a>
                <a href="#" className="quick-link"><div className="quick-link-icon">🔑</div> Password Reset</a>
                <a href="#" className="quick-link"><div className="quick-link-icon">📦</div> Asset Request</a>
                <a href="#" className="quick-link"><div className="quick-link-icon">🖨️</div> Printer Setup Guide</a>
                <a href="#" className="quick-link"><div className="quick-link-icon">📡</div> Network Status</a>
                <a href="#" className="quick-link"><div className="quick-link-icon">📋</div> IT Forms & Policies</a>
              </div>
              <div className="sidebar-widget fade-in">
                <h3>📞 Emergency IT Contacts</h3>
                <a href="tel:+3225310001" className="quick-link"><div className="quick-link-icon">☎️</div> Help Desk Ext. 1001</a>
                <a href="tel:+3225310002" className="quick-link"><div className="quick-link-icon">📟</div> On-call: 0917-XXX-XXXX</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div className="contact-grid">
          <div className="contact-left fade-in">
            <div className="section-tag" style={{background:'rgba(59,158,255,.15)',borderColor:'rgba(59,158,255,.3)',color:'var(--bright)'}}>Get In Touch</div>
            <h2>How Can We <em>Help</em> You?</h2>
            <p>Reach out to the VISMED IT Department for technical support, system requests, or general IT inquiries. Our team is here to assist you.</p>
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-item-icon">📍</div>
                <div className="contact-item-text">
                  <strong>Location</strong>
                  <span>IT Department, 1st Floor – Admin Building, VISMED Hospital Cebu</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">📞</div>
                <div className="contact-item-text">
                  <strong>Help Desk</strong>
                  <span>Local 1001 | (+32) 253-1901 ext. 1001</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">📧</div>
                <div className="contact-item-text">
                  <strong>Email</strong>
                  <span>it@visayasmed.com.ph</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">🕐</div>
                <div className="contact-item-text">
                  <strong>Office Hours</strong>
                  <span>Monday – Sunday: 8:00 AM – 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-form fade-in">
            <h3>📋 Submit an IT Request</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" placeholder="Juan"/>
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Dela Cruz"/>
              </div>
            </div>
            <div className="form-group">
              <label>Department / Unit</label>
              <select>
                <option value="">Select your department</option>
                <option>Emergency Room</option>
                <option>Nursing Unit</option>
                <option>Radiology</option>
                <option>Laboratory</option>
                <option>Pharmacy</option>
                <option>Finance & Billing</option>
                <option>Admissions</option>
                <option>Administration</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Request Type</label>
              <select>
                <option value="">Select request type</option>
                <option>Hardware Issue</option>
                <option>Software / HIS Support</option>
                <option>Network / Connectivity</option>
                <option>Account / Password</option>
                <option>New Device / Asset Request</option>
                <option>Security Concern</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message / Description</label>
              <textarea placeholder="Describe your issue or request in detail..."></textarea>
            </div>
            <button className="btn-primary" style={{width:'100%',padding:'.8rem',fontSize:'.9rem'}}>
              📤 Submit Request
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-about">
            <a href="#" className="logo">
              <div className="logo-icon" style={{width:'38px',height:'38px'}}>
                <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L20 8v.01l-8 4-8-4V8l8-3.82zM4 9.78l7 3.5V19.4l-7-3.5V9.78zm9 10.62V13.28l7-3.5v6.12l-7 3.5z"/></svg>
              </div>
              <div className="logo-text">
                <strong style={{color:'white',fontSize:'1.1rem'}}>VISMED</strong>
                <span>IT Department</span>
              </div>
            </a>
            <p style={{marginTop:'1rem'}}>Providing innovative and reliable IT infrastructure to support the mission of VISMED Hospital in delivering exceptional patient care in Cebu.</p>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <a href="#">Help Desk</a>
            <a href="#">HIS / EMR Support</a>
            <a href="#">Network Operations</a>
            <a href="#">Cybersecurity</a>
            <a href="#">Device Management</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#">IT Portal</a>
            <a href="#">Submit a Ticket</a>
            <a href="#">IT Policies</a>
            <a href="#">Forms & Requests</a>
            <a href="#">Staff Training</a>
          </div>
          <div className="footer-col">
            <h4>Hospital</h4>
            <a href="#">VISMED Hospital</a>
            <a href="#">Departments</a>
            <a href="#">Patient Care</a>
            <a href="#">Find a Doctor</a>
            <a href="#">Appointments</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 VISMED Hospital – IT Department. All rights reserved.</span>
          <span>Privacy Policy · Data Security · Terms of Use</span>
        </div>
      </footer>
    </>
  );
};

export default VISMEDWebsite;
