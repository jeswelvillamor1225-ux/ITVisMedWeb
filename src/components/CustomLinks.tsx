import React, { useState, useEffect } from 'react';

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

interface CustomLinksProps {
  category: 'hero' | 'services' | 'navigation' | 'footer';
  className?: string;
}

const CustomLinks: React.FC<CustomLinksProps> = ({ category, className = '' }) => {
  const [links, setLinks] = useState<CustomLink[]>([]);

  useEffect(() => {
    const loadLinks = () => {
      // Default links for immediate functionality
      const defaultLinks: CustomLink[] = [
        {
          id: 'default-local-server',
          title: 'Local Server',
          url: 'http://192.168.1.8/',
          description: 'Access local server resources',
          icon: '🖥️',
          category: category,
          order: 1,
          isActive: true
        },
        {
          id: 'default-hospital-portal',
          title: 'Hospital Portal',
          url: 'https://portal.visayasmed.com',
          description: 'Main hospital information system',
          icon: '🏥',
          category: category,
          order: 2,
          isActive: true
        },
        {
          id: 'default-email',
          title: 'Email System',
          url: 'https://mail.visayasmed.com',
          description: 'Staff email and communication',
          icon: '📧',
          category: category,
          order: 3,
          isActive: true
        },
        {
          id: 'default-documentation',
          title: 'IT Documentation',
          url: 'https://docs.visayasmed.com',
          description: 'Technical documentation and guides',
          icon: '📚',
          category: category,
          order: 4,
          isActive: true
        }
      ];

      const savedLinks = localStorage.getItem('customLinks');
      if (savedLinks) {
        try {
          const parsedLinks = JSON.parse(savedLinks);
          const activeLinks = parsedLinks
            .filter((link: CustomLink) => link.isActive && link.category === category)
            .sort((a: CustomLink, b: CustomLink) => a.order - b.order);
          
          // If no saved links for this category, use default
          if (activeLinks.length === 0) {
            setLinks(defaultLinks);
          } else {
            setLinks(activeLinks);
          }
        } catch (error) {
          console.error('Error loading custom links:', error);
          setLinks(defaultLinks);
        }
      } else {
        // No saved links, use default
        setLinks(defaultLinks);
      }
    };

    loadLinks();
  }, [category]);

  console.log(`CustomLinks - Category: ${category}, Links:`, links);

  if (links.length === 0) {
    return (
      <div className={`custom-links-container ${category}-links ${className}`} style={{padding: '10px', background: 'rgba(255,0,0,0.1)', border: '1px solid red'}}>
        <small>No links found for category: {category}</small>
      </div>
    );
  }

  const renderLink = (link: CustomLink) => {
    const baseClass = `custom-link ${category}-link`;
    
    if (category === 'hero') {
      return (
        <a 
          key={link.id}
          href={link.url}
          className={`${baseClass} btn-hero-primary`}
          target="_blank"
          rel="noopener noreferrer"
          title={link.description}
        >
          {link.icon && <span className="link-icon">{link.icon}</span>}
          <span className="link-text">{link.title}</span>
          <span className="link-arrow">→</span>
        </a>
      );
    }

    if (category === 'services') {
      return (
        <a 
          key={link.id}
          href={link.url}
          className={`${baseClass} svc-link`}
          target="_blank"
          rel="noopener noreferrer"
          title={link.description}
        >
          {link.icon && <span className="link-icon">{link.icon}</span>}
          <span className="link-text">{link.title}</span>
          <span className="link-arrow">→</span>
        </a>
      );
    }

    if (category === 'navigation') {
      return (
        <a 
          key={link.id}
          href={link.url}
          className={`${baseClass} nav-link`}
          target="_blank"
          rel="noopener noreferrer"
          title={link.description}
        >
          {link.icon && <span className="link-icon">{link.icon}</span>}
          <span className="link-text">{link.title}</span>
        </a>
      );
    }

    if (category === 'footer') {
      return (
        <a 
          key={link.id}
          href={link.url}
          className={`${baseClass} footer-link`}
          target="_blank"
          rel="noopener noreferrer"
          title={link.description}
        >
          {link.icon && <span className="link-icon">{link.icon}</span>}
          <span className="link-text">{link.title}</span>
        </a>
      );
    }

    return (
      <a 
        key={link.id}
        href={link.url}
        className={baseClass}
        target="_blank"
        rel="noopener noreferrer"
        title={link.description}
      >
        {link.icon && <span className="link-icon">{link.icon}</span>}
        <span className="link-text">{link.title}</span>
      </a>
    );
  };

  return (
    <div className={`custom-links-container ${category}-links ${className}`}>
      {links.map(renderLink)}
    </div>
  );
};

export default CustomLinks;
