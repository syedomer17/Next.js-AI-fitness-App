"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { toast } from "react-hot-toast";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    gsap.set(".form-container", { opacity: 0, y: -100 });
    gsap.to(".form-container", {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    setLoading(false);

    if (res?.ok) {
      toast.success("Login successful!");
      router.push("/");
    } else {
      toast.error(res?.error || "Login failed");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-blue-700 p-6">
      <div className="form-container max-w-4xl w-full bg-white/10 shadow-lg rounded-2xl p-8 flex flex-col md:flex-row items-center border-2 border-white/30 backdrop-blur-md">
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            alt="Illustration"
            className="w-full"
          />
        </div>

        <div className="w-full md:w-1/2 text-white">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-white/30 bg-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-white/30 bg-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-1 border-white/30" />
            <span className="px-3">OR</span>
            <hr className="flex-1 border-white/30" />
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300"
            >
              <FaGithub size={20} />
              Login with GitHub
            </button>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition duration-300"
            >
              {/* Google SVG */}
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
              Login with Google
            </button>
          </div>

          <p className="mt-4 text-center">
            <Link href="/forgot-password/request" className="text-blue-300 underline">
              Forgot Password?
            </Link>
          </p>
          <p className="mt-2 text-center">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-300 underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
