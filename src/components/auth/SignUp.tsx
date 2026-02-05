"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowRight, User } from "lucide-react";

export default function SignUp() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "", username: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Call the register function from your Auth Context
      await register(form.username, form.email, form.password);
      // Note: redirection usually happens inside useAuth or via a router.push here on success
    } catch (err: any) {
      console.error(err);
      // Show a more helpful error for registration
      setError(err.response?.data?.message || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden bg-slate-950">

      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />

      <div className="z-10 w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create <span className="text-indigo-500">Account</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Join us to start reconciling your data.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase text-slate-500">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="johndoe"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase text-slate-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="john@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase text-slate-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign Up"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Link to Login */}
        <div className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}