"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Added missing imports for Next.js hooks
import { useAuth } from "@/context/AuthContext";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, register } = useAuth();

  const initialMode =
    searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login({ email: formData.email, password: formData.password });
        router.push("/");
      } else {
        await register(formData);
        setMode("login");
        setError(""); // Clear any previous errors
      }
    } catch (err: unknown) {
      const error = err as Error;
      const msg =
        error.message === "Invalid credentials"
          ? "Invalid username or password"
          : error.message || "Authentication failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col pt-24 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto relative group">
        {/* Premium Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

        <div className="relative bg-black border border-zinc-800 p-10 rounded-2xl shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-semibold text-white tracking-tighter mb-2 uppercase">
              {mode === "login" ? "Sign In" : "Join Us"}
            </h2>
            <div className="h-1 w-12 bg-white mx-auto rounded-full" />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs font-semibold uppercase tracking-widest mb-8 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 ml-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-white transition-all placeholder-zinc-700 font-medium"
                  placeholder="Select a username"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-white transition-all placeholder-zinc-700 font-medium"
                placeholder="name@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-white transition-all placeholder-zinc-700 font-medium"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 mt-4 active:scale-[0.98] uppercase tracking-[0.2em] text-xs shadow-lg shadow-white/5"
            >
              {loading
                ? "Authenticating..."
                : mode === "login"
                ? "Sign In"
                : "Get Started"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
              {mode === "login" ? "New to CineVault?" : "Already a member?"}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-white hover:underline ml-2"
              >
                {mode === "login" ? "Create Account" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginForm />
    </Suspense>
  );
}
