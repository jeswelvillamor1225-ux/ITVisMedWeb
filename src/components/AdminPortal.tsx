import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface WebsiteContent {
  id: string;
  section: string;
  title: string;
  content: string;
  imageUrl?: string;
  order: number;
  lastModified: string;
  modifiedBy: string;
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
}

interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

const AdminPortal: React.FC = () => {
  const { user, userRoles, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent[]>([]);
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteTitle: 'VISAYASMED',
    siteDescription: 'Your Trusted Healthcare Partner',
    contactEmail: 'info@visayasmed.com',
    phoneNumber: '+63 (32) 123-4567',
    address: '123 Healthcare Ave, Cebu City, Philippines',
    socialLinks: {}
  });
  const [editingContent, setEditingContent] = useState<WebsiteContent | null>(null);
  const [newContent, setNewContent] = useState({
    section: 'home',
    title: '',
    content: '',
    imageUrl: ''
  });

  // Load data from localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem('websiteContent');
    if (savedContent) {
      try {
        setWebsiteContent(JSON.parse(savedContent));
      } catch (error) {
        console.error('Error loading website content:', error);
      }
    }

    const savedNavigation = localStorage.getItem('websiteNavigation');
    if (savedNavigation) {
      try {
        setNavigation(JSON.parse(savedNavigation));
      } catch (error) {
        console.error('Error loading navigation:', error);
      }
    }

    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      try {
        setSiteSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading site settings:', error);
      }
    }

    // Initialize with sample data if empty
    if (websiteContent.length === 0) {
      const sampleContent: WebsiteContent[] = [
        {
          id: 'home-hero',
          section: 'home',
          title: 'Welcome to VISAYASMED',
          content: 'Your trusted healthcare partner in the Visayas region. We provide comprehensive medical services with compassion and excellence.',
          order: 1,
          lastModified: new Date().toISOString(),
          modifiedBy: user?.email || 'admin'
        },
        {
          id: 'home-services',
          section: 'home',
          title: 'Our Services',
          content: 'We offer a wide range of medical services including emergency care, surgery, pediatrics, and more. Our team of experienced doctors and nurses are here to serve you.',
          order: 2,
          lastModified: new Date().toISOString(),
          modifiedBy: user?.email || 'admin'
        },
        {
          id: 'about-mission',
          section: 'about',
          title: 'Our Mission',
          content: 'To provide exceptional healthcare services to the communities we serve, with a focus on compassion, excellence, and innovation.',
          order: 1,
          lastModified: new Date().toISOString(),
          modifiedBy: user?.email || 'admin'
        }
      ];
      setWebsiteContent(sampleContent);
      localStorage.setItem('websiteContent', JSON.stringify(sampleContent));
    }

    if (navigation.length === 0) {
      const sampleNavigation: NavigationItem[] = [
        { id: 'nav-home', label: 'Home', href: '/', order: 1, isActive: true },
        { id: 'nav-about', label: 'About', href: '/about', order: 2, isActive: true },
        { id: 'nav-services', label: 'Services', href: '/services', order: 3, isActive: true },
        { id: 'nav-contact', label: 'Contact', href: '/contact', order: 4, isActive: true }
      ];
      setNavigation(sampleNavigation);
      localStorage.setItem('websiteNavigation', JSON.stringify(sampleNavigation));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
  }, [websiteContent]);

  useEffect(() => {
    localStorage.setItem('websiteNavigation', JSON.stringify(navigation));
  }, [navigation]);

  useEffect(() => {
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  const handleCreateContent = () => {
    if (!newContent.title || !newContent.content) {
      alert('Please fill in all required fields');
      return;
    }

    const content: WebsiteContent = {
      id: 'content_' + Date.now(),
      section: newContent.section,
      title: newContent.title,
      content: newContent.content,
      imageUrl: newContent.imageUrl,
      order: websiteContent.filter(c => c.section === newContent.section).length + 1,
      lastModified: new Date().toISOString(),
      modifiedBy: user?.email || 'admin'
    };

    setWebsiteContent([...websiteContent, content]);
    setNewContent({ section: 'home', title: '', content: '', imageUrl: '' });
    alert('Content created successfully!');
  };

  const handleUpdateContent = () => {
    if (!editingContent) return;

    const updatedContent = websiteContent.map(content =>
      content.id === editingContent.id
        ? {
            ...editingContent,
            lastModified: new Date().toISOString(),
            modifiedBy: user?.email || 'admin'
          }
        : content
    );

    setWebsiteContent(updatedContent);
    setEditingContent(null);
    alert('Content updated successfully!');
  };

  const handleDeleteContent = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      setWebsiteContent(websiteContent.filter(content => content.id !== id));
      alert('Content deleted successfully!');
    }
  };

  const handleUpdateNavigation = (id: string, updates: Partial<NavigationItem>) => {
    setNavigation(navigation.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const handleUpdateSettings = () => {
    setSiteSettings({
      ...siteSettings,
      lastModified: new Date().toISOString(),
      modifiedBy: user?.email || 'admin'
    } as any);
    alert('Settings updated successfully!');
  };

  const getContentBySection = (section: string) => {
    return websiteContent.filter(content => content.section === section).sort((a, b) => a.order - b.order);
  };

  const getStats = () => {
    const totalContent = websiteContent.length;
    const totalSections = [...new Set(websiteContent.map(c => c.section))].length;
    const activeNavigation = navigation.filter(n => n.isActive).length;
    const recentUpdates = websiteContent.filter(c => {
      const updateDate = new Date(c.lastModified);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return updateDate > weekAgo;
    }).length;

    return { totalContent, totalSections, activeNavigation, recentUpdates };
  };

  const stats = getStats();

  if (!userRoles?.isAdmin) {
    return (
      <div className="admin-portal-access-denied">
        <div className="access-denied-container">
          <h1>🔒 Admin Portal Access Required</h1>
          <p>You need administrator privileges to access the Admin Portal</p>
          <button onClick={() => window.location.href = '/'}>Return to Website</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-portal">
      {/* Background Effects */}
      <div className="bg-mesh"></div>
      <div className="bg-grid"></div>

      {/* Header */}
      <header className="admin-portal-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <div>
              <div className="brand">VISAYASMED</div>
              <div className="sub">Admin Portal</div>
            </div>
          </div>
          <div className="user-info">
            <span>Welcome, {user?.email?.split('@')[0]}</span>
            <span className="user-role">Administrator</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="admin-portal-content">
        {/* Sidebar */}
        <aside className="admin-portal-sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-btn ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              📝 Website Content
            </button>
            <button 
              className={`nav-btn ${activeTab === 'navigation' ? 'active' : ''}`}
              onClick={() => setActiveTab('navigation')}
            >
              🧭 Navigation
            </button>
            <button 
              className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Site Settings
            </button>
            <button 
              className={`nav-btn ${activeTab === 'media' ? 'active' : ''}`}
              onClick={() => setActiveTab('media')}
            >
              🖼️ Media Library
            </button>
            <button 
              className={`nav-btn ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              👁️ Preview Website
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-portal-main">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="page-content">
              <h1>Admin Dashboard</h1>
              <p>Manage your website content and settings</p>
              
              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-value">{stats.totalContent}</div>
                  <div className="stat-label">Total Content</div>
                </div>
                <div className="stat-card green">
                  <div className="stat-value">{stats.totalSections}</div>
                  <div className="stat-label">Sections</div>
                </div>
                <div className="stat-card orange">
                  <div className="stat-value">{stats.activeNavigation}</div>
                  <div className="stat-label">Active Navigation</div>
                </div>
                <div className="stat-card purple">
                  <div className="stat-value">{stats.recentUpdates}</div>
                  <div className="stat-label">Recent Updates</div>
                </div>
              </div>

              <div className="recent-activity">
                <h2>Recent Content Updates</h2>
                <div className="activity-list">
                  {websiteContent
                    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
                    .slice(0, 5)
                    .map(content => (
                      <div key={content.id} className="activity-item">
                        <div className="activity-info">
                          <span className="activity-title">{content.title}</span>
                          <span className="activity-meta">
                            {content.section} • {new Date(content.lastModified).toLocaleDateString()} • {content.modifiedBy}
                          </span>
                        </div>
                        <button 
                          className="action-btn"
                          onClick={() => setEditingContent(content)}
                        >
                          Edit
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Website Content */}
          {activeTab === 'content' && (
            <div className="page-content">
              <h1>Website Content</h1>
              <p>Manage your website content by section</p>
              
              {/* Create New Content */}
              <div className="form-card">
                <h2>Create New Content</h2>
                <div className="form-group">
                  <label>Section</label>
                  <select
                    value={newContent.section}
                    onChange={(e) => setNewContent({...newContent, section: e.target.value})}
                  >
                    <option value="home">Home</option>
                    <option value="about">About</option>
                    <option value="services">Services</option>
                    <option value="contact">Contact</option>
                    <option value="news">News</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Content title"
                    value={newContent.title}
                    onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    rows={6}
                    placeholder="Content body"
                    value={newContent.content}
                    onChange={(e) => setNewContent({...newContent, content: e.target.value})}
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label>Image URL (optional)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={newContent.imageUrl}
                    onChange={(e) => setNewContent({...newContent, imageUrl: e.target.value})}
                  />
                </div>
                
                <div className="form-actions">
                  <button className="btn-primary" onClick={handleCreateContent}>
                    Create Content
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={() => setNewContent({ section: 'home', title: '', content: '', imageUrl: '' })}
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Existing Content */}
              <div className="content-sections">
                {['home', 'about', 'services', 'contact', 'news'].map(section => (
                  <div key={section} className="section-content">
                    <h2>{section.charAt(0).toUpperCase() + section.slice(1)} Section</h2>
                    <div className="content-list">
                      {getContentBySection(section).map(content => (
                        <div key={content.id} className="content-item">
                          <div className="content-header">
                            <h3>{content.title}</h3>
                            <div className="content-actions">
                              <button 
                                className="action-btn"
                                onClick={() => setEditingContent(content)}
                              >
                                Edit
                              </button>
                              <button 
                                className="action-btn danger"
                                onClick={() => handleDeleteContent(content.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <p>{content.content.substring(0, 150)}...</p>
                          <div className="content-meta">
                            <small>
                              Last modified: {new Date(content.lastModified).toLocaleDateString()} • {content.modifiedBy}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          {activeTab === 'navigation' && (
            <div className="page-content">
              <h1>Navigation Management</h1>
              <p>Manage your website navigation menu</p>
              
              <div className="navigation-editor">
                <div className="form-card">
                  <h2>Navigation Items</h2>
                  <div className="navigation-list">
                    {navigation
                      .sort((a, b) => a.order - b.order)
                      .map((item, index) => (
                        <div key={item.id} className="navigation-item">
                          <div className="nav-controls">
                            <button 
                              className="order-btn"
                              onClick={() => {
                                if (index > 0) {
                                  const newNav = [...navigation];
                                  [newNav[index - 1], newNav[index]] = [newNav[index], newNav[index - 1]];
                                  setNavigation(newNav.map((n, i) => ({ ...n, order: i + 1 })));
                                }
                              }}
                              disabled={index === 0}
                            >
                              ↑
                            </button>
                            <button 
                              className="order-btn"
                              onClick={() => {
                                if (index < navigation.length - 1) {
                                  const newNav = [...navigation];
                                  [newNav[index], newNav[index + 1]] = [newNav[index + 1], newNav[index]];
                                  setNavigation(newNav.map((n, i) => ({ ...n, order: i + 1 })));
                                }
                              }}
                              disabled={index === navigation.length - 1}
                            >
                              ↓
                            </button>
                          </div>
                          
                          <div className="nav-details">
                            <div className="form-group">
                              <label>Label</label>
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => handleUpdateNavigation(item.id, { label: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>URL</label>
                              <input
                                type="text"
                                value={item.href}
                                onChange={(e) => handleUpdateNavigation(item.id, { href: e.target.value })}
                              />
                            </div>
                          </div>
                          
                          <div className="nav-toggle">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={item.isActive}
                                onChange={(e) => handleUpdateNavigation(item.id, { isActive: e.target.checked })}
                              />
                              <span className="slider"></span>
                            </label>
                            <span>Active</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Site Settings */}
          {activeTab === 'settings' && (
            <div className="page-content">
              <h1>Site Settings</h1>
              <p>Configure your website settings</p>
              
              <div className="form-card">
                <h2>General Settings</h2>
                <div className="form-group">
                  <label>Site Title</label>
                  <input
                    type="text"
                    value={siteSettings.siteTitle}
                    onChange={(e) => setSiteSettings({...siteSettings, siteTitle: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Site Description</label>
                  <textarea
                    rows={3}
                    value={siteSettings.siteDescription}
                    onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                  ></textarea>
                </div>
                
                <h3>Contact Information</h3>
                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    value={siteSettings.contactEmail}
                    onChange={(e) => setSiteSettings({...siteSettings, contactEmail: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={siteSettings.phoneNumber}
                    onChange={(e) => setSiteSettings({...siteSettings, phoneNumber: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    rows={2}
                    value={siteSettings.address}
                    onChange={(e) => setSiteSettings({...siteSettings, address: e.target.value})}
                  ></textarea>
                </div>
                
                <h3>Social Media Links</h3>
                <div className="form-group">
                  <label>Facebook</label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/yourpage"
                    value={siteSettings.socialLinks.facebook || ''}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings, 
                      socialLinks: {...siteSettings.socialLinks, facebook: e.target.value}
                    })}
                  />
                </div>
                
                <div className="form-group">
                  <label>Twitter</label>
                  <input
                    type="url"
                    placeholder="https://twitter.com/yourhandle"
                    value={siteSettings.socialLinks.twitter || ''}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings, 
                      socialLinks: {...siteSettings.socialLinks, twitter: e.target.value}
                    })}
                  />
                </div>
                
                <div className="form-actions">
                  <button className="btn-primary" onClick={handleUpdateSettings}>
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Media Library */}
          {activeTab === 'media' && (
            <div className="page-content">
              <h1>Media Library</h1>
              <p>Manage your website images and media files</p>
              
              <div className="media-library">
                <div className="form-card">
                  <h2>Upload New Media</h2>
                  <div className="upload-area">
                    <div className="upload-placeholder">
                      <span className="upload-icon">📁</span>
                      <p>Drag and drop images here or click to browse</p>
                      <button className="btn-secondary">Choose Files</button>
                    </div>
                  </div>
                </div>
                
                <div className="media-grid">
                  <div className="media-item">
                    <div className="media-preview">
                      <img src="https://via.placeholder.com/200x150/2f80ed/ffffff?text=Sample+Image" alt="Sample" />
                    </div>
                    <div className="media-info">
                      <h4>Sample Image</h4>
                      <p>200x150 • 25KB</p>
                      <div className="media-actions">
                        <button className="action-btn">Edit</button>
                        <button className="action-btn danger">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {activeTab === 'preview' && (
            <div className="page-content">
              <h1>Website Preview</h1>
              <p>See how your website looks with current changes</p>
              
              <div className="preview-container">
                <div className="preview-header">
                  <div className="preview-controls">
                    <button className="btn-primary">Open in New Tab</button>
                    <button className="btn-secondary">Mobile View</button>
                    <button className="btn-secondary">Tablet View</button>
                  </div>
                </div>
                
                <div className="preview-frame">
                  <div className="preview-website">
                    {/* This would show a preview of the actual website */}
                    <div className="preview-placeholder">
                      <span className="preview-icon">👁️</span>
                      <h3>Website Preview</h3>
                      <p>Your website preview will appear here</p>
                      <button className="btn-primary">Visit Live Site</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Modal */}
      {editingContent && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Content</h2>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={editingContent.title}
                onChange={(e) => setEditingContent({...editingContent, title: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Content</label>
              <textarea
                rows={8}
                value={editingContent.content}
                onChange={(e) => setEditingContent({...editingContent, content: e.target.value})}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={editingContent.imageUrl || ''}
                onChange={(e) => setEditingContent({...editingContent, imageUrl: e.target.value})}
              />
            </div>
            
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleUpdateContent}>
                Save Changes
              </button>
              <button className="btn-secondary" onClick={() => setEditingContent(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
