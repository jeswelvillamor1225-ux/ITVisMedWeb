import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface CustomLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  category: 'hero' | 'services' | 'navigation' | 'footer';
  order: number;
  isActive: boolean;
}

const LinksManager: React.FC = () => {
  const { userRoles } = useAuth();
  const [links, setLinks] = useState<CustomLink[]>([
    {
      id: '1',
      title: 'Hospital Portal',
      url: 'https://portal.visayasmed.com',
      description: 'Access hospital systems and applications',
      icon: '🏥',
      category: 'hero',
      order: 1,
      isActive: true
    },
    {
      id: '2',
      title: 'Email System',
      url: 'https://mail.visayasmed.com',
      description: 'Staff email and communication',
      icon: '📧',
      category: 'services',
      order: 2,
      isActive: true
    },
    {
      id: '3',
      title: 'IT Documentation',
      url: 'https://docs.visayasmed.com',
      description: 'Technical documentation and guides',
      icon: '📚',
      category: 'services',
      order: 3,
      isActive: true
    }
  ]);

  const [newLink, setNewLink] = useState<Partial<CustomLink>>({
    title: '',
    url: '',
    description: '',
    icon: '🔗',
    category: 'hero',
    order: 1,
    isActive: true
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const savedLinks = localStorage.getItem('customLinks');
    if (savedLinks) {
      try {
        setLinks(JSON.parse(savedLinks));
      } catch (error) {
        console.error('Error loading links:', error);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('customLinks', JSON.stringify(links));
    alert('Links saved successfully!');
  };

  const handleAddLink = () => {
    if (!newLink.title || !newLink.url) {
      alert('Please fill in title and URL');
      return;
    }

    const link: CustomLink = {
      id: Date.now().toString(),
      title: newLink.title || '',
      url: newLink.url || '',
      description: newLink.description || '',
      icon: newLink.icon || '🔗',
      category: newLink.category as CustomLink['category'] || 'hero',
      order: links.length + 1,
      isActive: newLink.isActive !== false
    };

    setLinks([...links, link]);
    setNewLink({
      title: '',
      url: '',
      description: '',
      icon: '🔗',
      category: 'hero',
      order: links.length + 2,
      isActive: true
    });
  };

  const handleUpdateLink = (id: string, field: keyof CustomLink, value: any) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const handleDeleteLink = (id: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      setLinks(prev => prev.filter(link => link.id !== id));
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(links, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'custom-links.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!userRoles?.isAdmin) {
    return (
      <div className="admin-access-denied">
        <h1>Access Denied</h1>
        <p>You need administrator privileges to access this page.</p>
        <button onClick={() => window.location.href = '/'}>Return to Home</button>
      </div>
    );
  }

  const activeLinks = links.filter(link => link.isActive);
  const heroLinks = activeLinks.filter(link => link.category === 'hero');
  const servicesLinks = activeLinks.filter(link => link.category === 'services');

  return (
    <div className="admin-portal-body">
      <div className="bg-mesh"></div>
      <div className="bg-grid"></div>
      
      <div className="screen">
        <div className="dashboard-header">
          <div className="dashboard-header-left">
            <h1>🔗 Links Manager</h1>
            <p>Manage custom links and buttons for your website</p>
          </div>
          
          <div className="user-menu">
            <button onClick={handleSave} className="btn-primary">
              💾 Save Links
            </button>
            <button onClick={handleExport} className="btn-secondary">
              📤 Export
            </button>
            <button onClick={() => window.location.href = '/admin-website'} className="btn-secondary">
              ← Back to Admin
            </button>
          </div>
        </div>

        {/* Preview Sections */}
        <div className="links-preview">
          <h2>📱 Preview</h2>
          
          <div className="preview-section">
            <h3>Hero Section Links</h3>
            <div className="preview-buttons">
              {heroLinks.map(link => (
                <a key={link.id} href={link.url} className="btn-hero-primary" target="_blank" rel="noopener noreferrer">
                  {link.icon} {link.title}
                </a>
              ))}
            </div>
          </div>

          <div className="preview-section">
            <h3>Services Section Links</h3>
            <div className="preview-buttons">
              {servicesLinks.map(link => (
                <a key={link.id} href={link.url} className="svc-link" target="_blank" rel="noopener noreferrer">
                  {link.title} →
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Add New Link */}
        <div className="add-link-section">
          <h2>➕ Add New Link</h2>
          <div className="link-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                  placeholder="Link title"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>URL *</label>
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                  placeholder="https://example.com"
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={newLink.description}
                  onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                  placeholder="Brief description"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Icon</label>
                <input
                  type="text"
                  value={newLink.icon}
                  onChange={(e) => setNewLink({...newLink, icon: e.target.value})}
                  placeholder="🔗"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newLink.category}
                  onChange={(e) => setNewLink({...newLink, category: e.target.value as CustomLink['category']})}
                  className="form-input"
                >
                  <option value="hero">Hero Section</option>
                  <option value="services">Services Section</option>
                  <option value="navigation">Navigation</option>
                  <option value="footer">Footer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newLink.isActive !== false}
                    onChange={(e) => setNewLink({...newLink, isActive: e.target.checked})}
                  />
                  Active
                </label>
              </div>
            </div>

            <button onClick={handleAddLink} className="btn-primary">
              ➕ Add Link
            </button>
          </div>
        </div>

        {/* Existing Links */}
        <div className="links-list">
          <h2>📋 Manage Links</h2>
          <div className="links-grid">
            {links.map(link => (
              <div key={link.id} className="link-card">
                <div className="link-header">
                  <div className="link-info">
                    <span className="link-icon">{link.icon}</span>
                    <span className="link-title">{link.title}</span>
                  </div>
                  <div className="link-actions">
                    <button 
                      onClick={() => setEditingId(editingId === link.id ? null : link.id)}
                      className="btn-edit"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteLink(link.id)}
                      className="btn-delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                {editingId === link.id ? (
                  <div className="link-edit-form">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => handleUpdateLink(link.id, 'title', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>URL</label>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <input
                        type="text"
                        value={link.description}
                        onChange={(e) => handleUpdateLink(link.id, 'description', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Icon</label>
                        <input
                          type="text"
                          value={link.icon}
                          onChange={(e) => handleUpdateLink(link.id, 'icon', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <select
                          value={link.category}
                          onChange={(e) => handleUpdateLink(link.id, 'category', e.target.value)}
                          className="form-input"
                        >
                          <option value="hero">Hero Section</option>
                          <option value="services">Services Section</option>
                          <option value="navigation">Navigation</option>
                          <option value="footer">Footer</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={link.isActive}
                          onChange={(e) => handleUpdateLink(link.id, 'isActive', e.target.checked)}
                        />
                        Active
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="link-details">
                    <p className="link-url">{link.url}</p>
                    {link.description && <p className="link-description">{link.description}</p>}
                    <div className="link-meta">
                      <span className="link-category">{link.category}</span>
                      <span className={`link-status ${link.isActive ? 'active' : 'inactive'}`}>
                        {link.isActive ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinksManager;
