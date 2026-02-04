"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, UploadCloud, FileText, LogOut, Layers } from "lucide-react";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const links = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/upload", label: "Upload Data", icon: UploadCloud },
    { href: "/results", label: "Reconciliation", icon: FileText },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-slate-950/50 backdrop-blur-xl">
      <div className="flex h-full flex-col px-4 py-6">
        
        {/* Logo Area */}
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
            <Layers size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recon<span className="text-indigo-500">System</span></h2>
            <p className="text-xs text-slate-500">v1.0.0 (Beta)</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)] border border-indigo-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="mt-auto border-t border-white/10 pt-6">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
              <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold text-white">
                {user?.username?.substring(0, 2).toUpperCase() || "US"}
              </div>
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-white">{user?.username || "User"}</p>
              <p className="truncate text-xs text-slate-500">{user?.role || "Analyst"}</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}