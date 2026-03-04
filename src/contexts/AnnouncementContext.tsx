import React, { createContext, useContext, useState, useEffect } from 'react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'high' | 'urgent';
  date: string;
  author: string;
}

interface AnnouncementContextType {
  announcements: Announcement[];
  addAnnouncement: (announcement: Announcement) => void;
  deleteAnnouncement: (id: string) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncements must be used within AnnouncementProvider');
  }
  return context;
};

export const AnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Load announcements from localStorage on mount
  useEffect(() => {
    const savedAnnouncements = localStorage.getItem('announcements');
    if (savedAnnouncements) {
      try {
        const parsed = JSON.parse(savedAnnouncements);
        setAnnouncements(parsed);
      } catch (error) {
        console.error('Error loading announcements:', error);
      }
    }
  }, []);

  // Save announcements to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('announcements', JSON.stringify(announcements));
  }, [announcements]);

  const addAnnouncement = (announcement: Announcement) => {
    const newAnnouncement = {
      ...announcement,
      id: 'ann_' + Date.now(),
      date: announcement.date || new Date().toISOString().split('T')[0],
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncements(prev => 
      prev.map(ann => 
        ann.id === id ? { ...ann, ...updates } : ann
      )
    );
  };

  return (
    <AnnouncementContext.Provider value={{
      announcements,
      addAnnouncement,
      deleteAnnouncement,
      updateAnnouncement
    }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export default AnnouncementContext;
