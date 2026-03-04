import React, { useState, useEffect, useRef } from 'react';

interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  title: string;
  description: string;
  date: string;
}

const DocumentaryGallery: React.FC = () => {
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
      title: 'IT Department Team Photo',
      description: 'Complete team photo of VISAYASMED Hospital IT department members.',
      date: 'Feb 2024'
    },
    {
      id: '12',
      type: 'image',
      src: '/documentary/images/viber_image_2026-03-01_10-20-43-711.jpg',
      title: 'Project Documentation',
      description: 'Documentation and planning session for ongoing IT projects and implementations.',
      date: 'Mar 2024'
    },
    {
      id: '13',
      type: 'video',
      src: '/documentary/videos/server-room.mp4',
      title: 'Server Room Virtualization Tour',
      description: 'Video walkthrough of virtualized server infrastructure and data center operations.',
      date: 'Dec 2023'
    }
  ]);

  const [currentLightboxIndex, setCurrentLightboxIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openLightbox = (index: number) => {
    setCurrentLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setCurrentLightboxIndex(null);
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction: number) => {
    if (currentLightboxIndex === null) return;
    
    let newIndex = currentLightboxIndex + direction;
    if (newIndex < 0) newIndex = galleryItems.length - 1;
    if (newIndex >= galleryItems.length) newIndex = 0;
    
    setCurrentLightboxIndex(newIndex);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newItems: GalleryItem[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.size > 50 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum file size is 50MB.`);
        return;
      }
      
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';
      const fileURL = URL.createObjectURL(file);
      
      const newItem: GalleryItem = {
        id: Date.now().toString(),
        type: fileType,
        src: fileURL,
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: `Uploaded on ${new Date().toLocaleDateString()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };
      
      newItems.push(newItem);
    });
    
    setGalleryItems([...galleryItems, ...newItems]);
    alert(`Successfully uploaded ${newItems.length} file(s) to documentary gallery!`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentLightboxIndex === null) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentLightboxIndex, galleryItems]);

  return (
    <section className="section documentary" id="documentary">
      <div className="container">
        <div className="section-header fade-in">
          <div className="section-tag">Our Work</div>
          <h2>Documentary Gallery</h2>
          <p>Visual showcase of IT projects, infrastructure improvements, and team achievements at VISAYASMED Hospital.</p>
        </div>
        
        <div className="documentary-grid" id="galleryGrid">
          {galleryItems.map((item, index) => (
            <div 
              key={item.id}
              className="gallery-item fade-in"
              onClick={() => openLightbox(index)}
            >
              {item.type === 'image' ? (
                <img src={item.src} alt={item.title} className="gallery-media" />
              ) : (
                <>
                  <video src={item.src} className="gallery-media" muted />
                  <div className="video-overlay"></div>
                </>
              )}
              
              <div className="gallery-info">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <div className="gallery-meta">
                  <span className="gallery-type">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                  <span className="gallery-date">{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Upload Area */}
        <div 
          className={`upload-area fade-in ${isDragOver ? 'dragover' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📁</div>
          <div className="upload-text">
            <h4>Upload Your Work</h4>
            <p>Share your IT projects, achievements, and team activities. Supported formats: JPG, PNG, MP4, WebM (Max 50MB)</p>
            <button className="upload-button">Choose Files</button>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*,video/*" 
            multiple 
            style={{ display: 'none' }} 
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </div>
      </div>

      {/* Lightbox */}
      {currentLightboxIndex !== null && (
        <div className="lightbox-overlay active" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            <button className="lightbox-nav lightbox-prev" onClick={() => navigateLightbox(-1)}>‹</button>
            <button className="lightbox-nav lightbox-next" onClick={() => navigateLightbox(1)}>›</button>
            
            <div className="lightbox-media">
              {galleryItems[currentLightboxIndex].type === 'image' ? (
                <img 
                  src={galleryItems[currentLightboxIndex].src} 
                  alt={galleryItems[currentLightboxIndex].title} 
                />
              ) : (
                <video 
                  src={galleryItems[currentLightboxIndex].src} 
                  controls 
                  autoPlay
                >
                  <p>Your browser does not support the video tag.</p>
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DocumentaryGallery;
