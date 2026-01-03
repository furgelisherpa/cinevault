"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
    currentPassword: "",
  });

  const [updating, setUpdating] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentPassword) {
      return showToast("Current password is required to save changes", "error");
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      return showToast("Passwords do not match", "error");
    }

    setUpdating(true);
    try {
      const updateData: any = {
        currentPassword: formData.currentPassword,
      };
      if (formData.username !== user.username)
        updateData.username = formData.username;
      if (formData.email !== user.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;

      if (Object.keys(updateData).length === 1) {
        showToast("No changes detected", "info");
        setUpdating(false);
        return;
      }

      await updateProfile(updateData);
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
        currentPassword: "",
      }));
    } catch (error) {
      // Toast handled in AuthContext
    } finally {
      setUpdating(false);
    }
  };

  return (
    <main className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            Account Settings
          </h1>
          <p className="text-zinc-400">
            Manage your profile and security preferences.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Security Verification Section */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm ring-1 ring-white/5 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Security Verification
            </h2>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                Current Password
              </label>
              <input
                type="password"
                required
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all focus:ring-1 focus:ring-white/10"
                placeholder="Required to save any changes"
              />
              <p className="text-xs text-zinc-500 mt-2">
                To update your profile, we need to confirm it&apos;s really you.
              </p>
            </div>
          </div>

          {/* Profile Section */}
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6">
              Personal Information
            </h2>
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Your username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6">
              Change Password
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Only fill these if you want to set a new password.
            </p>
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={updating}
              className={`px-8 py-3 bg-white text-black font-bold rounded-xl shadow-lg shadow-white/5 transition-all ${
                updating
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-zinc-200 active:scale-95 hover:shadow-white/10"
              }`}
            >
              {updating ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
