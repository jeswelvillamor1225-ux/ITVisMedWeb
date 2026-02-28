import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthFormsProps {
  onClose: () => void;
}

const AuthForms: React.FC<AuthFormsProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        // For demo purposes, we'll determine admin status based on email
        // In production, this should be controlled by existing admins
        const isAdmin = formData.email.includes('admin@') || formData.email.includes('manager@');
        
        await signUp(formData.email, formData.password, isAdmin);
        setSuccess('Account created successfully! You can now login.');
        setTimeout(() => {
          setIsLogin(true);
          setFormData({ email: '', password: '', confirmPassword: '' });
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', confirmPassword: '' });
    setError('');
    setSuccess('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal auth-modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <h2>{isLogin ? '🔐 Sign In' : '📝 Create Account'}</h2>
          <p>
            {isLogin 
              ? 'Access your VISMED IT Portal account' 
              : 'Register for a new VISMED IT Portal account'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              minLength={6}
            />
            {!isLogin && (
              <small>Password must be at least 6 characters long</small>
            )}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
          )}

          {error && (
            <div className="auth-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              <span className="success-icon">✅</span>
              {success}
            </div>
          )}

          {isLogin && (
            <div className="form-options">
              <label>
                <input type="checkbox" name="remember" />
                Remember me
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-auth-primary" 
            disabled={isLoading}
          >
            {isLoading 
              ? (isLogin ? 'Signing in...' : 'Creating account...') 
              : (isLogin ? '🔓 Sign In' : '🚀 Create Account')
            }
          </button>
        </form>

        <div className="auth-switch">
          <span>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button 
            type="button" 
            className="btn-link" 
            onClick={switchMode}
            disabled={isLoading}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        {!isLogin && (
          <div className="auth-info">
            <div className="info-card">
              <h4>📋 Account Types</h4>
              <ul>
                <li><strong>Standard User:</strong> Basic access to support tickets and basic features</li>
                <li><strong>Admin User:</strong> Use email with 'admin@' or 'manager@' for admin privileges</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForms;
