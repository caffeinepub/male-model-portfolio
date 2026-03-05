import { useAuthContext } from "@/components/authorization";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import React from "react";

export function AdminLogin() {
  const { login, isLoggingIn } = useAuthContext();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "oklch(0.07 0 0)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo/Name */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-gold/20 mb-6 relative">
            <Lock className="h-6 w-6 text-gold/60" />
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gold/40" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gold/40" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gold/40" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gold/40" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight mb-2">
            Admin Access
          </h1>
          <p className="font-sans text-white/40 text-sm">
            Alexander Cross Portfolio
          </p>
        </div>

        {/* Login card */}
        <div
          className="border border-white/8 p-8 relative overflow-hidden"
          style={{ background: "oklch(0.12 0 0)" }}
        >
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold/20" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gold/20" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-gold/20" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold/20" />

          <p className="font-sans text-white/50 text-sm text-center mb-8 leading-relaxed">
            Sign in with your Internet Identity to access the management
            dashboard.
          </p>

          <Button
            data-ocid="admin.login_button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-gold hover:bg-gold/90 text-black font-sans font-semibold text-xs uppercase tracking-widest py-5 transition-all duration-300"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Login with Internet Identity"
            )}
          </Button>

          <p className="mt-6 text-center font-sans text-white/25 text-xs">
            Secure authentication via Internet Computer
          </p>
        </div>

        {/* Back to portfolio */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="font-sans text-xs text-white/25 hover:text-white/60 transition-colors uppercase tracking-widest"
          >
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
