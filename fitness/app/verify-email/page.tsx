"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);

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
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp: enteredOtp }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Email verified successfully!");
      router.push("/login");
    } else {
      toast.error(data.error || "Verification failed");
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResending(true);
    try {
      const res = await fetch("/api/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP resent successfully");
        setCountdown(60);
        setOtp(Array(6).fill(""));
        inputsRef.current[0]?.focus();
      } else {
        toast.error(data.error || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-blue-700 px-4">
      <div className="w-full max-w-md bg-white/10 border-2 border-white/30 p-6 rounded-lg shadow-lg backdrop-blur-md shadow-white/30">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Enter OTP sent to {email}
        </h2>

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
                className="w-12 h-12 text-center text-xl rounded-lg border border-white/30 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 text-lg font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            Verify
          </button>
        </form>

        <div className="mt-4 text-center text-white">
          {countdown > 0 ? (
            <p>
              Resend OTP in <span className="font-semibold">{countdown}s</span>
            </p>
          ) : (
            <button
              disabled={resending}
              onClick={handleResend}
              className="underline hover:text-blue-400"
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
