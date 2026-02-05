"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Files, 
  Calendar,
  Filter
} from "lucide-react";
import clsx from "clsx";
import { Skeleton } from "./results/page";
import { reconService } from "@/services/recon-service";


// --- TYPES ---
interface DashboardStats {
  total: number;
  matched: number;
  unmatched: number;
  partial: number;
  accuracy: number;
  dailyVolume: { date: string; total: number; matched: number }[];
}

// --- MOCK DATA (Fallback if API fails) ---
const MOCK_DATA: DashboardStats = {
  total: 12543,
  matched: 10850,
  unmatched: 1240,
  partial: 453,
  accuracy: 86.5,
  dailyVolume: [
    { date: "Mon", total: 4000, matched: 3200 },
    { date: "Tue", total: 3000, matched: 2800 },
    { date: "Wed", total: 2000, matched: 1900 },
    { date: "Thu", total: 2780, matched: 2500 },
    { date: "Fri", total: 1890, matched: 1100 },
    { date: "Sat", total: 2390, matched: 2100 },
    { date: "Sun", total: 3490, matched: 3300 },
  ],
};

const CHART_COLORS = ["#10b981", "#f43f5e", "#f59e0b"]; // Emerald, Rose, Amber

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  // Inside Dashboard() component...

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        // 1. Fetch Real Data from Backend
        const realData = await reconService.getStats();

        // 2. Map Backend Response to Frontend State
        // Since backend doesn't provide daily volume yet, we keep the chart mocked
        setStats({
          total: realData.total,
          matched: realData.breakdown.matched,
          unmatched: realData.breakdown.unmatched,
          partial: realData.breakdown.partial,
          accuracy: Number(realData.accuracy), // Convert string "85.5" to number
          
          // MOCKING THE BAR CHART (Since backend doesn't give history yet)
          dailyVolume: [
            { date: "Mon", total: 4000, matched: 3200 },
            { date: "Tue", total: 3000, matched: 2800 },
            { date: "Wed", total: 2000, matched: 1900 },
            { date: "Thu", total: 2780, matched: 2500 },
            { date: "Fri", total: 1890, matched: 1100 },
          ]
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, [timeRange]); // We trigger this when filters change

// Update the pieData calculation
const pieData = stats ? [
    { name: "Matched", value: stats.matched },
    { name: "Unmatched", value: stats.unmatched },
    { name: "Partial", value: stats.partial },
    // You can add duplicates if you want to visualize them too
    // { name: "Duplicate", value: stats.total - (stats.matched + stats.unmatched + stats.partial) } 
  ] : [];

  return (
    <div className="space-y-6">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dashboard <span className="text-indigo-500">Overview</span>
          </h1>
          <p className="text-slate-400 text-sm">System performance and reconciliation metrics.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-white/5">
          {["24h", "7d", "30d", "All"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={clsx(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                timeRange === range
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* STAT CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Records" 
          value={stats?.total} 
          icon={Files} 
          color="blue" 
          loading={loading} 
        />
        <StatCard 
          title="Matched" 
          value={stats?.matched} 
          icon={CheckCircle2} 
          color="emerald" 
          loading={loading} 
          subtext={`${stats ? ((stats.matched / stats.total) * 100).toFixed(1) : 0}% success rate`}
        />
        <StatCard 
          title="Unmatched" 
          value={stats?.unmatched} 
          icon={AlertCircle} 
          color="rose" 
          loading={loading} 
          trend="up" // Mocking a trend
        />
        <StatCard 
          title="Accuracy" 
          value={stats?.accuracy ? `${stats.accuracy}%` : "0%"} 
          icon={Activity} 
          color="purple" 
          loading={loading} 
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: MAIN CHART (Activity) */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Reconciliation Volume</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Total</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Matched</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            {loading ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.dailyVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000}k`} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    itemStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="matched" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* RIGHT: DONUT CHART (Status) */}
        <div className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Status Breakdown</h3>
          <div className="h-[250px] w-full relative">
            {loading ? (
              <Skeleton className="h-full w-full rounded-full" />
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                  <p className="text-2xl font-bold text-white">{stats?.total.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">Total Txns</p>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUBCOMPONENT: STAT CARD ---
function StatCard({ title, value, icon: Icon, color, loading, subtext, trend }: any) {
  const colors: any = {
    blue: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <div className={clsx(
      "rounded-2xl p-6 border backdrop-blur-md transition-all duration-300 hover:translate-y-[-2px]",
      colors[color] || colors.blue
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
          {loading ? (
            <Skeleton className="h-8 w-24 bg-current opacity-20" />
          ) : (
            <h4 className="text-3xl font-bold tracking-tight">
              {typeof value === "number" ? value.toLocaleString() : value}
            </h4>
          )}
        </div>
        <div className={clsx("p-3 rounded-xl bg-white/5", colors[color].replace("border-", ""))}>
          <Icon size={24} />
        </div>
      </div>
      
      {/* Footer / Trend Info */}
      {(subtext || trend) && !loading && (
        <div className="mt-4 flex items-center text-xs font-medium">
          {trend === "up" && <ArrowUpRight size={14} className="mr-1" />}
          {trend === "down" && <ArrowDownRight size={14} className="mr-1" />}
          <span className="opacity-70">{subtext || "vs. last period"}</span>
        </div>
      )}
    </div>
  );
}