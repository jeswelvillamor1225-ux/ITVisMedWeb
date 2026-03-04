import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  type: 'login' | 'user' | 'system' | 'security';
}

interface StatCard {
  title: string;
  value: string;
  icon: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load dashboard data
    const loadDashboardData = async () => {
      // Mock activities data
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          title: 'New User Registration',
          description: 'staff@visayasmed.com.ph registered for account',
          time: '2 minutes ago',
          icon: '👤',
          type: 'user'
        },
        {
          id: '2',
          title: 'System Update',
          description: 'HIS system updated to version 4.7.2',
          time: '15 minutes ago',
          icon: '🔄',
          type: 'system'
        },
        {
          id: '3',
          title: 'Security Alert',
          description: 'Failed login attempt detected from unknown IP',
          time: '1 hour ago',
          icon: '🔒',
          type: 'security'
        },
        {
          id: '4',
          title: 'Admin Login',
          description: 'Administrator logged into the system',
          time: '2 hours ago',
          icon: '👑',
          type: 'login'
        },
        {
          id: '5',
          title: 'Backup Complete',
          description: 'Daily system backup completed successfully',
          time: '3 hours ago',
          icon: '💾',
          type: 'system'
        }
      ];

      // Mock stats data
      const mockStats: StatCard[] = [
        {
          title: 'Total Users',
          value: '127',
          icon: '👥',
          change: '+12%',
          changeType: 'increase'
        },
        {
          title: 'Active Sessions',
          value: '24',
          icon: '🔐',
          change: '+8%',
          changeType: 'increase'
        },
        {
          title: 'System Health',
          value: '98%',
          icon: '💚',
          change: '+2%',
          changeType: 'increase'
        },
        {
          title: 'Pending Tickets',
          value: '8',
          icon: '🎫',
          change: '-25%',
          changeType: 'decrease'
        }
      ];

      setActivities(mockActivities);
      setStats(mockStats);
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getActivityIconColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'login': return 'rgba(46, 213, 115, 0.2)';
      case 'user': return 'rgba(52, 152, 219, 0.2)';
      case 'system': return 'rgba(155, 89, 182, 0.2)';
      case 'security': return 'rgba(231, 76, 60, 0.2)';
      default: return 'rgba(149, 165, 166, 0.2)';
    }
  };

  if (isLoading) {
    return (
      <div className="admin-portal-body">
        <div className="bg-mesh"></div>
        <div className="bg-grid"></div>
        <div className="screen">
          <div className="dashboard-header">
            <div className="dashboard-header-left">
              <h1>Loading...</h1>
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
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.email}</p>
          </div>
          
          <div className="user-menu">
            <div className="user-avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Grid */}
          <div className="dashboard-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-icon">{stat.icon}</div>
                  {stat.change && (
                    <span className={`stat-change ${stat.changeType}`}>
                      {stat.change}
                    </span>
                  )}
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.title}</div>
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div className="activity-feed">
            <div className="activity-header">Recent Activity</div>
            
            {activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div 
                  className="activity-icon"
                  style={{ background: getActivityIconColor(activity.type) }}
                >
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-description">{activity.description}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
