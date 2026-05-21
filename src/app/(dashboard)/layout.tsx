'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const check2FA = () => {
      const twoFACompleted = sessionStorage.getItem('2fa_completed');
      const twoFARequired = sessionStorage.getItem('2fa_required');
      const pendingEmail = sessionStorage.getItem('pending_2fa_email');
      
      if (twoFACompleted === 'true') {
        // 2FA completed, allow access
        setIsVerifying(false);
      } else if (twoFARequired === 'true' && pendingEmail) {
        // 2FA required but not completed, redirect to verify-otp
        router.push(`/verify-otp?email=${encodeURIComponent(pendingEmail)}`);
      } else {
        // No 2FA flow started, redirect to login
        router.push('/login');
      }
    };

    // Small delay to allow sessionStorage to be ready
    setTimeout(check2FA, 100);
  }, [router]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}