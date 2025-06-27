'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.ok) {
      router.push('/'); // ✅ redirect to homepage after login
    } else {
      alert(res?.error || 'Login failed');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        alert('Signup successful! Please verify your email.');
        router.push(`/verify-email?email=${form.email}`);
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (error) {
      alert('Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      {isLogin ? (
        <>
          <h2 className="text-xl font-bold mb-4">Login</h2>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Login
            </button>
          </form>
          <div className="my-4 text-center text-gray-500">or</div>
            <button
        onClick={() => signIn('github', { callbackUrl: '/' })}
        className="w-full bg-black text-white px-4 py-2 rounded mb-2"
      >
        Sign in with GitHub
      </button>

      <button
        onClick={() => signIn('google', { callbackUrl: '/' })}
        className="w-full bg-red-600 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
          <p className="mt-4 text-center">
            Don't have an account?{' '}
            <button
              onClick={() => setIsLogin(false)}
              className="text-blue-600 underline"
            >
              Sign up here
            </button>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Sign Up</h2>
          <form onSubmit={handleSignup} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center">
            Already have an account?{' '}
            <button
              onClick={() => setIsLogin(true)}
              className="text-blue-600 underline"
            >
              Login here
            </button>
          </p>
        </>
      )}
    </div>
  );
}
