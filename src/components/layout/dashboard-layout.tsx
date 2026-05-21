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
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}