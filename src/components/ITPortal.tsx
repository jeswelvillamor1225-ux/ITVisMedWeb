import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnnouncements } from '../contexts/AnnouncementContext';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  status: 'open' | 'in-progress' | 'resolved';
  date: string;
  user: string;
  assignedTo?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
}

const ITPortal: React.FC = () => {
  const { user, userRoles, logout } = useAuth();
  const { announcements, addAnnouncement } = useAnnouncements();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium' as const,
    category: 'hardware'
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'normal' as const
  });

  // Load data from localStorage
  useEffect(() => {
    const savedTickets = localStorage.getItem('itPortalTickets');
    if (savedTickets) {
      try {
        setTickets(JSON.parse(savedTickets));
      } catch (error) {
        console.error('Error loading tickets:', error);
      }
    }

    const savedUsers = localStorage.getItem('itPortalUsers');
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error('Error loading users:', error);
      }
    }

    // Initialize with sample data if empty
    if (tickets.length === 0) {
      const sampleTickets: Ticket[] = [
        {
          id: 'TKT001',
          subject: 'Printer not working in ER',
          description: 'The main printer in the emergency room is not printing documents. Need immediate assistance.',
          priority: 'high',
          category: 'hardware',
          status: 'open',
          date: new Date().toISOString().split('T')[0],
          user: 'john.doe@visayasmed.com'
        },
        {
          id: 'TKT002',
          subject: 'Cannot access HIS system',
          description: 'Unable to login to the Hospital Information System. Getting authentication error.',
          priority: 'medium',
          category: 'software',
          status: 'in-progress',
          date: new Date().toISOString().split('T')[0],
          user: 'jane.smith@visayasmed.com',
          assignedTo: 'it.support@visayasmed.com'
        }
      ];
      setTickets(sampleTickets);
      localStorage.setItem('itPortalTickets', JSON.stringify(sampleTickets));
    }

    if (users.length === 0) {
      const sampleUsers: User[] = [
        {
          id: 'USR001',
          name: 'John Doe',
          email: 'john.doe@visayasmed.com',
          department: 'Emergency Room',
          role: 'user',
          status: 'active'
        },
        {
          id: 'USR002',
          name: 'Jane Smith',
          email: 'jane.smith@visayasmed.com',
          department: 'Laboratory',
          role: 'user',
          status: 'active'
        },
        {
          id: 'USR003',
          name: 'IT Admin',
          email: 'it.admin@visayasmed.com',
          department: 'IT Department',
          role: 'admin',
          status: 'active'
        }
      ];
      setUsers(sampleUsers);
      localStorage.setItem('itPortalUsers', JSON.stringify(sampleUsers));
    }
  }, []);

  // Save tickets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('itPortalTickets', JSON.stringify(tickets));
  }, [tickets]);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('itPortalUsers', JSON.stringify(users));
  }, [users]);

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.description) {
      alert('Please fill in all fields');
      return;
    }

    const ticket: Ticket = {
      id: 'TKT' + String(tickets.length + 1).padStart(3, '0'),
      subject: newTicket.subject,
      description: newTicket.description,
      priority: newTicket.priority,
      category: newTicket.category,
      status: 'open',
      date: new Date().toISOString().split('T')[0],
      user: user?.email || 'unknown'
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: '', description: '', priority: 'medium', category: 'hardware' });
    alert('Ticket created successfully!');
  };

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
    setNewAnnouncement({ title: '', content: '', priority: 'normal' });
    alert('Announcement created successfully!');
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: Ticket['status']) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, assignedTo: user?.email || undefined }
        : ticket
    ));
  };

  const getStats = () => {
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    const totalUsers = users.filter(u => u.status === 'active').length;

    return { openTickets, inProgressTickets, resolvedTickets, totalUsers };
  };

  const stats = getStats();

  if (!user) {
    return (
      <div className="it-portal-access-denied">
        <div className="access-denied-container">
          <h1>🔒 IT Portal Access Required</h1>
          <p>Please sign in to access the IT Portal</p>
          <button onClick={() => window.location.href = '/'}>Go to Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="it-portal">
      {/* Background Effects */}
      <div className="bg-mesh"></div>
      <div className="bg-grid"></div>

      {/* Header */}
      <header className="it-portal-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <div>
              <div className="brand">VISAYASMED</div>
              <div className="sub">IT Portal</div>
            </div>
          </div>
          <div className="user-info">
            <span>Welcome, {user?.email?.split('@')[0]}</span>
            <span className="user-role">{userRoles?.isAdmin ? 'Administrator' : 'User'}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="it-portal-content">
        {/* Sidebar */}
        <aside className="it-portal-sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-btn ${activeTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              🎫 My Tickets
            </button>
            <button 
              className={`nav-btn ${activeTab === 'create-ticket' ? 'active' : ''}`}
              onClick={() => setActiveTab('create-ticket')}
            >
              ➕ Create Ticket
            </button>
            <button 
              className={`nav-btn ${activeTab === 'announcements' ? 'active' : ''}`}
              onClick={() => setActiveTab('announcements')}
            >
              📣 Announcements
            </button>
            {userRoles?.isAdmin && (
              <>
                <button 
                  className={`nav-btn ${activeTab === 'all-tickets' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all-tickets')}
                >
                  📋 All Tickets
                </button>
                <button 
                  className={`nav-btn ${activeTab === 'post-announcement' ? 'active' : ''}`}
                  onClick={() => setActiveTab('post-announcement')}
                >
                  ✏️ Post Announcement
                </button>
                <button 
                  className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  👥 Users
                </button>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="it-portal-main">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="page-content">
              <h1>Dashboard</h1>
              <p>Welcome to the IT Portal Dashboard</p>
              
              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-value">{stats.openTickets}</div>
                  <div className="stat-label">Open Tickets</div>
                </div>
                <div className="stat-card orange">
                  <div className="stat-value">{stats.inProgressTickets}</div>
                  <div className="stat-label">In Progress</div>
                </div>
                <div className="stat-card green">
                  <div className="stat-value">{stats.resolvedTickets}</div>
                  <div className="stat-label">Resolved</div>
                </div>
                {userRoles?.isAdmin && (
                  <div className="stat-card purple">
                    <div className="stat-value">{stats.totalUsers}</div>
                    <div className="stat-label">Active Users</div>
                  </div>
                )}
              </div>

              <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                  {tickets.slice(0, 5).map(ticket => (
                    <div key={ticket.id} className="activity-item">
                      <div className="activity-info">
                        <span className="activity-title">{ticket.subject}</span>
                        <span className="activity-meta">{ticket.date} • {ticket.status}</span>
                      </div>
                      <span className={`priority-badge ${ticket.priority}`}>{ticket.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* My Tickets */}
          {activeTab === 'tickets' && (
            <div className="page-content">
              <h1>My Tickets</h1>
              <p>Track your IT support requests</p>
              
              <div className="tickets-table">
                <table>
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Subject</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets
                      .filter(ticket => ticket.user === user?.email)
                      .map(ticket => (
                        <tr key={ticket.id}>
                          <td>{ticket.id}</td>
                          <td>{ticket.subject}</td>
                          <td>
                            <span className={`priority-badge ${ticket.priority}`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${ticket.status}`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td>{ticket.date}</td>
                          <td>
                            <button className="action-btn">View</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Create Ticket */}
          {activeTab === 'create-ticket' && (
            <div className="page-content">
              <h1>Create Support Ticket</h1>
              <p>Submit a new IT support request</p>
              
              <div className="form-card">
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    placeholder="Brief description of the issue"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows={6}
                    placeholder="Detailed description of the issue"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as any})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                    >
                      <option value="hardware">Hardware</option>
                      <option value="software">Software</option>
                      <option value="network">Network</option>
                      <option value="account">Account</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button className="btn-primary" onClick={handleCreateTicket}>
                    Submit Ticket
                  </button>
                  <button className="btn-secondary" onClick={() => setNewTicket({ subject: '', description: '', priority: 'medium', category: 'hardware' })}>
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Announcements */}
          {activeTab === 'announcements' && (
            <div className="page-content">
              <h1>Announcements</h1>
              <p>Latest updates from IT Department</p>
              
              <div className="announcements-list">
                {announcements.length === 0 ? (
                  <div className="no-announcements">
                    <p>No announcements yet</p>
                  </div>
                ) : (
                  announcements.map(announcement => (
                    <div key={announcement.id} className="announcement-card">
                      <div className="announcement-header">
                        <h3>{announcement.title}</h3>
                        <span className={`priority-badge ${announcement.priority}`}>
                          {announcement.priority}
                        </span>
                      </div>
                      <p>{announcement.content}</p>
                      <div className="announcement-footer">
                        <span className="announcement-meta">
                          By {announcement.author} • {announcement.date}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* All Tickets (Admin Only) */}
          {activeTab === 'all-tickets' && userRoles?.isAdmin && (
            <div className="page-content">
              <h1>All Tickets</h1>
              <p>Manage all support tickets</p>
              
              <div className="tickets-table">
                <table>
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>User</th>
                      <th>Subject</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(ticket => (
                      <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.user}</td>
                        <td>{ticket.subject}</td>
                        <td>
                          <span className={`priority-badge ${ticket.priority}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td>
                          <select
                            className={`status-select ${ticket.status}`}
                            value={ticket.status}
                            onChange={(e) => handleUpdateTicketStatus(ticket.id, e.target.value as any)}
                          >
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                        <td>{ticket.date}</td>
                        <td>
                          <button className="action-btn">View</button>
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
            <div className="page-content">
              <h1>Post Announcement</h1>
              <p>Create new announcement for all users</p>
              
              <div className="form-card">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Announcement title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    rows={6}
                    placeholder="Announcement message"
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
                  <button className="btn-primary" onClick={handleCreateAnnouncement}>
                    Post Announcement
                  </button>
                  <button className="btn-secondary" onClick={() => setNewAnnouncement({ title: '', content: '', priority: 'normal' })}>
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users (Admin Only) */}
          {activeTab === 'users' && userRoles?.isAdmin && (
            <div className="page-content">
              <h1>User Management</h1>
              <p>Manage all registered users</p>
              
              <div className="users-table">
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
                    {users.map(userItem => (
                      <tr key={userItem.id}>
                        <td>{userItem.name}</td>
                        <td>{userItem.email}</td>
                        <td>{userItem.department}</td>
                        <td>
                          <span className={`role-badge ${userItem.role}`}>
                            {userItem.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${userItem.status}`}>
                            {userItem.status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ITPortal;
