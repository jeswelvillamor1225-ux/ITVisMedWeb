import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  title: string;
  description: string;
  date: string;
}

const DocumentaryAdmin: React.FC = () => {
  const { userRoles } = useAuth();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: '1',
      type: 'image',
      src: '/documentary/images/597298515_753483901094684_965509077331795814_n.jpg',
      title: 'IT Team Building Activity',
      description: 'Team collaboration and bonding session with IT department members.',
      date: 'Feb 2024'
    },
    {
      id: '2',
      type: 'image',
      src: '/documentary/images/597347948_844148291758249_9177582673195127349_n.jpg',
      title: 'Network Infrastructure Setup',
      description: 'Installation and configuration of network equipment for hospital connectivity.',
      date: 'Feb 2024'
    },
    {
      id: '3',
      type: 'image',
      src: '/documentary/images/597574865_704533305785195_571104752883722668_n.jpg',
      title: 'Server Room Maintenance',
      description: 'Regular maintenance and optimization of server infrastructure for reliable hospital operations.',
      date: 'Feb 2024'
    },
    {
      id: '4',
      type: 'image',
      src: '/documentary/images/623250975_1252442546461226_8152827667388661683_n.jpg',
      title: 'IT Training Session',
      description: 'Hands-on training for hospital staff on new IT systems and software applications.',
      date: 'Jan 2024'
    },
    {
      id: '5',
      type: 'image',
      src: '/documentary/images/626294003_1225316629199226_4450420096650389425_n.jpg',
      title: 'Hardware Installation',
      description: 'Installation of new computer systems and hardware for hospital departments.',
      date: 'Jan 2024'
    },
    {
      id: '6',
      type: 'image',
      src: '/documentary/images/626813723_942371032059848_1730026989541514522_n.jpg',
      title: 'IT Team Meeting',
      description: 'Strategic planning and coordination meeting for upcoming IT projects and initiatives.',
      date: 'Jan 2024'
    },
    {
      id: '7',
      type: 'image',
      src: '/documentary/images/633793754_1912322199644180_7651029901755374418_n.jpg',
      title: 'Network Cabling Project',
      description: 'Structured cabling installation for improved network performance and reliability.',
      date: 'Dec 2023'
    },
    {
      id: '8',
      type: 'image',
      src: '/documentary/images/639070623_2452489701835784_9109158539565139498_n.jpg',
      title: 'System Upgrade Implementation',
      description: 'Deployment of upgraded systems and software across hospital infrastructure.',
      date: 'Dec 2023'
    },
    {
      id: '9',
      type: 'image',
      src: '/documentary/images/639680657_1805399473457915_8713040372326012098_n.jpg',
      title: 'Help Desk Operations',
      description: 'Daily operations at IT help desk providing technical support to hospital staff.',
      date: 'Dec 2023'
    },
    {
      id: '10',
      type: 'image',
      src: '/documentary/images/640201768_1459667352418767_4366530700010272872_n.jpg',
      title: 'Equipment Testing & Validation',
      description: 'Testing and validation of IT equipment before deployment to hospital departments.',
      date: 'Nov 2023'
    },
    {
      id: '11',
      type: 'image',
      src: '/documentary/images/viber_image_2026-02-24_11-08-25-873.jpg',
      title: 'VISAYASMED IT Department Team',
      description: 'Complete team photo of VISAYASMED Hospital IT department members showcasing our dedicated team.',
      date: 'Feb 2024'
    },
    {
      id: '12',
      type: 'image',
      src: '/documentary/images/viber_image_2026-03-01_10-20-43-711.jpg',
      title: 'Project Planning Session',
      description: 'Documentation and planning session for ongoing IT projects and implementations.',
      date: 'Mar 2024'
    }
  ]);

  const handleUpdateItem = (id: string, field: 'title' | 'description', value: string) => {
    setGalleryItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('documentaryGalleryItems', JSON.stringify(galleryItems));
    alert('Documentary gallery updated successfully!');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(galleryItems, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'documentary-gallery.json';
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

  return (
    <div className="admin-portal-body">
      <div className="bg-mesh"></div>
      <div className="bg-grid"></div>
      
      <div className="screen">
        <div className="dashboard-header">
          <div className="dashboard-header-left">
            <h1>Documentary Gallery Manager</h1>
            <p>Update titles and descriptions for your documentary photos</p>
          </div>
          
          <div className="user-menu">
            <button onClick={handleSave} className="btn-primary">
              💾 Save Changes
            </button>
            <button onClick={handleExport} className="btn-secondary">
              📤 Export
            </button>
            <button onClick={() => window.location.href = '/admin-website'} className="btn-secondary">
              ← Back to Admin
            </button>
          </div>
        </div>

        <div className="documentary-admin-grid">
          {galleryItems.map((item) => (
            <div key={item.id} className="documentary-admin-item">
              <div className="image-preview">
                <img 
                  src={item.src} 
                  alt={item.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="image-error hidden">
                  <div className="error-icon">🖼️</div>
                  <span>Image not available</span>
                </div>
              </div>
              
              <div className="item-details">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                    className="form-textarea"
                    rows={3}
                  />
                </div>
                
                <div className="item-meta">
                  <span className="file-name">{item.src.split('/').pop()}</span>
                  <span className="date">{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentaryAdmin;
