"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...form }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successfully.");
        router.push("/login");
      } else {
        toast.error(data.error || "Reset failed.");
      }
    } catch (error) {
      toast.error("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 px-4">
      <div className="w-full max-w-md bg-white/10 border-2 border-white/30 p-8 rounded-2xl shadow-xl backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Reset Your Password
        </h2>
        <p className="text-center text-white/80 mb-6">
          Please enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-white">New Password</label>
            <input
              type="password"
              name="newPassword"
              required
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full p-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block mb-1 text-white">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full p-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
