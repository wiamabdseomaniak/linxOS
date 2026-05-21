'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Notification, FilterTab } from './types';
import { mockNotifications } from './data';
import { NotificationItem } from './notification-item';
import { FilterTabs } from './filter-tabs';
import { Bell, Settings, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationDropdownProps {
  trigger?: React.ReactNode;
}

export function NotificationDropdown({ trigger }: NotificationDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<FilterTab>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = useCallback(() => {
    let filtered = [...notifications];

    switch (filter) {
      case 'unread':
        filtered = filtered.filter((n) => !n.read);
        break;
    }

    return filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [notifications, filter]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const handleViewAll = () => {
    router.push('/notifications');
    setIsOpen(false);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const NotificationTrigger = () => (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-lg',
        'text-muted-foreground transition-all',
        'hover:bg-muted hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50'
      )}
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500 text-[9px] font-bold text-white"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </motion.span>
      )}
    </button>
  );

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <NotificationTrigger />
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 30 
              }}
              className={cn(
                'absolute right-0 top-full z-50 mt-2 w-[370px]',
                'overflow-hidden rounded-xl border border-border/50',
                'bg-background/95 backdrop-blur-2xl shadow-2xl'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/30 px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-foreground">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-yellow-500/15 px-1.5 py-0.5 text-[10px] font-medium text-yellow-600 dark:text-yellow-400">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleViewAll}
                  className="flex h-6 items-center gap-0.5 whitespace-nowrap rounded-md px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span>View all</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center border-b border-border/30 px-3 py-2">
                <FilterTabs
                  activeTab={filter}
                  onTabChange={setFilter}
                  unreadCount={unreadCount}
                  totalCount={notifications.length}
                />
              </div>

              {/* Notification List */}
              <div className="max-h-[420px] overflow-y-auto">
                {filteredNotifications().length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <Bell className="h-8 w-8 text-muted-foreground/30" />
                    <p className="mt-3 text-[13px] text-muted-foreground">
                      {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                    </p>
                  </div>
                ) : (
                  <div className="py-1">
                    <AnimatePresence mode="popLayout">
                      {filteredNotifications().map((notification, index) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onClick={() => handleNotificationClick(notification)}
                          index={index}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}