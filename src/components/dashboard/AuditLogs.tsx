"use client";

import { useEffect, useState } from "react";
import { X, User, ShieldAlert, FileCheck, RefreshCw, GitCommit } from "lucide-react"; // Added GitCommit icon
import clsx from "clsx";
import { reconService } from "@/services/recon-service";
import { Skeleton } from "@/app/(dashboard)/results/page";
 // <--- Import Service

interface AuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: string | null;
}

export default function AuditDrawer({ isOpen, onClose, recordId }: AuditDrawerProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && recordId) {
      loadLogs();
    }
  }, [isOpen, recordId]);

  const loadLogs = async () => {
    if (!recordId) return;
    setLoading(true);
    setError("");
    try {
      // 1. CALL THE API
      const data = await reconService.getAuditLogs(recordId);
      setLogs(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={clsx(
          "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={clsx(
          "fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-white/10 bg-slate-900/95 shadow-2xl transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6 bg-slate-900">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <GitCommit className="text-indigo-500" /> Audit Trail
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">ID: {recordId}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-85px)] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          
          {loading ? (
             <div className="space-y-6">
               {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
             </div>
          ) : error ? (
            <div className="text-rose-400 text-center mt-10">{error}</div>
          ) : (
            <div className="relative space-y-8 pl-2">
              {/* Vertical Connector Line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-slate-800" />

              {logs.map((log, index) => (
                <div key={log.id} className="relative flex gap-5 animate-in slide-in-from-right-4 fade-in duration-300">
                  
                  {/* Icon */}
                  <div className={clsx(
                    "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-slate-900",
                    log.type === "SYSTEM" ? "border-blue-500/30 text-blue-400" : "border-amber-500/30 text-amber-400"
                  )}>
                    {log.type === "SYSTEM" ? <RefreshCw size={16} /> : <User size={16} />}
                  </div>

                  {/* Card */}
                  <div className="flex-1 rounded-xl border border-white/5 bg-white/5 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-semibold text-white">{log.action}</h4>
                      {/* Note: In real app, use date-fns to format log.time */}
                      <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                        {new Date(log.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>

                    {/* --- THE DIFF SECTION (Old vs New) --- */}
                    {(log.oldValue || log.newValue) && (
                       <div className="mt-3 mb-3 grid grid-cols-2 gap-0 text-xs rounded-lg overflow-hidden border border-white/10">
                          {/* Old */}
                          <div className="bg-rose-500/5 p-2 border-r border-white/10">
                            <span className="block text-[10px] uppercase text-rose-400/70 font-bold mb-1">Was</span>
                            <div className="text-slate-300 font-mono break-all">
                               {log.oldValue?.status || "-"}
                            </div>
                          </div>
                          {/* New */}
                          <div className="bg-emerald-500/5 p-2">
                            <span className="block text-[10px] uppercase text-emerald-400/70 font-bold mb-1">Now</span>
                            <div className="text-white font-mono break-all">
                               {log.newValue?.status || "-"}
                            </div>
                          </div>
                       </div>
                    )}

                    {/* Metadata Footer */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2">
                         <span className="text-xs text-slate-500">{log.user}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {log.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}