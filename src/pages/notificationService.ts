import type { NotificationItem } from './types';

const KEY = 'campusconnect-notifications';

export const getNotifications = (userId: string) => {
  const saved = localStorage.getItem(KEY);
  if (!saved) return [] as NotificationItem[];
  try {
    const items = JSON.parse(saved) as NotificationItem[];
    return items.filter((notification) => notification.userId === userId);
  } catch {
    return [] as NotificationItem[];
  }
};

export const addNotification = (notification: NotificationItem) => {
  const saved = JSON.parse(localStorage.getItem(KEY) || '[]') as NotificationItem[];
  localStorage.setItem(KEY, JSON.stringify([...saved, notification]));
};

export const markNotificationRead = (id: string) => {
  const saved = JSON.parse(localStorage.getItem(KEY) || '[]') as NotificationItem[];
  const updated = saved.map((item) => (item.id === id ? { ...item, read: true } : item));
  localStorage.setItem(KEY, JSON.stringify(updated));
};

export const clearNotifications = (userId: string) => {
  const saved = JSON.parse(localStorage.getItem(KEY) || '[]') as NotificationItem[];
  const filtered = saved.filter((item) => item.userId !== userId);
  localStorage.setItem(KEY, JSON.stringify(filtered));
};
