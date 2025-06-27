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
    <div className="max-w-md mx-auto mt-20 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
