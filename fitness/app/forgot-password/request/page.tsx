"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function RequestOtpPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP sent to your email.");
        router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(data.error || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 border-2 border-white/30 p-8 rounded-2xl backdrop-blur-md w-full max-w-lg text-white space-y-6 shadow-xl shadow-black/30"
      >
        <h2 className="text-3xl font-bold text-center">Forgot Password</h2>
        <p className="text-center text-white/80">
          Enter your email address and we’ll send you an OTP to reset your password.
        </p>

        <div>
          <label className="block mb-1 font-medium">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full mt-1 p-3 rounded-lg bg-transparent border border-white/30 placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </main>
  );
}
