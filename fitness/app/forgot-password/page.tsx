'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [form, setForm] = useState({ email: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (res.ok) {
        alert('Password changed successfully.');
        router.push('/login');
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (err) {
      alert('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 border-2 border-white/30 p-6 rounded-lg backdrop-blur-md w-full max-w-md text-white space-y-4 shadow-lg shadow-white/20"
      >
        <h2 className="text-2xl font-semibold text-center">Reset Password</h2>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            required
            onChange={handleChange}
            className="w-full mt-1 p-3 rounded bg-transparent border border-white/30 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            required
            onChange={handleChange}
            className="w-full mt-1 p-3 rounded bg-transparent border border-white/30 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
