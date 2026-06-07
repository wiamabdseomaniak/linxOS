/**
 * Layout du groupe de routes `(dashboard)`.
 * Enveloppe toutes les pages du tableau de bord avec la Sidebar,
 * la Navbar et le système de notifications (toasts).
 */

'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}