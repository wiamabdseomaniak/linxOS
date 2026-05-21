'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SIDEBAR_MENU } from '@/lib/constants';
import { useUIStore } from '@/stores';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Truck,
  Package,
  BarChart3,
  Bell,
  FileCheck,
  Users,
  UserCircle,
  FileText,
  Settings,
  User,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Truck,
  Package,
  BarChart3,
  Bell,
  FileCheck,
  Users,
  UserCircle,
  FileText,
  Settings,
  User,
  HelpCircle,
  CheckCircle2,
};

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, sidebarMobileOpen, toggleMobileSidebar } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={toggleMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarCollapsed ? 80 : 280,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border/50 bg-sidebar',
          'dark:bg-gray-900/95 dark:backdrop-blur-xl',
          'lg:translate-x-0',
          sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-400/25">
              <span className="text-lg font-bold text-white">LX</span>
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap text-xl font-bold"
                >
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-900 dark:from-black-600 dark:to-black-400 bg-clip-text text-transparent">
                    LINXOS
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {SIDEBAR_MENU.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
              const Icon = iconMap[item.icon];

              const linkContent = (
                <Link
                  href={item.path}
                  onClick={() => window.innerWidth < 1024 && toggleMobileSidebar()}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-400 text-white shadow-lg shadow-yellow-400/25'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {Icon && <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-white')} />}
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );

              if (sidebarCollapsed) {
                return (
                  <li key={item.path}>
                    <Tooltip>
                      <TooltipTrigger>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  </li>
                );
              }

              return <li key={item.path}>{linkContent}</li>;
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border/50 p-3">
          <div
            className={cn(
              'flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600/10 to-purple-600/10 p-3',
              sidebarCollapsed && 'justify-center'
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-white-100 to-yellow-500">
              <span className="text-sm font-semibold text-white">AB</span>
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm font-semibold">Ahmed Benali</p>
                  <p className="text-xs text-muted-foreground">Logistique Manager</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            variant="ghost"
            onClick={() => {
              if (confirm('Are you sure you want to log out?')) {
                window.location.href = '/login';
              }
            }}
            className={cn(
              'mt-2 w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700',
              sidebarCollapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="h-4 w-4" />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3 overflow-hidden whitespace-nowrap"
                >
                  Log Out
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.aside>
    </>
  );
}