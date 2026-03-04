import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnnouncements } from '../contexts/AnnouncementContext';

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
  const { announcements } = useAnnouncements();
  const [activeTab, setActiveTab] = useState('announcements');
  const [photos, setPhotos] = useState<Photo[]>([]);

  // Load photos from localStorage
  React.useEffect(() => {
    const savedPhotos = localStorage.getItem('adminPhotos');
    if (savedPhotos) {
      try {
        setPhotos(JSON.parse(savedPhotos));
      } catch (error) {
        console.error('Error loading photos:', error);
      }
    }
  }, []);

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
              <h2>📣 Announcements</h2>
              <p>View all announcements created from the admin portal</p>
            </div>

            {/* Announcements Display */}
            <div className="card">
              <h3>Latest Announcements</h3>
              <div className="announcements-list">
                {announcements.length === 0 ? (
                  <p className="no-items">No announcements yet. Create announcements in the admin portal!</p>
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
              <h2>📸 Photo Gallery</h2>
              <p>View uploaded photos for your website</p>
            </div>

            {/* Photos Display */}
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
