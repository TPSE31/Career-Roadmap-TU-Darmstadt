import api from './api';

// Flag to use mock data when backend is not ready
const USE_MOCK = true;

// Simulate API delay for mock data
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock notifications
const mockNotifications = [
  {
    id: 1,
    type: 'milestone_reminder',
    priority: 'medium',
    title: 'Milestone Approaching',
    message: 'You are close to reaching 60 CP! Complete 2 more modules to unlock this milestone.',
    dueAt: '2024-02-15T23:59:59Z',
    readAt: null,
    relatedMilestoneId: 3,
    actionUrl: '/roadmap',
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 2,
    type: 'deadline_warning',
    priority: 'high',
    title: 'Module Registration Deadline',
    message: 'Module registration for Summer Semester 2024 closes on February 1st. Make sure to register for your courses!',
    dueAt: '2024-02-01T23:59:59Z',
    readAt: null,
    relatedMilestoneId: null,
    actionUrl: null,
    createdAt: '2024-01-18T09:00:00Z',
  },
  {
    id: 3,
    type: 'recommendation',
    priority: 'low',
    title: 'Recommended Module',
    message: 'Based on your Machine Learning career goal, we recommend taking "Deep Learning" next semester.',
    dueAt: null,
    readAt: null,
    relatedMilestoneId: null,
    actionUrl: '/modules',
    createdAt: '2024-01-15T14:00:00Z',
  },
  {
    id: 4,
    type: 'support_service',
    priority: 'medium',
    title: 'Career Workshop',
    message: 'TU Career Service is hosting a "Tech Interview Preparation" workshop on February 10th. Register now!',
    dueAt: '2024-02-10T14:00:00Z',
    readAt: '2024-01-16T11:30:00Z',
    relatedMilestoneId: null,
    actionUrl: '/support',
    createdAt: '2024-01-14T08:00:00Z',
  },
  {
    id: 5,
    type: 'milestone_achieved',
    priority: 'low',
    title: 'Milestone Completed!',
    message: 'Congratulations! You have earned 30 CP and completed the "30 CP Earned" milestone.',
    dueAt: null,
    readAt: '2024-01-10T16:00:00Z',
    relatedMilestoneId: 2,
    actionUrl: '/roadmap',
    createdAt: '2024-01-10T15:00:00Z',
  },
];

/**
 * Get all notifications for the current user
 */
export const getNotifications = async () => {
  if (USE_MOCK) {
    await delay(500);
    return mockNotifications.map(transformNotification);
  }

  const response = await api.get('/notifications/');
  return response.data.map(transformNotificationFromAPI);
};

/**
 * Get unread notifications count
 */
export const getUnreadCount = async () => {
  if (USE_MOCK) {
    await delay(300);
    return mockNotifications.filter(n => !n.readAt).length;
  }

  const response = await api.get('/notifications/unread-count/');
  return response.data.count;
};

/**
 * Get unread notifications only
 */
export const getUnreadNotifications = async () => {
  if (USE_MOCK) {
    await delay(400);
    return mockNotifications
      .filter(n => !n.readAt)
      .map(transformNotification);
  }

  const response = await api.get('/notifications/', {
    params: { unread: true }
  });
  return response.data.map(transformNotificationFromAPI);
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (notificationId) => {
  if (USE_MOCK) {
    await delay(300);
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.readAt = new Date().toISOString();
    }
    return { success: true };
  }

  const response = await api.patch(`/notifications/${notificationId}/mark-read/`);
  return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async () => {
  if (USE_MOCK) {
    await delay(400);
    mockNotifications.forEach(n => {
      if (!n.readAt) {
        n.readAt = new Date().toISOString();
      }
    });
    return { success: true };
  }

  const response = await api.post('/notifications/mark-all-read/');
  return response.data;
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId) => {
  if (USE_MOCK) {
    await delay(300);
    const index = mockNotifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
    }
    return { success: true };
  }

  await api.delete(`/notifications/${notificationId}/`);
  return { success: true };
};

/**
 * Get notifications by type
 */
export const getNotificationsByType = async (type) => {
  if (USE_MOCK) {
    await delay(400);
    return mockNotifications
      .filter(n => n.type === type)
      .map(transformNotification);
  }

  const response = await api.get('/notifications/', {
    params: { type }
  });
  return response.data.map(transformNotificationFromAPI);
};

/**
 * Transform mock notification to consistent format
 */
const transformNotification = (notification) => ({
  id: notification.id,
  type: notification.type,
  priority: notification.priority,
  title: notification.title,
  message: notification.message,
  dueAt: notification.dueAt,
  isRead: !!notification.readAt,
  readAt: notification.readAt,
  relatedMilestoneId: notification.relatedMilestoneId,
  actionUrl: notification.actionUrl,
  createdAt: notification.createdAt,
});

/**
 * Transform notification from API (snake_case to camelCase)
 */
const transformNotificationFromAPI = (apiNotification) => ({
  id: apiNotification.id,
  type: apiNotification.type,
  priority: apiNotification.priority,
  title: apiNotification.title,
  message: apiNotification.message,
  dueAt: apiNotification.due_at,
  isRead: !!apiNotification.read_at,
  readAt: apiNotification.read_at,
  relatedMilestoneId: apiNotification.related_milestone,
  actionUrl: apiNotification.action_url,
  createdAt: apiNotification.created_at,
});

/**
 * Get notification type display info
 */
export const getNotificationTypeInfo = (type) => {
  const typeMap = {
    milestone_reminder: { label: 'Milestone', color: '#0F6CBF', icon: 'flag' },
    deadline_warning: { label: 'Deadline', color: '#dc3545', icon: 'clock' },
    milestone_achieved: { label: 'Achievement', color: '#28a745', icon: 'trophy' },
    recommendation: { label: 'Recommendation', color: '#6f42c1', icon: 'lightbulb' },
    support_service: { label: 'Support', color: '#17a2b8', icon: 'info' },
    system: { label: 'System', color: '#6c757d', icon: 'bell' },
  };
  return typeMap[type] || { label: 'Notification', color: '#6c757d', icon: 'bell' };
};

export default {
  getNotifications,
  getUnreadCount,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationsByType,
  getNotificationTypeInfo,
};
