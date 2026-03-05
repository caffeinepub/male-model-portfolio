import { useAuthContext } from "@/components/authorization";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsCallerAdmin } from "@/hooks/useQueries";
import { AlertTriangle, Shield } from "lucide-react";
import React from "react";
import { AdminDashboard } from "./AdminDashboard";
import { AdminLogin } from "./AdminLogin";

export function AdminPage() {
  const { isAuthenticated, isInitializing } = useAuthContext();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();

  // Show loading while auth is initializing
  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "oklch(0.07 0 0)" }}
        data-ocid="admin.loading_state"
      >
        <div className="flex flex-col items-center gap-4">
          <Shield className="h-10 w-10 text-gold/40 animate-pulse" />
          <p className="font-sans text-white/30 text-sm uppercase tracking-widest">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated — show login
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Authenticated but checking admin status
  if (isCheckingAdmin) {
    return (
      <div
        className="min-h-screen p-8"
        style={{ backgroundColor: "oklch(0.08 0 0)" }}
        data-ocid="admin.loading_state"
      >
        <div className="max-w-2xl mx-auto mt-24 space-y-4">
          <Skeleton className="h-8 w-48 rounded-none" />
          <Skeleton className="h-4 w-64 rounded-none" />
          <div className="mt-8 space-y-2">
            {[...Array(5)].map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
              <Skeleton key={i} className="h-12 w-full rounded-none" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Authenticated but not admin
  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "oklch(0.07 0 0)" }}
        data-ocid="admin.error_state"
      >
        <div className="text-center max-w-sm">
          <AlertTriangle className="h-12 w-12 text-destructive/60 mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-white mb-4">
            Access Denied
          </h1>
          <p className="font-sans text-white/40 text-sm leading-relaxed mb-8">
            Your account does not have admin privileges for this portfolio.
            Please contact the site owner.
          </p>
          <a
            href="/"
            className="inline-block font-sans text-xs tracking-widest uppercase font-medium px-6 py-3 border border-white/15 text-white/40 hover:border-gold/40 hover:text-gold transition-all duration-300"
          >
            Back to Portfolio
          </a>
        </div>
      </div>
    );
  }

  // Fully authenticated admin
  return <AdminDashboard />;
}
