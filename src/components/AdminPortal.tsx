import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UserModule {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface UserInfo {
  uid: string;
  email: string;
  roles: {
    isAdmin: boolean;
    modules: string[];
  };
}

const AdminPortal: React.FC = () => {
  const { user, userRoles, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);

  const availableModules: UserModule[] = [
    { id: 'admin', name: 'Admin Access', description: 'Full administrative privileges', icon: '👑' },
    { id: 'user-management', name: 'User Management', description: 'Manage user accounts and roles', icon: '👥' },
    { id: 'system-settings', name: 'System Settings', description: 'Configure system parameters', icon: '⚙️' },
    { id: 'reports', name: 'Reports', description: 'View and generate reports', icon: '📊' },
    { id: 'basic', name: 'Basic Access', description: 'Basic system access', icon: '🔐' },
    { id: 'support', name: 'Support', description: 'Submit and manage support tickets', icon: '🎫' },
    { id: 'billing', name: 'Billing', description: 'Access billing and invoicing', icon: '💰' },
    { id: 'inventory', name: 'Inventory', description: 'Manage inventory and assets', icon: '📦' },
    { id: 'analytics', name: 'Analytics', description: 'View analytics and insights', icon: '📈' },
  ];

  const loadUsers = () => {
    // Mock user data - in production, this would come from your database
    const mockUsers: UserInfo[] = [
      {
        uid: 'user1',
        email: 'staff@visayasmed.com.ph',
        roles: {
          isAdmin: false,
          modules: ['basic', 'support']
        }
      },
      {
        uid: 'user2',
        email: 'manager@visayasmed.com.ph',
        roles: {
          isAdmin: false,
          modules: ['basic', 'support', 'reports', 'billing']
        }
      }
    ];
    setUsers(mockUsers);
  };

  React.useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  const handleModuleToggle = (moduleId: string) => {
    if (!selectedUser) return;
    
    const updatedModules = selectedUser.roles.modules.includes(moduleId)
      ? selectedUser.roles.modules.filter(m => m !== moduleId)
      : [...selectedUser.roles.modules, moduleId];

    const updatedUser = {
      ...selectedUser,
      roles: {
        ...selectedUser.roles,
        modules: updatedModules
      }
    };

    setSelectedUser(updatedUser);
    setUsers(users.map(u => u.uid === updatedUser.uid ? updatedUser : u));
    
    // Save to localStorage (in production, save to database)
    localStorage.setItem(`userRoles_${updatedUser.uid}`, JSON.stringify(updatedUser.roles));
  };

  const handleAdminToggle = () => {
    if (!selectedUser) return;
    
    const updatedUser = {
      ...selectedUser,
      roles: {
        ...selectedUser.roles,
        isAdmin: !selectedUser.roles.isAdmin,
        modules: !selectedUser.roles.isAdmin 
          ? ['admin', 'user-management', 'system-settings', 'reports', 'basic', 'support']
          : selectedUser.roles.modules.filter(m => !['admin', 'user-management', 'system-settings'].includes(m))
      }
    };

    setSelectedUser(updatedUser);
    setUsers(users.map(u => u.uid === updatedUser.uid ? updatedUser : u));
    
    // Save to localStorage (in production, save to database)
    localStorage.setItem(`userRoles_${updatedUser.uid}`, JSON.stringify(updatedUser.roles));
  };

  if (!user || !userRoles?.isAdmin) {
    return (
      <div className="admin-access-denied">
        <div className="access-denied-content">
          <div className="access-denied-icon">🚫</div>
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin portal.</p>
          <button onClick={() => window.history.back()} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-portal">
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>🛡️ Admin Portal</h1>
          <span>Welcome, {user.email}</span>
        </div>
        <div className="admin-header-right">
          <button onClick={logout} className="btn-logout">
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 User Management
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ System Settings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📈 Reports
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-section">
            <h2>System Overview</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-icon">👥</div>
                <h3>Total Users</h3>
                <p className="card-number">{users.length + 1}</p>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">🔐</div>
                <h3>Active Sessions</h3>
                <p className="card-number">12</p>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">🎫</div>
                <h3>Support Tickets</h3>
                <p className="card-number">8</p>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">📊</div>
                <h3>System Health</h3>
                <p className="card-number">98%</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="user-management-section">
            <h2>User Management</h2>
            <div className="user-management-grid">
              <div className="users-list">
                <h3>Users</h3>
                <div className="user-cards">
                  {users.map((userInfo) => (
                    <div 
                      key={userInfo.uid}
                      className={`user-card ${selectedUser?.uid === userInfo.uid ? 'selected' : ''}`}
                      onClick={() => setSelectedUser(userInfo)}
                    >
                      <div className="user-info">
                        <strong>{userInfo.email}</strong>
                        <span className="user-role">
                          {userInfo.roles.isAdmin ? '👑 Admin' : '👤 User'}
                        </span>
                      </div>
                      <div className="user-modules">
                        {userInfo.roles.modules.length} modules
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedUser && (
                <div className="user-permissions">
                  <h3>Permissions for {selectedUser.email}</h3>
                  
                  <div className="permission-section">
                    <label className="admin-toggle">
                      <input
                        type="checkbox"
                        checked={selectedUser.roles.isAdmin}
                        onChange={handleAdminToggle}
                      />
                      <span>Administrator Access</span>
                    </label>
                  </div>

                  <div className="permission-section">
                    <h4>Module Access</h4>
                    <div className="modules-grid">
                      {availableModules.map((module) => (
                        <label key={module.id} className="module-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedUser.roles.modules.includes(module.id)}
                            onChange={() => handleModuleToggle(module.id)}
                            disabled={selectedUser.roles.isAdmin && ['admin', 'user-management', 'system-settings'].includes(module.id)}
                          />
                          <div className="module-info">
                            <span className="module-icon">{module.icon}</span>
                            <div>
                              <strong>{module.name}</strong>
                              <p>{module.description}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="permission-actions">
                    <button className="btn-primary">
                      💾 Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h2>System Settings</h2>
            <div className="settings-grid">
              <div className="setting-card">
                <h3>🔐 Security Settings</h3>
                <p>Configure password policies, session timeouts, and security protocols.</p>
                <button className="btn-outline">Configure</button>
              </div>
              <div className="setting-card">
                <h3>📧 Email Configuration</h3>
                <p>Set up email servers and notification templates.</p>
                <button className="btn-outline">Configure</button>
              </div>
              <div className="setting-card">
                <h3>🔄 Backup Settings</h3>
                <p>Configure automated backup schedules and retention policies.</p>
                <button className="btn-outline">Configure</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-section">
            <h2>System Reports</h2>
            <div className="reports-grid">
              <div className="report-card">
                <h3>📊 User Activity Report</h3>
                <p>View user login patterns and activity logs.</p>
                <button className="btn-outline">Generate Report</button>
              </div>
              <div className="report-card">
                <h3>🎫 Support Ticket Analytics</h3>
                <p>Analyze support ticket trends and resolution times.</p>
                <button className="btn-outline">Generate Report</button>
              </div>
              <div className="report-card">
                <h3>🔒 Security Audit Log</h3>
                <p>Review security events and access attempts.</p>
                <button className="btn-outline">Generate Report</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
