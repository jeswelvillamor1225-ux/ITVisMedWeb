import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: string;
  submittedBy: string;
  submittedAt: string;
  assignedTo?: string;
  updatedAt: string;
}

const AdminTickets: React.FC = () => {
  const { logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load tickets data
    const loadTickets = async () => {
      // Mock tickets data
      const mockTickets: Ticket[] = [
        {
          id: 'TKT-001',
          title: 'Network Connectivity Issues',
          description: 'Users in 3rd floor reporting intermittent network connectivity issues affecting HIS system access.',
          priority: 'high',
          status: 'in-progress',
          category: 'Network',
          submittedBy: 'nursing@visayasmed.com.ph',
          submittedAt: '2024-03-01T10:30:00Z',
          assignedTo: 'john.baylon@visayasmed.com.ph',
          updatedAt: '2024-03-01T14:15:00Z'
        },
        {
          id: 'TKT-002',
          title: 'HIS System Login Error',
          description: 'Unable to login to HIS system from emergency room workstations.',
          priority: 'critical',
          status: 'open',
          category: 'HIS/EMR',
          submittedBy: 'emergency@visayasmed.com.ph',
          submittedAt: '2024-03-01T09:45:00Z',
          updatedAt: '2024-03-01T09:45:00Z'
        },
        {
          id: 'TKT-003',
          title: 'Printer Not Working',
          description: 'Laser printer in billing department not printing documents.',
          priority: 'low',
          status: 'resolved',
          category: 'Hardware',
          submittedBy: 'billing@visayasmed.com.ph',
          submittedAt: '2024-02-29T16:20:00Z',
          assignedTo: 'ojt@visayasmed.com.ph',
          updatedAt: '2024-03-01T08:00:00Z'
        },
        {
          id: 'TKT-004',
          title: 'Password Reset Request',
          description: 'Multiple users requesting password reset for email accounts.',
          priority: 'medium',
          status: 'open',
          category: 'Account',
          submittedBy: 'hr@visayasmed.com.ph',
          submittedAt: '2024-03-01T11:00:00Z',
          updatedAt: '2024-03-01T11:00:00Z'
        },
        {
          id: 'TKT-005',
          title: 'Server Room Temperature Alert',
          description: 'Temperature monitoring system showing high temperature in server room.',
          priority: 'high',
          status: 'in-progress',
          category: 'Infrastructure',
          submittedBy: 'system@visayasmed.com.ph',
          submittedAt: '2024-03-01T07:30:00Z',
          assignedTo: 'romel.banquil@visayasmed.com.ph',
          updatedAt: '2024-03-01T08:45:00Z'
        }
      ];

      setTickets(mockTickets);
      setFilteredTickets(mockTickets);
      setIsLoading(false);
    };

    loadTickets();
  }, []);

  useEffect(() => {
    // Filter tickets based on status, priority, and search term
    let filtered = tickets;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === filterPriority);
    }

    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  }, [tickets, filterStatus, filterPriority, searchTerm]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#e74c3c';
      case 'high': return '#f39c12';
      case 'medium': return '#3498db';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#e74c3c';
      case 'in-progress': return '#f39c12';
      case 'resolved': return '#27ae60';
      case 'closed': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="admin-portal-body">
        <div className="bg-mesh"></div>
        <div className="bg-grid"></div>
        <div className="screen">
          <div className="container">
            <div className="header">
              <h1>Loading tickets...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-portal-body">
      <div className="bg-mesh"></div>
      <div className="bg-grid"></div>
      
      <div className="screen">
        <div className="container">
          {/* Header */}
          <div className="header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1>🎫 IT Support Tickets</h1>
                <p style={{ color: 'var(--muted)', marginTop: '4px' }}>
                  Manage and track support tickets from hospital staff
                </p>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filters-row">
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select 
                value={filterPriority} 
                onChange={(e) => setFilterPriority(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Tickets Grid */}
          <div className="tickets-grid">
            {filteredTickets.map((ticket) => (
              <div 
                key={ticket.id}
                className="ticket-card"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="ticket-header">
                  <div className="ticket-id">{ticket.id}</div>
                  <div className="ticket-priority" style={{ color: getPriorityColor(ticket.priority) }}>
                    {ticket.priority.toUpperCase()}
                  </div>
                </div>
                
                <h3 className="ticket-title">{ticket.title}</h3>
                <p className="ticket-description">{ticket.description}</p>
                
                <div className="ticket-meta">
                  <div className="ticket-status" style={{ 
                    background: `${getStatusColor(ticket.status)}20`,
                    color: getStatusColor(ticket.status)
                  }}>
                    {ticket.status.replace('-', ' ').toUpperCase()}
                  </div>
                  <div className="ticket-category">{ticket.category}</div>
                </div>
                
                <div className="ticket-footer">
                  <div className="ticket-info">
                    <div>👤 {ticket.submittedBy}</div>
                    <div>📅 {formatDate(ticket.submittedAt)}</div>
                  </div>
                  {ticket.assignedTo && (
                    <div className="assigned-to">
                      👨‍💼 {ticket.assignedTo}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Ticket Detail Modal */}
          {selectedTicket && (
            <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{selectedTicket.id} - {selectedTicket.title}</h2>
                  <button onClick={() => setSelectedTicket(null)} className="modal-close">✕</button>
                </div>
                
                <div className="modal-body">
                  <div className="ticket-detail-section">
                    <h4>Description</h4>
                    <p>{selectedTicket.description}</p>
                  </div>
                  
                  <div className="ticket-detail-grid">
                    <div>
                      <h4>Priority</h4>
                      <div className="ticket-priority" style={{ color: getPriorityColor(selectedTicket.priority) }}>
                        {selectedTicket.priority.toUpperCase()}
                      </div>
                    </div>
                    
                    <div>
                      <h4>Status</h4>
                      <div className="ticket-status" style={{ 
                        background: `${getStatusColor(selectedTicket.status)}20`,
                        color: getStatusColor(selectedTicket.status)
                      }}>
                        {selectedTicket.status.replace('-', ' ').toUpperCase()}
                      </div>
                    </div>
                    
                    <div>
                      <h4>Category</h4>
                      <div>{selectedTicket.category}</div>
                    </div>
                    
                    <div>
                      <h4>Submitted By</h4>
                      <div>{selectedTicket.submittedBy}</div>
                    </div>
                  </div>
                  
                  <div className="ticket-timeline">
                    <h4>Timeline</h4>
                    <div className="timeline-item">
                      <div className="timeline-date">{formatDate(selectedTicket.submittedAt)}</div>
                      <div className="timeline-text">Ticket submitted</div>
                    </div>
                    {selectedTicket.updatedAt !== selectedTicket.submittedAt && (
                      <div className="timeline-item">
                        <div className="timeline-date">{formatDate(selectedTicket.updatedAt)}</div>
                        <div className="timeline-text">Last updated</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button className="btn-primary">Assign to Me</button>
                  <button className="btn-secondary">Update Status</button>
                  <button className="btn-outline">Add Comment</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTickets;
