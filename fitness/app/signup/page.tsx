'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (res.ok) {
      alert('Signup successful. Check email for OTP.');
      router.push('/verify-email?email=' + form.email);
    } else {
      alert(data.error || 'Signup failed');
    }
    setLoading(false);
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
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
