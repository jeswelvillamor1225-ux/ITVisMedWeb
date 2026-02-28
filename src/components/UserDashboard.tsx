import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';

const UserDashboard: React.FC = () => {
  const { user, userRoles, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const availableModules = [
    { id: 'basic', name: 'Overview', icon: '📊', description: 'Dashboard overview' },
    { id: 'support', name: 'Support Tickets', icon: '🎫', description: 'Submit and track support requests' },
    { id: 'billing', name: 'Billing', icon: '💰', description: 'View billing information' },
    { id: 'inventory', name: 'Inventory', icon: '📦', description: 'View inventory and assets' },
    { id: 'analytics', name: 'Analytics', icon: '📈', description: 'View analytics and reports' },
    { id: 'reports', name: 'Reports', icon: '📋', description: 'Generate and view reports' },
  ];

  const userModules = availableModules.filter(module => 
    userRoles?.modules.includes(module.id)
  );

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <h1>🏥 VISMED IT Portal</h1>
          <span>Welcome, {user?.email}</span>
        </div>
        <div className="dashboard-header-right">
          <button 
            onClick={() => window.location.href = '/admin'}
            className="btn-outline"
            style={{ display: userRoles?.isAdmin ? 'block' : 'none' }}
          >
            👑 Admin Portal
          </button>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        {userModules.map((module) => (
          <button 
            key={module.id}
            className={`tab-btn ${activeTab === module.id ? 'active' : ''}`}
            onClick={() => setActiveTab(module.id)}
          >
            {module.icon} {module.name}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>📊 Dashboard Overview</h2>
            <div className="overview-grid">
              <div className="overview-card">
                <div className="card-icon">🎫</div>
                <h3>My Tickets</h3>
                <p className="card-number">3</p>
                <span className="card-status">2 open, 1 resolved</span>
              </div>
              <div className="overview-card">
                <div className="card-icon">💻</div>
                <h3>Assigned Devices</h3>
                <p className="card-number">2</p>
                <span className="card-status">Laptop, Desktop</span>
              </div>
              <div className="overview-card">
                <div className="card-icon">📅</div>
                <h3>Pending Requests</h3>
                <p className="card-number">1</p>
                <span className="card-status">Software installation</span>
              </div>
              <div className="overview-card">
                <div className="card-icon">🔔</div>
                <h3>Notifications</h3>
                <p className="card-number">5</p>
                <span className="card-status">2 unread</span>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">🎫</span>
                  <div className="activity-content">
                    <strong>Ticket #1234</strong> - Printer not working
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">✅</span>
                  <div className="activity-content">
                    <strong>Ticket #1232</strong> - Software installation completed
                    <span className="activity-time">1 day ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">💻</span>
                  <div className="activity-content">
                    <strong>Device assigned</strong> - New laptop configured
                    <span className="activity-time">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <ProtectedRoute requiredModule="support">
            <div className="support-section">
              <h2>🎫 Support Tickets</h2>
              <div className="support-actions">
                <button className="btn-primary">
                  ➕ Create New Ticket
                </button>
              </div>
              
              <div className="tickets-list">
                <div className="ticket-card open">
                  <div className="ticket-header">
                    <span className="ticket-id">#1234</span>
                    <span className="ticket-status open">Open</span>
                  </div>
                  <h4>Printer not working in ER</h4>
                  <p>The main printer in the emergency room is not responding to print jobs.</p>
                  <div className="ticket-meta">
                    <span>Created: 2 hours ago</span>
                    <span>Priority: High</span>
                  </div>
                </div>

                <div className="ticket-card open">
                  <div className="ticket-header">
                    <span className="ticket-id">#1233</span>
                    <span className="ticket-status open">Open</span>
                  </div>
                  <h4>Cannot access HIS system</h4>
                  <p>Unable to login to the Hospital Information System from my workstation.</p>
                  <div className="ticket-meta">
                    <span>Created: 1 day ago</span>
                    <span>Priority: Medium</span>
                  </div>
                </div>

                <div className="ticket-card resolved">
                  <div className="ticket-header">
                    <span className="ticket-id">#1232</span>
                    <span className="ticket-status resolved">Resolved</span>
                  </div>
                  <h4>Software installation request</h4>
                  <p>Need Microsoft Office installed on new workstation.</p>
                  <div className="ticket-meta">
                    <span>Resolved: 1 day ago</span>
                    <span>Priority: Low</span>
                  </div>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        )}

        {activeTab === 'billing' && (
          <ProtectedRoute requiredModule="billing">
            <div className="billing-section">
              <h2>💰 Billing Information</h2>
              <div className="billing-summary">
                <div className="billing-card">
                  <h3>Current Month</h3>
                  <p className="amount">₱0.00</p>
                  <span>No charges this month</span>
                </div>
                <div className="billing-card">
                  <h3>Outstanding Balance</h3>
                  <p className="amount">₱0.00</p>
                  <span>All payments up to date</span>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        )}

        {activeTab === 'inventory' && (
          <ProtectedRoute requiredModule="inventory">
            <div className="inventory-section">
              <h2>📦 My Inventory</h2>
              <div className="inventory-list">
                <div className="inventory-item">
                  <div className="item-icon">💻</div>
                  <div className="item-details">
                    <h4>Dell Laptop - LAT-001</h4>
                    <p>Assigned: Jan 15, 2026</p>
                    <span className="item-status good">Good Condition</span>
                  </div>
                </div>
                <div className="inventory-item">
                  <div className="item-icon">🖥️</div>
                  <div className="item-details">
                    <h4>HP Desktop - DESK-045</h4>
                    <p>Assigned: Dec 1, 2025</p>
                    <span className="item-status good">Good Condition</span>
                  </div>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        )}

        {activeTab === 'analytics' && (
          <ProtectedRoute requiredModule="analytics">
            <div className="analytics-section">
              <h2>📈 Analytics</h2>
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Ticket Trends</h3>
                  <div className="chart-placeholder">
                    📊 Chart showing ticket submission trends
                  </div>
                </div>
                <div className="analytics-card">
                  <h3>Response Times</h3>
                  <div className="chart-placeholder">
                    📈 Chart showing average response times
                  </div>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        )}

        {activeTab === 'reports' && (
          <ProtectedRoute requiredModule="reports">
            <div className="reports-section">
              <h2>📋 Reports</h2>
              <div className="reports-grid">
                <div className="report-card">
                  <h3>My Support History</h3>
                  <p>Download your complete support ticket history.</p>
                  <button className="btn-outline">Download Report</button>
                </div>
                <div className="report-card">
                  <h3>Inventory Summary</h3>
                  <p>View summary of all assigned devices.</p>
                  <button className="btn-outline">Generate Report</button>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
