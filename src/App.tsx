import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import VISMEDWebsite from './VISMEDWebsite';
import AuthForms from './components/AuthForms';
import UserDashboard from './components/UserDashboard';
import AdminPortal from './components/AdminPortal';
import ProtectedRoute from './components/ProtectedRoute';
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
      } else if (path === '/dashboard') {
        setCurrentPage('dashboard');
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
        return (
          <ProtectedRoute requireAdmin={true}>
            <AdminPortal />
          </ProtectedRoute>
        );
      case 'dashboard':
        return <UserDashboard />;
      default:
        return <VISMEDWebsite />;
    }
  };

  return (
    <AuthProvider>
      <div className="app">
        {renderPage()}
        {showAuthModal && (
          <AuthForms onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
