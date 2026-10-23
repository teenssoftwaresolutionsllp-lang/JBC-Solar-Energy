"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  SunMedium,
  CheckCircle2,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please provide both email address and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          remember,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid credentials.");
      }

      setSuccess(true);
      // Navigate to dashboard
      setTimeout(() => {
        router.push("/admin/dashboard");
        router.refresh();
      }, 500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to sign in. Please verify your credentials.");
      }
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError(null);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#070b13] overflow-hidden select-none">
      {/* Background Solar Gradients */}
      <div className="absolute top-0 -left-40 h-[500px] w-[500px] rounded-full bg-[#f36a26]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 h-[500px] w-[500px] rounded-full bg-[#0070ba]/10 blur-[130px] pointer-events-none" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Top Logo and Tagline */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md hover:border-slate-700 transition-all"
          >
            <Image
              src="/images/logo.png"
              alt="JBC Solar Energy"
              width={160}
              height={50}
              className="h-9 w-auto object-contain brightness-110"
              priority
            />
          </Link>
          <div className="mt-4 flex items-center justify-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              Administrator Control Center
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Sign In to Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Secure login for administrators, operations & solar technical consultants.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-400 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Flash */}
          {success && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-400 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Success! Redirecting to JBC Solar Dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jbcsolar.com"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#f36a26] focus:ring-1 focus:ring-[#f36a26] focus:outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-slate-300"
                >
                  Password
                </label>
                <span className="text-[11px] text-slate-500">
                  Role authenticated
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:border-[#f36a26] focus:ring-1 focus:ring-[#f36a26] focus:outline-hidden transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Options */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-[#f36a26] focus:ring-0 cursor-pointer accent-[#f36a26]"
                />
                <span className="text-xs text-slate-300">Keep me logged in</span>
              </label>

              <span className="text-xs text-slate-500">256-bit Encrypted</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f36a26] via-[#e05514] to-[#f36a26] bg-[length:200%_auto] py-3.5 px-4 text-sm font-bold text-white shadow-xl shadow-orange-500/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Credentials Pill Buttons for Testing */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-400" />
                Quick Test Credentials
              </span>
              <span className="text-[10px] text-slate-500">1-Click Auto Fill</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("admin@jbcsolar.com", "Admin@123")}
                className="flex flex-col items-start p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-amber-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Super Admin
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 truncate w-full">
                  admin@jbcsolar.com
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  PW: Admin@123
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials("rajiv.s@jbcsolar.com", "Subadmin@123")}
                className="flex flex-col items-start p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-blue-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                  <SunMedium className="h-3.5 w-3.5" />
                  Subadmin (Ops)
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 truncate w-full">
                  rajiv.s@jbcsolar.com
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  PW: Subadmin@123
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Back to Public Website */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Return to Public JBC Solar Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
