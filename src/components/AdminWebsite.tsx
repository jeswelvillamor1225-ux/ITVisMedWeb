import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'high' | 'urgent';
  date: string;
  author: string;
}

interface Photo {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  date: string;
}

const AdminWebsite: React.FC = () => {
  const { user, userRoles } = useAuth();
  const [activeTab, setActiveTab] = useState('announcements');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'normal' as const
  });
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    description: '',
    category: 'general',
    url: ''
  });

  // Load existing data
  useEffect(() => {
    // Load announcements from localStorage
    const savedAnnouncements = localStorage.getItem('adminAnnouncements');
    if (savedAnnouncements) {
      setAnnouncements(JSON.parse(savedAnnouncements));
    }

    // Load photos from localStorage
    const savedPhotos = localStorage.getItem('adminPhotos');
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert('Please fill in all fields');
      return;
    }

    const announcement: Announcement = {
      id: 'ann_' + Date.now(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      priority: newAnnouncement.priority,
      date: new Date().toISOString().split('T')[0],
      author: user?.email || 'Admin'
    };

    const updatedAnnouncements = [announcement, ...announcements];
    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('adminAnnouncements', JSON.stringify(updatedAnnouncements));

    // Reset form
    setNewAnnouncement({ title: '', content: '', priority: 'normal' });
    alert('Announcement created successfully!');
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updatedAnnouncements = announcements.filter(ann => ann.id !== id);
    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('adminAnnouncements', JSON.stringify(updatedAnnouncements));
  };

  const handleUploadPhoto = () => {
    if (!newPhoto.title || !newPhoto.description || !newPhoto.url) {
      alert('Please fill in all fields');
      return;
    }

    const photo: Photo = {
      id: 'photo_' + Date.now(),
      title: newPhoto.title,
      description: newPhoto.description,
      url: newPhoto.url,
      category: newPhoto.category,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedPhotos = [photo, ...photos];
    setPhotos(updatedPhotos);
    localStorage.setItem('adminPhotos', JSON.stringify(updatedPhotos));

    // Reset form
    setNewPhoto({ title: '', description: '', category: 'general', url: '' });
    alert('Photo uploaded successfully!');
  };

  const handleDeletePhoto = (id: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== id);
    setPhotos(updatedPhotos);
    localStorage.setItem('adminPhotos', JSON.stringify(updatedPhotos));
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

  return (
    <div className="admin-website">
      {/* Background Effects */}
      <div className="bg-mesh"></div>
      <div className="bg-grid"></div>

      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <div>
              <div className="brand">VISAYASMED</div>
              <div className="sub">Admin Website</div>
            </div>
          </div>
          <div className="user-info">
            <span>Welcome, {user?.email?.split('@')[0]}</span>
            <button className="logout-btn" onClick={() => window.location.href = '/'}>Logout</button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <button 
          className={`nav-btn ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          📣 Announcements
        </button>
        <button 
          className={`nav-btn ${activeTab === 'photos' ? 'active' : ''}`}
          onClick={() => setActiveTab('photos')}
        >
          📸 Photo Gallery
        </button>
        <button 
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>📣 Manage Announcements</h2>
              <p>Create and manage announcements for your website</p>
            </div>

            {/* Create Announcement Form */}
            <div className="card">
              <h3>Create New Announcement</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    placeholder="Enter announcement title"
                  />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value as any})}
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  rows={4}
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  placeholder="Enter announcement content"
                />
              </div>
              <button className="btn-primary" onClick={handleCreateAnnouncement}>
                📣 Create Announcement
              </button>
            </div>

            {/* Existing Announcements */}
            <div className="card">
              <h3>Existing Announcements</h3>
              <div className="announcements-list">
                {announcements.length === 0 ? (
                  <p className="no-items">No announcements yet</p>
                ) : (
                  announcements.map((announcement) => (
                    <div key={announcement.id} className="announcement-item">
                      <div className="announcement-header">
                        <h4>{announcement.title}</h4>
                        <div className="announcement-meta">
                          <span className={`priority-badge ${announcement.priority}`}>
                            {announcement.priority.toUpperCase()}
                          </span>
                          <span className="date">{announcement.date}</span>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <p>{announcement.content}</p>
                      <div className="announcement-footer">
                        <small>By {announcement.author}</small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>📸 Photo Gallery Management</h2>
              <p>Upload and manage photos for your website</p>
            </div>

            {/* Upload Photo Form */}
            <div className="card">
              <h3>Upload New Photo</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newPhoto.title}
                    onChange={(e) => setNewPhoto({...newPhoto, title: e.target.value})}
                    placeholder="Enter photo title"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newPhoto.category}
                    onChange={(e) => setNewPhoto({...newPhoto, category: e.target.value})}
                  >
                    <option value="general">General</option>
                    <option value="events">Events</option>
                    <option value="facilities">Facilities</option>
                    <option value="staff">Staff</option>
                    <option value="services">Services</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={newPhoto.description}
                  onChange={(e) => setNewPhoto({...newPhoto, description: e.target.value})}
                  placeholder="Enter photo description"
                />
              </div>
              <div className="form-group">
                <label>Photo URL</label>
                <input
                  type="url"
                  value={newPhoto.url}
                  onChange={(e) => setNewPhoto({...newPhoto, url: e.target.value})}
                  placeholder="Enter photo URL (e.g., https://example.com/photo.jpg)"
                />
              </div>
              <button className="btn-primary" onClick={handleUploadPhoto}>
                📸 Upload Photo
              </button>
            </div>

            {/* Existing Photos */}
            <div className="card">
              <h3>Photo Gallery</h3>
              <div className="photos-grid">
                {photos.length === 0 ? (
                  <p className="no-items">No photos uploaded yet</p>
                ) : (
                  photos.map((photo) => (
                    <div key={photo.id} className="photo-item">
                      <div className="photo-card">
                        <div className="photo-image">
                          {photo.url ? (
                            <img src={photo.url} alt={photo.title} />
                          ) : (
                            <div className="photo-placeholder">📸</div>
                          )}
                        </div>
                        <div className="photo-info">
                          <h4>{photo.title}</h4>
                          <p>{photo.description}</p>
                          <div className="photo-meta">
                            <span className="category-badge">{photo.category}</span>
                            <span className="date">{photo.date}</span>
                          </div>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeletePhoto(photo.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>⚙️ Settings</h2>
              <p>Configure your admin website</p>
            </div>

            <div className="card">
              <h3>Website Settings</h3>
              <div className="form-group">
                <label>Website Title</label>
                <input type="text" defaultValue="VISAYASMED" />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" defaultValue="info@visayasmed.com" />
              </div>
              <div className="form-group">
                <label>Theme Color</label>
                <select defaultValue="blue">
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                </select>
              </div>
              <button className="btn-primary">Save Settings</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminWebsite;
