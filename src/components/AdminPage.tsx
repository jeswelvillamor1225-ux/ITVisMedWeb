import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminAuth from './AdminAuth';
import AdminDashboard from './AdminDashboard';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user, userRoles } = useAuth();

  // Check if user is already authenticated and has admin access
  React.useEffect(() => {
    if (user && userRoles?.isAdmin) {
      setIsAuthenticated(true);
    }
  }, [user, userRoles]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  // Redirect non-admin users
  if (user && !userRoles?.isAdmin) {
    return (
      <div className="admin-portal-body">
        <div className="bg-mesh"></div>
        <div className="bg-grid"></div>
        <div className="screen">
          <div className="auth-screen">
            <div className="auth-card">
              <div className="auth-error">
                Access Denied: You don't have administrative privileges to access this portal.
              </div>
              <button 
                className="auth-button"
                onClick={() => window.location.href = '/'}
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isAuthenticated ? (
        <AdminAuth onAuthSuccess={handleAuthSuccess} />
      ) : (
        <AdminDashboard />
      )}
    </>
  );
};

export default AdminPage;
