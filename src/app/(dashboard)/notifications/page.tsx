'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  Package,
  Truck,
  User,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockNotifications } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const notificationIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  delivery: Package,
  event: Calendar,
  alert: AlertTriangle,
  system: Bell,
};

const notificationColors: Record<string, string> = {
  success: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  error: 'text-red-600 bg-red-100 dark:bg-red-900/30',
  warning: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
  info: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  delivery: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30',
  event: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
  alert: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
  system: 'text-gray-600 bg-gray-100 dark:bg-gray-900/30',
};

const mockNotificationList = [
  ...mockNotifications,
  {
    id: 'notif-5',
    title: 'Delivery Assigned',
    message: 'A new delivery LNX-2026-008 has been assigned to your route',
    type: 'info' as const,
    read: false,
    actionUrl: '/deliveries/del-008',
    createdAt: new Date('2026-05-14T08:00:00'),
  },
  
  {
    id: 'notif-8',
    title: 'New Message',
    message: 'You have a new message from Fatima Zahra',
    type: 'info' as const,
    read: true,
    actionUrl: '/messages',
    createdAt: new Date('2026-05-14T07:15:00'),
  },
  {
    id: 'notif-9',
    title: 'System Update',
    message: 'Scheduled maintenance will occur tonight at 11 PM',
    type: 'warning' as const,
    read: true,
    createdAt: new Date('2026-05-13T18:00:00'),
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotificationList);
  const [filterType, setFilterType] = useState('unread');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'read') return n.read;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="rounded-xl"
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Tabs defaultValue="unread" className="w-full sm:w-auto" onValueChange={(v) => setFilterType(v)}>
                <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="read">Read</TabsTrigger>
                </TabsList>
              </Tabs>
              <Select defaultValue="newest">
                <SelectTrigger className="w-full rounded-xl sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-3"
      >
        {filteredNotifications.length === 0 ? (
          <Card className="border-0 shadow-soft">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-violet-100 p-4 dark:bg-violet-900/30">
                <Bell className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You&apos;re all caught up! Check back later for updates.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification, index) => {
            const Icon = notificationIcons[notification.type];
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={cn(
                    'border-0 shadow-soft transition-all hover:shadow-md',
                    !notification.read && 'bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10'
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn('rounded-full p-2', notificationColors[notification.type])}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className={cn('font-semibold', !notification.read && 'text-violet-600')}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-violet-600" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(new Date(notification.createdAt))}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="text-sm text-violet-600 hover:text-violet-700 hover:underline"
                          >
                            View Details
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => markAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => deleteNotification(notification.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}