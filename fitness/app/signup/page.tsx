"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { FaGithub } from "react-icons/fa";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Signup successful! Check email for OTP.");
        router.push("/verify-email?email=" + form.email);
      } else {
        toast.error(data.error || "Signup failed.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="signup-form w-full max-w-md bg-white/10 border-2 border-white/30 p-6 rounded-lg shadow-lg backdrop-blur-md shadow-white/30">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name..."
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 border rounded-lg bg-transparent text-white border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email..."
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 border rounded-lg bg-transparent text-white border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password..."
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 border rounded-lg bg-transparent text-white border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-white/30"></div>
          <span className="mx-2 text-white/70 text-sm">OR</span>
          <div className="flex-grow h-px bg-white/30"></div>
        </div>

        {/* Social login buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300"
          >
            <FaGithub size={20} />
            Signup with GitHub
          </button>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition duration-300"
          >
            {/* Google G SVG */}
            <svg
              className="w-5 h-5"
              viewBox="0 0 533.5 544.3"
            >
              <path
                fill="#4285f4"
                d="M533.5 278.4c0-17.4-1.4-34.1-4-50.4H272v95.4h146.9c-6.3 34.1-25.1 62.9-53.6 82.1v68.3h86.7c50.8-46.7 81.5-115.5 81.5-195.4z"
              />
              <path
                fill="#34a853"
                d="M272 544.3c72.9 0 134-24.1 178.7-65.4l-86.7-68.3c-24 16.1-54.6 25.7-92 25.7-70.7 0-130.7-47.7-152.2-111.6H28.4v70.2c44.5 88.3 136.6 149.4 243.6 149.4z"
              />
              <path
                fill="#fbbc04"
                d="M119.8 324.7c-10.4-30.7-10.4-63.7 0-94.4V160H28.4c-43.3 85.5-43.3 187.8 0 273.3l91.4-70.6z"
              />
              <path
                fill="#ea4335"
                d="M272 107.4c39.7 0 75.2 13.6 103.2 40.5l77.1-77.1C405.9 24.4 344.9 0 272 0 165 0 72.9 61.1 28.4 149.4l91.4 70.6c21.5-63.9 81.5-112.6 152.2-112.6z"
              />
            </svg>
            Signup with Google
          </button>
        </div>
      </div>
    </div>
  );
}
