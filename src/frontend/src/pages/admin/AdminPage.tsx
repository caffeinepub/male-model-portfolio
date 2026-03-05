import { useAuthContext } from "@/components/authorization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useIsCallerAdmin } from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, KeyRound, Loader2, Shield } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { AdminDashboard } from "./AdminDashboard";
import { AdminLogin } from "./AdminLogin";

export function AdminPage() {
  const { isAuthenticated, isInitializing } = useAuthContext();
  const {
    data: isAdmin,
    isLoading: isCheckingAdmin,
    isError: isAdminError,
  } = useIsCallerAdmin();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [secretToken, setSecretToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Safety timeout: if checking admin status takes >5s after auth, force show setup form
  const [adminCheckTimedOut, setAdminCheckTimedOut] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isAuthenticated && isCheckingAdmin && !adminCheckTimedOut) {
      timeoutRef.current = setTimeout(() => {
        setAdminCheckTimedOut(true);
      }, 5000);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated, isCheckingAdmin, adminCheckTimedOut]);

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

  // Authenticated but still checking admin status (and not timed out, no error)
  if (isCheckingAdmin && !isAdminError && !adminCheckTimedOut) {
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

  // Authenticated but not admin (or check errored / timed out) — show first-time setup form
  if (!isAdmin || isAdminError || adminCheckTimedOut) {
    const handleSetupSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!actor || !secretToken.trim()) return;
      setIsSubmitting(true);
      setTokenError(null);
      try {
        await actor._initializeAccessControlWithSecret(secretToken.trim());
        await queryClient.invalidateQueries({ queryKey: ["isCallerAdmin"] });
      } catch {
        setTokenError("Invalid token. Please check your admin secret.");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "oklch(0.07 0 0)" }}
        data-ocid="admin.panel"
      >
        <div className="w-full max-w-sm">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="p-3 border border-gold/20"
              style={{ backgroundColor: "oklch(0.10 0 0)" }}
            >
              <KeyRound className="h-8 w-8 text-gold/60" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-display text-2xl font-bold text-white text-center mb-2">
            Admin Setup
          </h1>
          <p className="font-sans text-white/40 text-sm text-center leading-relaxed mb-8">
            Enter the admin secret token to claim administrator access for this
            portfolio.
          </p>

          {/* Form */}
          <form onSubmit={handleSetupSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Admin secret token"
                value={secretToken}
                onChange={(e) => {
                  setSecretToken(e.target.value);
                  setTokenError(null);
                }}
                disabled={isSubmitting}
                autoComplete="current-password"
                className="w-full rounded-none border-white/15 bg-white/5 text-white placeholder:text-white/25 focus:border-gold/50 focus:ring-0 font-sans text-sm"
                data-ocid="admin.input"
              />
              {tokenError && (
                <div
                  className="flex items-center gap-2 mt-2"
                  data-ocid="admin.error_state"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-destructive/70 shrink-0" />
                  <p className="font-sans text-xs text-destructive/70">
                    {tokenError}
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !secretToken.trim()}
              className="w-full rounded-none bg-gold text-black font-sans text-xs tracking-widest uppercase font-semibold hover:bg-gold/90 disabled:opacity-40 transition-all duration-300 h-11"
              data-ocid="admin.submit_button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Verifying…
                </>
              ) : (
                "Claim Admin Access"
              )}
            </Button>
          </form>

          {/* Back link */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-block font-sans text-xs tracking-widest uppercase font-medium text-white/30 hover:text-gold transition-all duration-300"
              data-ocid="admin.link"
            >
              Back to Portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Fully authenticated admin
  return <AdminDashboard />;
}
