import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Bell } from './ui/Icons'
import { Button } from './ui/Button'
import { useNotificationStore } from '../store/useNotificationStore'
import type { Notification } from '../store/useNotificationStore'
import { useToast } from './ui/useToast'
import { cn } from '../lib/utils'

export function NotificationBell() {
  const { notifications, isPanelOpen, setPanelOpen, addNotifications, markAsRead, markAllAsRead } = useNotificationStore()
  const { toast } = useToast()
  const [page, setPage] = React.useState(1)
  
  const displayedNotifications = notifications.slice(0, page * 20)
  const unreadCount = notifications.filter(n => !n.read).length

  useQuery({
    queryKey: ['notifications-polling'],
    queryFn: async () => {
      const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
      return data as { id: number; title: string; body: string }[]
    },
    refetchInterval: 15000, // Poll every 15 seconds
    refetchIntervalInBackground: false, // Pause when tab is hidden
  }).data?.forEach((post) => {
    // Check if notification already exists
    const exists = notifications.some(n => n.id === post.id)
    if (!exists) {
      const newNotif: Notification = {
        id: post.id,
        title: post.title,
        body: post.body,
        read: false,
        createdAt: new Date().toISOString(),
      }
      addNotifications([newNotif])
      
      // Show toast if panel is closed
      if (!isPanelOpen) {
        toast({
          title: "New Notification",
          description: post.title.slice(0, 50) + "...",
        })
      }
    }
  })

  // Close panel on outside click
  const panelRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false)
      }
    }
    if (isPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isPanelOpen, setPanelOpen])

  return (
    <div className="relative" ref={panelRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative" 
        onClick={() => setPanelOpen(!isPanelOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            {unreadCount}
          </span>
        )}
      </Button>

      {isPanelOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-md border bg-background text-foreground shadow-lg z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto p-0 text-xs text-primary hover:bg-transparent">
                Mark all read
              </Button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              <div className="flex flex-col">
                {displayedNotifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={cn(
                      "flex flex-col gap-1 border-b px-4 py-3 last:border-0 hover:bg-muted/50 cursor-pointer",
                      !notif.read && "bg-primary/5"
                    )}
                    onClick={() => !notif.read && markAsRead(notif.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm font-medium", !notif.read && "text-primary")}>
                        {notif.title.slice(0, 40)}{notif.title.length > 40 ? '...' : ''}
                      </p>
                      {!notif.read && (
                        <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notif.body}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(notif.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
                
                {notifications.length > displayedNotifications.length && (
                  <div className="p-3 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full text-xs h-8"
                      onClick={() => setPage(p => p + 1)}
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
