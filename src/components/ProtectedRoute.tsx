import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredModule?: string;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredModule, 
  requireAdmin = false,
  fallback 
}) => {
  const { user, userRoles, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">⏳</div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="access-denied">
        <div className="access-denied-content">
          <div className="access-denied-icon">🔐</div>
          <h2>Authentication Required</h2>
          <p>Please sign in to access this page.</p>
          <button 
            onClick={() => {
              const event = new CustomEvent('openAuthModal');
              window.dispatchEvent(event);
            }} 
            className="btn-primary"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (requireAdmin && !userRoles?.isAdmin) {
    return fallback || (
      <div className="access-denied">
        <div className="access-denied-content">
          <div className="access-denied-icon">🚫</div>
          <h2>Admin Access Required</h2>
          <p>You don't have permission to access this page.</p>
          <button onClick={() => window.history.back()} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (requiredModule && !userRoles?.modules.includes(requiredModule)) {
    return fallback || (
      <div className="access-denied">
        <div className="access-denied-content">
          <div className="access-denied-icon">🔒</div>
          <h2>Module Access Required</h2>
          <p>You don't have permission to access this module.</p>
          <p>Contact your administrator for access.</p>
          <button onClick={() => window.history.back()} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
