import { FileText, Eye } from "lucide-react";
import clsx from "clsx";
import { Skeleton } from "@/app/(dashboard)/results/page";
import { cn } from "@/lib/utils";

// --- TYPES ---
export interface ReconResult {
  id: string;
  uploadedTxId: string;
  uploadedAmount: number;
  status: "MATCHED" | "PARTIAL_MATCH" | "UNMATCHED" | "DUPLICATE";
  variance: number;
  systemRecord?: {
    id: string;
    transactionId: string;
    amount: number;
  } | null;
}

interface ResultsTableProps {
  data: ReconResult[];
  loading: boolean;
}

// --- HELPER: STATUS BADGE ---
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

export default function ResultsTable({ data, loading }: ResultsTableProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          {/* HEADER */}
          <thead className="bg-slate-900/50 text-slate-400 font-medium uppercase tracking-wider text-xs border-b border-white/5">
            <tr>
              <th className="px-6 py-4">Transaction Details</th>
              <th className="px-6 py-4 text-right bg-indigo-500/5">Uploaded Amt</th>
              <th className="px-6 py-4 text-right bg-emerald-500/5">System Amt</th>
              <th className="px-6 py-4 text-right">Variance</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-white/5">
            
            {/* SCENARIO 1: LOADING */}
            {loading && (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-20 ml-auto" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-20 ml-auto" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-12 ml-auto" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-24 mx-auto" /></td>
                </tr>
              ))
            )}

            {/* SCENARIO 2: EMPTY DATA (Not Loading) */}
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <FileText className="mx-auto h-12 w-12 mb-3 opacity-20" />
                  <p>No transactions found matching your filters.</p>
                </td>
              </tr>
            )}

            {/* SCENARIO 3: DATA EXISTS */}
            {!loading && data.map((row) => (
              <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                
                {/* ID Column */}
                <td className="px-6 py-4">
                  <div className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                    {row.uploadedTxId}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Ref: {row.systemRecord?.transactionId || "N/A"}
                  </div>
                </td>

                {/* Uploaded Amount */}
                <td className="px-6 py-4 text-right font-mono text-indigo-200 bg-indigo-500/5">
                  ${Number(row.uploadedAmount).toFixed(2)}
                </td>

                {/* System Amount */}
                <td className="px-6 py-4 text-right font-mono text-emerald-200 bg-emerald-500/5">
                  {row.systemRecord ? (
                    `$${Number(row.systemRecord.amount).toFixed(2)}`
                  ) : (
                    <span className="text-slate-600 italic">Not Found</span>
                  )}
                </td>

                {/* Variance */}
                <td className={cn(
                  "px-6 py-4 text-right font-mono font-bold",
                  row.variance === 0 ? "text-slate-600" : 
                  Math.abs(row.variance) > 0 ? "text-rose-400" : "text-emerald-400"
                )}>
                   {row.variance === 0 ? "---" : `${row.variance > 0 ? "+" : ""}${row.variance.toFixed(2)}`}
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}