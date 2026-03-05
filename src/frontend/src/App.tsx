import { AuthorizationProvider } from "@/components/authorization";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import { AdminPage } from "./pages/admin/AdminPage";
import { PortfolioPage } from "./pages/portfolio/PortfolioPage";

function Router() {
  const path = window.location.pathname;

  if (path.startsWith("/admin")) {
    return <AdminPage />;
  }

  return <PortfolioPage />;
}

export default function App() {
  return (
    <AuthorizationProvider>
      <div className="dark">
        <Router />
        <Toaster
          theme="dark"
          toastOptions={{
            classNames: {
              toast:
                "bg-card border-white/10 text-foreground font-sans text-sm",
              title: "text-foreground",
              description: "text-muted-foreground",
            },
          }}
        />
      </div>
    </AuthorizationProvider>
  );
}
