"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  FileText,
  RefreshCcw 
} from "lucide-react";
import clsx from "clsx";
import { token } from "../dashboard/stats/Stats";
import { fetchReconResults } from "@/src/app/recon/page";

// --- TYPES (Match your Prisma Schema) ---
export interface SystemRecord {
  id: string;
  transactionId: string;
  amount: number; // Decimal string from DB comes as number/string
  date: string;
}

export interface ReconResult {
  id: string;
  uploadedTxId: string;
  uploadedAmount: number;
  status: "MATCHED" | "PARTIAL_MATCH" | "UNMATCHED" | "DUPLICATE";
  variance: number;
  systemRecord?: SystemRecord | null; // Can be null if UNMATCHED
}

export interface ApiResponse {
  results: ReconResult[];
  total: number;
  pages: number;
  page: number;
}

export interface ResultsPageProps {
  data: ReconResult[];
  error: string;
  loading: boolean;
  page: number;
  totalPages: number;
  onRefresh: () => void;
  setPage: (n: number) => void;
  search: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
}



// --- COMPONENTS ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    MATCHED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
    PARTIAL_MATCH: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
    UNMATCHED: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
    DUPLICATE: "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]",
  };

  return (
    <span className={clsx("px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md whitespace-nowrap", styles[status] || styles.UNMATCHED)}>
      {status.replace("_", " ")}
    </span>
  );
};

export function ResultsPage({
  data,
  error,
  loading,
  page,
  totalPages,
  onRefresh,
  setPage,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: ResultsPageProps) {
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
          onClick={onRefresh} 
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors text-sm"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* FILTERS BAR */}
      <div className="mb-6 p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-xl shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search Transaction ID..." 
            value={search}
            onChange={(e) => {
                setSearch(e.target.value); 
                setPage(1); // Reset to page 1 on search
            }}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative w-full md:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <select 
            value={statusFilter}
            onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
            }}
            className="w-full appearance-none bg-slate-900/50 border border-slate-800 rounded-lg py-2.5 pl-10 pr-8 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="MATCHED">Matched</option>
            <option value="PARTIAL_MATCH">Partial Match</option>
            <option value="UNMATCHED">Unmatched</option>
            <option value="DUPLICATE">Duplicate</option>
          </select>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="rounded-xl border border-white/5 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 font-medium uppercase tracking-wider text-xs border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4 text-right bg-indigo-500/5">Uploaded Amount</th>
                <th className="px-6 py-4 text-right bg-emerald-500/5">System Amount</th>
                <th className="px-6 py-4 text-right">Variance</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                // Skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-800 rounded ml-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-800 rounded ml-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-800 rounded ml-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-800 rounded mx-auto"></div></td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <FileText className="mx-auto h-12 w-12 mb-3 opacity-20" />
                    No transactions found.
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                    
                    {/* Column 1: ID */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                        {row.uploadedTxId}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                         {/* Show Database ID if it exists, else 'Not Found' */}
                        Ref: {row.systemRecord?.transactionId || "N/A"}
                      </div>
                    </td>

                    {/* Column 2: Uploaded (CSV) */}
                    <td className="px-6 py-4 text-right font-mono text-indigo-200 bg-indigo-500/5">
                      ${Number(row.uploadedAmount).toFixed(2)}
                    </td>

                    {/* Column 3: System (DB) */}
                    <td className="px-6 py-4 text-right font-mono text-emerald-200 bg-emerald-500/5">
                      {row.systemRecord ? (
                        `$${Number(row.systemRecord.amount).toFixed(2)}`
                      ) : (
                        <span className="text-slate-600 italic">Not Found</span>
                      )}
                    </td>

                    {/* Column 4: Variance */}
                    <td className={clsx(
                      "px-6 py-4 text-right font-mono font-bold",
                      row.variance === 0 ? "text-slate-600" : 
                      Math.abs(row.variance) > 0 ? "text-rose-400" : "text-emerald-400"
                    )}>
                       {row.variance === 0 ? "---" : `${row.variance > 0 ? "+" : ""}${row.variance.toFixed(2)}`}
                    </td>

                    {/* Column 5: Status */}
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-slate-900/30">
          <span className="text-xs text-slate-500">
            Page <span className="text-white font-medium">{page}</span> of <span className="text-white font-medium">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
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

// Container to handle state, effects, and pass required props to ResultsPage
export default function ResultsPageContainer() {
  const [data, setData] = useState<ReconResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const doFetch = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetchReconResults({
      page,
      search,
      statusFilter,
      token,
      limit: 10,
    });
    setData(res.data);
    setTotalPages(res.totalPages);
    setError(res.error);
    setLoading(false);
  }, [page, search, statusFilter]);
  
  // Debounce fetch on search/filter/pagination
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      doFetch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [doFetch]);
  
  return (
    <ResultsPage
      data={data}
      error={error}
      loading={loading}
      page={page}
      totalPages={totalPages}
      onRefresh={doFetch}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
    />
  );
}