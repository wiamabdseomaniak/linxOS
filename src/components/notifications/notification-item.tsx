/**
 * Item de notification — rendu individuel dans le dropdown.
 * Affiche icône (ou avatar), titre, message, durée relative, et un point jaune
 * pour les notifications non lues.
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Notification } from './types';
import { notificationTypeConfig } from './data';
import {
  Package,
  Calendar,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  AtSign,
  CreditCard,
  Shield,
  Users,
} from 'lucide-react';

// Résout un nom d'icône (string) en composant Lucide.
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Package,
  Calendar,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  AtSign,
  CreditCard,
  Shield,
  Users,
};

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
  index: number;
}

export function NotificationItem({ notification, onClick, index }: NotificationItemProps) {
  const config = notificationTypeConfig[notification.type] || notificationTypeConfig.system;
  const IconComponent = iconMap[config.icon] || Info;

  // Renvoie une durée relative compacte ("5m", "3h", "2d") ou une date courte au-delà de 7 jours.
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.98 }}
      transition={{ 
        duration: 0.15, 
        ease: [0.25, 0.4, 0.25, 1],
        delay: index * 0.02 
      }}
      className={cn(
        'group relative flex w-full items-start gap-3 px-3 py-2.5 text-left',
        'transition-all duration-150 ease-out',
        'hover:bg-muted/60 dark:hover:bg-white/5',
        !notification.read && 'bg-muted/40 dark:bg-white/5'
      )}
      onClick={onClick}
    >
      {/* Unread dot indicator */}
      {!notification.read && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute left-1.5 top-5 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-yellow-500" 
        />
      )}

      {/* Icon */}
      <div className={cn(
        'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
        config.bgColor,
        config.color
      )}>
        {notification.avatar ? (
          <img
            src={notification.avatar}
            alt=""
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <IconComponent className="h-3.5 w-3.5" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'truncate text-[13px]',
          !notification.read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'
        )}>
          {notification.title}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
          {notification.message}
        </p>
      </div>

      {/* Time */}
      <span className="mt-0.5 shrink-0 text-[11px] text-muted-foreground/60">
        {formatRelativeTime(notification.timestamp)}
      </span>
    </motion.button>
  );
}