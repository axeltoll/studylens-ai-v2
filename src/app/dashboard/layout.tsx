"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUsage } from "@/lib/hooks/useUsage";
import DashboardLayout from "@/app/components/DashboardLayout";
import TrialCheckoutModal from "@/app/components/TrialCheckoutModal";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const { isProUser, isTrialUser } = useUsage();
  const [showTrialModal, setShowTrialModal] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    // If not loading and no user is logged in, redirect to login
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Show trial modal when user enters dashboard if they're not pro or trial
    if (user && !loading && !isProUser && !isTrialUser) {
      setShowTrialModal(true);
    }
  }, [user, loading, isProUser, isTrialUser]);

  // Show loading state or redirect while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Return the dashboard layout with children once authenticated
  return user ? (
    <DashboardLayout>
      {children}
      
      {/* Trial Modal */}
      {showTrialModal && (
        <TrialCheckoutModal onClose={() => setShowTrialModal(false)} />
      )}
    </DashboardLayout>
  ) : null;
} 