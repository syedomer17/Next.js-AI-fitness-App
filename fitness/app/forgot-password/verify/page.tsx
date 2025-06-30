"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      toast.error("Please enter a 6-digit OTP.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP verified. You can now reset your password.");
        router.push(`/forgot-password/reset?email=${encodeURIComponent(email!)}`);
      } else {
        toast.error(data.error || "Verification failed.");
      }
    } catch (error) {
      toast.error("Server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    try {
      const res = await fetch("/api/forgot-password/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("OTP resent successfully.");
        setOtp(Array(6).fill(""));
        setCountdown(60);
        inputsRef.current[0]?.focus();
      } else {
        toast.error(data.error || "Failed to resend OTP.");
      }
    } catch (error) {
      toast.error("Server error.");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-blue-700 px-4">
      <div className="w-full max-w-lg bg-white/10 border-2 border-white/30 p-8 rounded-2xl shadow-xl backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Verify OTP
        </h2>
        <p className="text-center text-white/80 mb-6">
          Enter the 6-digit code sent to <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                className="w-14 h-14 text-center text-2xl rounded-lg border border-white/30 bg-transparent text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 text-center text-white">
          {countdown > 0 ? (
            <p>
              Resend OTP in{" "}
              <span className="font-semibold">{countdown}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="underline hover:text-blue-400 transition"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
