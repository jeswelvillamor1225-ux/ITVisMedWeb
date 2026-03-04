import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AnnouncementProvider } from './contexts/AnnouncementContext';
import VISMEDWebsite from './VISMEDWebsite';
import AuthForms from './components/AuthForms';
import UserDashboard from './components/UserDashboard';
import AdminPage from './components/AdminPage';
import AdminTickets from './components/AdminTickets';
import AdminWebsite from './components/AdminWebsite';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Handle custom events for opening auth modal
    const handleOpenAuthModal = () => setShowAuthModal(true);
    window.addEventListener('openAuthModal', handleOpenAuthModal);

    // Handle routing based on URL path
    const handleRoute = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setCurrentPage('admin');
      } else if (path === '/tickets') {
        setCurrentPage('tickets');
      } else if (path === '/dashboard') {
        setCurrentPage('dashboard');
      } else if (path === '/admin-website') {
        setCurrentPage('admin-website');
      } else {
        setCurrentPage('home');
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);

    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
      window.removeEventListener('popstate', handleRoute);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'admin':
        return <AdminPage />;
      case 'tickets':
        return <AdminTickets />;
      case 'dashboard':
        return <UserDashboard />;
      case 'admin-website':
        return <AdminWebsite />;
      default:
        return <VISMEDWebsite />;
    }
  };

  return (
    <AuthProvider>
      <AnnouncementProvider>
        <div className="app">
          {renderPage()}
          {showAuthModal && (
            <AuthForms onClose={() => setShowAuthModal(false)} />
          )}
        </div>
      </AnnouncementProvider>
    </AuthProvider>
  );
}

export default App;
