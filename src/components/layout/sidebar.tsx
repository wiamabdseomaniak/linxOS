/**
 * Sidebar principale de l'application.
 * - Génère dynamiquement le menu à partir de `SIDEBAR_MENU`
 * - Bascule entre les états étendu / réduit (desktop) et visible / caché (mobile)
 * - Affiche un overlay sombre en mode mobile
 * - Gère la déconnexion avec confirmation
 */

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SIDEBAR_MENU } from '@/lib/constants';
import { useUIStore } from '@/stores';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useTheme } from '@/components/providers/theme-provider';
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

// Mapping nom d'icône (string dans `SIDEBAR_MENU`) → composant Lucide.
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
  const router = useRouter();
  const { sidebarCollapsed, toggleSidebar, sidebarMobileOpen, toggleMobileSidebar } = useUIStore();
  const { user } = useCurrentUser();
  const { signOut } = useTheme();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  // Déclenche la déconnexion après confirmation (sauf en SSR).
  const handleSignOut = () => {
    if (typeof window === 'undefined' || window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      signOut();
      router.push('/');
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
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
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl',
          'lg:translate-x-0',
          sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo + bouton fermeture (mobile) en haut de la sidebar. */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/dashboard" className="flex items-center pt-4" onClick={() => window.innerWidth < 1024 && toggleMobileSidebar()}>
            <img
              src="/L__2_-removebg-preview.png"
              alt="LINXOS"
              className="h-16 w-auto dark:hidden"
            />
            <img
              src="/L-removebg-preview.png"
              alt="LINXOS"
              className="hidden h-16 w-auto dark:block"
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={toggleMobileSidebar}
            aria-label="Fermer le menu"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Liste de navigation générée depuis `SIDEBAR_MENU`.
            L'item actif est mis en valeur via un dégradé jaune.
            En mode réduit, le label est remplacé par un tooltip au survol. */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1.5">
            {SIDEBAR_MENU.map((item) => {
              // Actif si on est sur la route exacte OU sur une sous-route.
              const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
              const Icon = iconMap[item.icon];

              const linkContent = (
                <Link
                  href={item.path}
                  onClick={() => window.innerWidth < 1024 && toggleMobileSidebar()}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-amber-500/30 dark:from-yellow-500 dark:to-amber-600'
                      : 'text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-foreground active:scale-[0.98]'
                  )}
                >
                  {Icon && <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-white' : 'text-sidebar-foreground/70')} />}
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

        {/* Pied de sidebar : carte profil + bouton de déconnexion. */}
        <div className="border-t border-sidebar-border p-3">
          <div
            className={cn(
              'flex items-center gap-3 rounded-xl bg-sidebar-accent p-3',
              sidebarCollapsed && 'justify-center'
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-md">
              <span className="text-sm font-semibold">{initials}</span>
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm font-semibold text-sidebar-foreground">{user?.name || 'Utilisateur'}</p>
                  <p className="text-xs text-sidebar-foreground/70">{user?.role === 'manager' ? 'Responsable Logistique' : user?.role ?? '—'}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={cn(
              'mt-2 w-full justify-start font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/15 dark:hover:text-red-300',
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
                  
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.aside>
    </>
  );
}