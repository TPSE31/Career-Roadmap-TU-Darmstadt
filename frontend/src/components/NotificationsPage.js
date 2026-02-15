import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getNotificationTypeInfo
} from '../services/notificationService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const NotificationsPage = ({ language }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  const navigate = useNavigate();
  const brandColor = '#0F6CBF';

  const translations = {
    en: {
      title: 'Notifications',
      all: 'All',
      unread: 'Unread',
      read: 'Read',
      markAllRead: 'Mark all as read',
      noNotifications: 'No notifications',
      noUnread: 'No unread notifications',
      today: 'Today',
      yesterday: 'Yesterday',
      daysAgo: 'days ago',
      due: 'Due',
    },
    de: {
      title: 'Benachrichtigungen',
      all: 'Alle',
      unread: 'Ungelesen',
      read: 'Gelesen',
      markAllRead: 'Alle als gelesen markieren',
      noNotifications: 'Keine Benachrichtigungen',
      noUnread: 'Keine ungelesenen Benachrichtigungen',
      today: 'Heute',
      yesterday: 'Gestern',
      daysAgo: 'Tagen',
      due: 'Fallig',
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(notifications.map(n => ({
        ...n,
        isRead: true,
        readAt: n.readAt || new Date().toISOString()
      })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t.today;
    if (diffDays === 1) return t.yesterday;
    return `${diffDays} ${t.daysAgo}`;
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <ErrorMessage message={error} onRetry={loadNotifications} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{t.title}</h1>
          {unreadCount > 0 && (
            <span style={styles.badge}>{unreadCount} {t.unread.toLowerCase()}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            style={styles.markAllButton}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0a4a8a'}
            onMouseLeave={(e) => e.target.style.backgroundColor = brandColor}
          >
            {t.markAllRead}
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterTabs}>
        {['all', 'unread', 'read'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.filterTab,
              backgroundColor: filter === f ? brandColor : 'white',
              color: filter === f ? 'white' : '#333',
            }}
          >
            {t[f]}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={styles.notificationsList}>
        {filteredNotifications.length === 0 ? (
          <div style={styles.emptyState}>
            <p>{filter === 'unread' ? t.noUnread : t.noNotifications}</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const typeInfo = getNotificationTypeInfo(notification.type);
            return (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                style={{
                  ...styles.notificationCard,
                  backgroundColor: notification.isRead ? '#f8f9fa' : 'white',
                  borderLeft: `4px solid ${typeInfo.color}`,
                  cursor: notification.actionUrl ? 'pointer' : 'default',
                }}
                onMouseEnter={(e) => {
                  if (notification.actionUrl) {
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={styles.notificationHeader}>
                  <span style={{
                    ...styles.typeLabel,
                    backgroundColor: `${typeInfo.color}20`,
                    color: typeInfo.color,
                  }}>
                    {typeInfo.label}
                  </span>
                  <span style={styles.date}>{formatDate(notification.createdAt)}</span>
                </div>

                <h3 style={{
                  ...styles.notificationTitle,
                  fontWeight: notification.isRead ? 'normal' : 'bold',
                }}>
                  {!notification.isRead && (
                    <span style={styles.unreadDot} />
                  )}
                  {notification.title}
                </h3>

                <p style={styles.notificationMessage}>{notification.message}</p>

                {notification.dueAt && (
                  <div style={styles.dueDate}>
                    {t.due}: {new Date(notification.dueAt).toLocaleDateString()}
                  </div>
                )}

                {notification.actionUrl && (
                  <span style={styles.actionHint}>Click to view</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    margin: 0,
    display: 'inline-block',
  },
  badge: {
    marginLeft: '12px',
    padding: '4px 10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  markAllButton: {
    padding: '10px 20px',
    backgroundColor: '#0F6CBF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  filterTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  filterTab: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  notificationCard: {
    padding: '16px 20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s',
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  typeLabel: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  date: {
    fontSize: '12px',
    color: '#666',
  },
  notificationTitle: {
    fontSize: '16px',
    margin: '0 0 8px 0',
    color: '#1a1a2e',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#0F6CBF',
    borderRadius: '50%',
    flexShrink: 0,
  },
  notificationMessage: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
    lineHeight: '1.5',
  },
  dueDate: {
    marginTop: '10px',
    fontSize: '12px',
    color: '#e74c3c',
    fontWeight: '500',
  },
  actionHint: {
    display: 'block',
    marginTop: '10px',
    fontSize: '12px',
    color: '#0F6CBF',
    fontWeight: '500',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
    backgroundColor: 'white',
    borderRadius: '8px',
  },
};

export default NotificationsPage;
