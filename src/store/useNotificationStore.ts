import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import mockData from '../data/mock-data.json'

export interface Notification {
  id: number;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  isPanelOpen: boolean;
  setPanelOpen: (isOpen: boolean) => void;
  addNotifications: (newNotifs: Notification[]) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: mockData.notifications.map(n => ({
        id: n.id,
        title: n.title,
        body: n.message, // Map message to body to match JSONPlaceholder structure
        read: n.read,
        createdAt: n.createdAt
      })),
      isPanelOpen: false,
      setPanelOpen: (isOpen) => set({ isPanelOpen: isOpen }),
      addNotifications: (newNotifs) => set((state) => {
        const combined = [...newNotifs, ...state.notifications];
        return { notifications: combined };
      }),
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      })),
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true }))
      })),
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
)
