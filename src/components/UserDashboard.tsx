import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnnouncements } from '../contexts/AnnouncementContext';

const UserDashboard: React.FC = () => {
  const { user, userRoles, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for dashboard
  const [stats, setStats] = useState({
    openTickets: 0,
    resolved: 0,
    pending: 0,
    totalUsers: 0
  });

  const [recentTickets] = useState([
    { id: '#1234', subject: 'Printer not working in ER', priority: 'High', status: 'Open', date: '2 hours ago' },
    { id: '#1233', subject: 'Cannot access HIS system', priority: 'Medium', status: 'Open', date: '1 day ago' },
    { id: '#1232', subject: 'Software installation request', priority: 'Low', status: 'Resolved', date: '1 day ago' }
  ]);

  const { announcements, addAnnouncement } = useAnnouncements();
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'normal' as const
  });

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert('Please fill in all fields');
      return;
    }

    const announcement = {
      id: 'ann_' + Date.now(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      priority: newAnnouncement.priority,
      date: new Date().toISOString().split('T')[0],
      author: user?.email || 'Admin'
    };

    addAnnouncement(announcement);

    // Reset form
    setNewAnnouncement({ title: '', content: '', priority: 'normal' });
    alert('Announcement created successfully!');
  };

  useEffect(() => {
    // Update stats based on user role
    setStats({
      openTickets: recentTickets.filter(t => t.status === 'Open').length,
      resolved: recentTickets.filter(t => t.status === 'Resolved').length,
      pending: 1,
      totalUsers: userRoles?.isAdmin ? 24 : 0
    });
  }, [recentTickets, userRoles]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitial = () => {
    return user?.email?.charAt(0).toUpperCase() || '?';
  };

  const getUserName = () => {
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <div className="admin-portal">
      {/* Background Effects */}
      <div className="bg-mesh"></div>
      <div className="bg-grid"></div>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🏥</div>
          <div className="sidebar-logo-text">
            <div className="brand">VISAYASMED</div>
            <div className="sub">IT Portal</div>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-section-label">Main</div>
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="icon">📊</span><span className="nav-label">Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            <span className="icon">🎫</span><span className="nav-label">Ticket Management</span>
            <span className="nav-badge">{stats.openTickets}</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            <span className="icon">📣</span><span className="nav-label">Announcements</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="icon">👤</span><span className="nav-label">My Profile</span>
          </button>
        </div>

        {userRoles?.isAdmin && (
          <div className="nav-section">
            <div className="nav-section-label">Admin</div>
            <button 
              className={`nav-item ${activeTab === 'user-management' ? 'active' : ''}`}
              onClick={() => setActiveTab('user-management')}
            >
              <span className="icon">👥</span><span className="nav-label">User Management</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'all-tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('all-tickets')}
            >
              <span className="icon">📋</span><span className="nav-label">All Tickets</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'post-announcement' ? 'active' : ''}`}
              onClick={() => setActiveTab('post-announcement')}
            >
              <span className="icon">✏️</span><span className="nav-label">Post Announcement</span>
            </button>
          </div>
        )}

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{getUserInitial()}</div>
            <div className="user-details">
              <div className="uname">{getUserName()}</div>
              <div className="urole">{userRoles?.isAdmin ? 'Administrator' : 'User'}</div>
            </div>
          </div>
          <a href="/" style={{ textDecoration: 'none' }}>
            <button className="logout-btn" style={{ marginBottom: '8px' }}>🌐 IT Portal</button>
          </a>
          <button className="logout-btn" onClick={handleLogout}>⏻ Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Dashboard Page */}
        {activeTab === 'dashboard' && (
          <div className="page active">
            <div className="page-header">
              <h1>Dashboard</h1>
              <p>Welcome back, {getUserName()}!</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-label">Open Tickets</div>
                <div className="stat-value">{stats.openTickets}</div>
                <div className="stat-sub">Awaiting resolution</div>
              </div>
              <div className="stat-card green">
                <div className="stat-label">Resolved</div>
                <div className="stat-value">{stats.resolved}</div>
                <div className="stat-sub">This month</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-label">Pending</div>
                <div className="stat-value">{stats.pending}</div>
                <div className="stat-sub">In progress</div>
              </div>
              {userRoles?.isAdmin && (
                <div className="stat-card red">
                  <div className="stat-label">Total Users</div>
                  <div className="stat-value">{stats.totalUsers}</div>
                  <div className="stat-sub">Registered accounts</div>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <h2>Recent Tickets</h2>
                <div className="card-actions">
                  <button 
                    className="btn-sm primary"
                    onClick={() => setActiveTab('tickets')}
                  >
                    ＋ New Ticket
                  </button>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Subject</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.map((ticket, index) => (
                    <tr key={index}>
                      <td>{ticket.id}</td>
                      <td>{ticket.subject}</td>
                      <td>
                        <span className={`priority ${ticket.priority.toLowerCase()}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${ticket.status.toLowerCase()}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td>{ticket.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tickets Page */}
        {activeTab === 'tickets' && (
          <div className="page active">
            <div className="page-header">
              <h1>My Tickets</h1>
              <p>Track your IT support requests</p>
            </div>
            <div className="card">
              <div className="card-header">
                <h2>Support Tickets</h2>
                <button className="btn-sm primary">＋ Submit Ticket</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Subject</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.map((ticket, index) => (
                    <tr key={index}>
                      <td>{ticket.id}</td>
                      <td>{ticket.subject}</td>
                      <td>Hardware</td>
                      <td>
                        <span className={`priority ${ticket.priority.toLowerCase()}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${ticket.status.toLowerCase()}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td>{ticket.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Announcements Page */}
        {activeTab === 'announcements' && (
          <div className="page active">
            <div className="page-header">
              <h1>Announcements</h1>
              <p>Latest updates from IT Department</p>
            </div>
            <div className="announcements-list">
              {announcements.length === 0 ? (
                <div className="announce-item">
                  <div className="announce-title">📣 No announcements yet</div>
                  <div className="announce-meta">Posted by Admin · Just now</div>
                  <div className="announce-body">Create your first announcement using the Post Announcement tab!</div>
                </div>
              ) : (
                announcements.map((announcement: any) => (
                  <div key={announcement.id} className="announce-item">
                    <div className="announce-title">{announcement.title}</div>
                    <div className="announce-meta">Posted by {announcement.author} · {announcement.date}</div>
                    <div className="announce-body">{announcement.content}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Profile Page */}
        {activeTab === 'profile' && (
          <div className="page active">
            <div className="page-header">
              <h1>My Profile</h1>
              <p>Your account details</p>
            </div>
            <div className="card" style={{ maxWidth: '600px' }}>
              <div className="profile-avatar">{getUserInitial()}</div>
              <div className="profile-info">
                <h3>{getUserName()}</h3>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {userRoles?.isAdmin ? 'Administrator' : 'User'}</p>
                <p><strong>Department:</strong> IT Department</p>
                <p><strong>Status:</strong> <span className="status active">Active</span></p>
              </div>
            </div>
          </div>
        )}

        {/* User Management (Admin Only) */}
        {activeTab === 'user-management' && userRoles?.isAdmin && (
          <div className="page active">
            <div className="page-header">
              <h1>User Management</h1>
              <p>Manage all registered accounts</p>
            </div>
            <div className="card">
              <div className="card-header">
                <h2>All Users</h2>
                <button className="btn-sm primary">＋ Create User</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>john.doe@visayasmed.com</td>
                    <td>Emergency Room</td>
                    <td><span className="role admin">Admin</span></td>
                    <td><span className="status active">Active</span></td>
                    <td>
                      <button className="btn-sm">Edit</button>
                      <button className="btn-sm danger">Disable</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Jane Smith</td>
                    <td>jane.smith@visayasmed.com</td>
                    <td>Laboratory</td>
                    <td><span className="role user">User</span></td>
                    <td><span className="status active">Active</span></td>
                    <td>
                      <button className="btn-sm">Edit</button>
                      <button className="btn-sm danger">Disable</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Tickets (Admin Only) */}
        {activeTab === 'all-tickets' && userRoles?.isAdmin && (
          <div className="page active">
            <div className="page-header">
              <h1>All Tickets</h1>
              <p>Manage all support tickets</p>
            </div>
            <div className="card">
              <div className="card-header">
                <h2>All Support Tickets</h2>
                <button className="btn-sm primary">＋ New Ticket</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Subject</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.map((ticket, index) => (
                    <tr key={index}>
                      <td>{ticket.id}</td>
                      <td>user@example.com</td>
                      <td>{ticket.subject}</td>
                      <td>
                        <span className={`priority ${ticket.priority.toLowerCase()}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${ticket.status.toLowerCase()}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td>{ticket.date}</td>
                      <td>
                        <button className="btn-sm">View</button>
                        <button className="btn-sm">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Post Announcement (Admin Only) */}
        {activeTab === 'post-announcement' && userRoles?.isAdmin && (
          <div className="page active">
            <div className="page-header">
              <h1>Post Announcement</h1>
              <p>Create new announcement for all users</p>
            </div>
            <div className="card" style={{ maxWidth: '800px' }}>
              <div className="form-group">
                <label>Announcement Title</label>
                <input 
                  type="text" 
                  placeholder="Enter announcement title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea 
                  rows={6} 
                  placeholder="Enter announcement message"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newAnnouncement.priority}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value as any})}
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="form-actions">
                <button className="btn-primary" onClick={handleCreateAnnouncement}>Post Announcement</button>
                <button className="btn-outline" onClick={() => setNewAnnouncement({ title: '', content: '', priority: 'normal' })}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
