/**
 * Layout principal du tableau de bord.
 * Combine la Sidebar (collapsible) et la Navbar, et adapte
 * la largeur du contenu principal en fonction de l'état UI persisté.
 */

'use client';

import { useUIStore } from '@/stores';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { cn } from '@/lib/utils';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-[280px]'
        )}
      >
        <Navbar />
        <main className="px-3 py-4 sm:px-4 sm:py-5 lg:p-6">{children}</main>
      </div>
    </div>
  );
}