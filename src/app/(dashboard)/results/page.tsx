"use client";

import ResultsTable from "@/components/dashboard/table-chart/table";
import { useReconResults } from "@/hooks/useReconResult";
import { cn } from "@/lib/utils";
import { Search, Filter, ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";

export default function ResultsPage() {
  // 1. Get everything we need from the Hook
  const { data, loading, totalPages, filters, setFilters, refresh } = useReconResults();

  // Helper to change page safely
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Reconciliation <span className="text-indigo-500">Data</span>
          </h1>
          <p className="text-slate-400 text-sm">Real-time comparison between Uploaded CSV and System Records.</p>
        </div>
        <button 
          onClick={refresh} 
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors text-sm"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* FILTERS BAR */}
      <div className="mb-6 p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-xl shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search Transaction ID..." 
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative w-full md:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <select 
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
            className="w-full appearance-none bg-slate-900/50 border border-slate-800 rounded-lg py-2.5 pl-10 pr-8 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="MATCHED">Matched</option>
            <option value="PARTIAL_MATCH">Partial Match</option>
            <option value="UNMATCHED">Unmatched</option>
            <option value="DUPLICATE">Duplicate</option>
          </select>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="flex flex-col gap-4">
        <ResultsTable data={data} loading={loading} />

        {/* --- PAGINATION CONTROLS (Implemented Here) --- */}
        <div className="flex items-center justify-between px-6 py-4 border border-white/5 bg-slate-900/30 rounded-xl backdrop-blur-md">
          <span className="text-xs text-slate-500">
            Page <span className="text-white font-medium">{filters.page}</span> of <span className="text-white font-medium">{totalPages}</span>
          </span>
          
          <div className="flex gap-2">
            <button 
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1 || loading}
              className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            <button 
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page === totalPages || loading}
              className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

interface SkeletonProps {
  className?: string;
  count?: number; // How many skeletons to render?
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse rounded bg-slate-800/50",
            className
          )}
        />
      ))}
    </>
  );
}