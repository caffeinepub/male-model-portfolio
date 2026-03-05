import { useAuthContext } from "@/components/authorization";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  ChevronRight,
  ExternalLink,
  FileText,
  Images,
  Layout,
  LogOut,
  Phone,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { BioTab } from "./BioTab";
import { ContactTab } from "./ContactTab";
import { GalleryTab } from "./GalleryTab";
import { SectionsTab } from "./SectionsTab";
import { StatsTab } from "./StatsTab";

type AdminTab = "gallery" | "bio" | "stats" | "sections" | "contact";

interface TabConfig {
  key: AdminTab;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabConfig[] = [
  { key: "gallery", label: "Gallery", icon: <Images className="h-4 w-4" /> },
  { key: "bio", label: "Bio", icon: <FileText className="h-4 w-4" /> },
  { key: "stats", label: "Stats", icon: <BarChart2 className="h-4 w-4" /> },
  { key: "sections", label: "Sections", icon: <Layout className="h-4 w-4" /> },
  { key: "contact", label: "Contact", icon: <Phone className="h-4 w-4" /> },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("gallery");
  const { logout } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{ backgroundColor: "oklch(0.08 0 0)" }}
    >
      {/* Sidebar */}
      <aside
        className={`
          w-full md:w-64 md:min-h-screen flex-shrink-0 border-b md:border-b-0 md:border-r border-white/8
          ${mobileMenuOpen ? "block" : "hidden md:flex"}
          flex flex-col
        `}
        style={{ background: "oklch(0.10 0 0)" }}
      >
        {/* Sidebar header */}
        <div className="p-6 border-b border-white/8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-white/30 mb-1">
                Admin Panel
              </p>
              <h1 className="font-display text-lg font-bold text-white leading-tight">
                Alexander Cross
              </h1>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white/70 transition-colors"
              title="View portfolio"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Tabs */}
        <nav className="p-3 flex-1">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              data-ocid="admin.tab"
              onClick={() => {
                setActiveTab(key);
                setMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 mb-1 text-left
                font-sans text-sm transition-all duration-200
                ${
                  activeTab === key
                    ? "admin-tab-active"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }
              `}
            >
              {icon}
              {label}
              {activeTab === key && (
                <ChevronRight className="h-3.5 w-3.5 ml-auto" />
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-white/8">
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start text-white/40 hover:text-white/80 hover:bg-white/5 font-sans text-xs uppercase tracking-widest gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div
        className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/8 sticky top-0 z-40"
        style={{ background: "oklch(0.10 0 0)" }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <Layout className="h-5 w-5" />
          </button>
          <span className="font-display text-white font-bold text-sm">
            {TABS.find((t) => t.key === activeTab)?.label}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-white/40 hover:text-white/80 font-sans text-xs uppercase tracking-widest"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Out
        </Button>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {activeTab === "gallery" && <GalleryTab />}
          {activeTab === "bio" && <BioTab />}
          {activeTab === "stats" && <StatsTab />}
          {activeTab === "sections" && <SectionsTab />}
          {activeTab === "contact" && <ContactTab />}
        </div>
      </main>
    </div>
  );
}
