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
    const savedLinks = localStorage.getItem('customLinks');
    if (savedLinks) {
      try {
        const parsedLinks = JSON.parse(savedLinks);
        const activeLinks = parsedLinks
          .filter((link: CustomLink) => link.isActive && link.category === category)
          .sort((a: CustomLink, b: CustomLink) => a.order - b.order);
        setLinks(activeLinks);
      } catch (error) {
        console.error('Error loading custom links:', error);
      }
    }
  }, [category]);

  if (links.length === 0) {
    return null;
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
        >
          {link.icon && <span>{link.icon}</span>}
          {link.title}
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
        >
          {link.title} →
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
        >
          {link.icon && <span>{link.icon}</span>}
          {link.title}
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
        >
          {link.icon && <span>{link.icon}</span>}
          {link.title}
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
      >
        {link.icon && <span>{link.icon}</span>}
        {link.title}
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
