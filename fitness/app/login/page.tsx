'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>('login');
  const [loading, setLoading] = useState(false);

  // For login
  const [form, setForm] = useState({ email: '', password: '' });

  // For forgot password
  const [forgotEmail, setForgotEmail] = useState('');

  // For reset password
  const [resetPassword, setResetPassword] = useState({ newPassword: '', confirmPassword: '' });
  const [resetEmail, setResetEmail] = useState(''); // store email after forgot

  useEffect(() => {
    gsap.set('.form-container', { opacity: 0, y: -100 });
    gsap.to('.form-container', {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out',
    });
  }, [mode]);

  // Login handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    setLoading(false);

    if (res?.ok) {
      router.push('/');
    } else {
      alert(res?.error || 'Login failed');
    }
  };

  // Forgot password submit (send OTP or just proceed to reset)
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      alert('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        alert('You can now set your new password.');
        setResetEmail(forgotEmail); // save email for reset
        setMode('reset');
      } else {
        alert(data.error || 'Failed to proceed');
      }
    } catch {
      setLoading(false);
      alert('Something went wrong');
    }
  };

  // Reset password handlers
  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setResetPassword({ ...resetPassword, [e.target.name]: e.target.value });

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = resetPassword;

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    if (!resetEmail) {
      alert('Email missing. Please enter your email first.');
      setMode('forgot');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, newPassword }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        alert('Password changed successfully! Please login.');
        setMode('login');
        setResetEmail('');
        setResetPassword({ newPassword: '', confirmPassword: '' });
        setForgotEmail('');
      } else {
        alert(data.error || 'Failed to reset password');
      }
    } catch {
      setLoading(false);
      alert('Something went wrong');
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
          {mode === 'login' && (
            <>
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
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="flex items-center my-4">
                <hr className="flex-1 border-white/30" />
                <span className="px-3">OR</span>
                <hr className="flex-1 border-white/30" />
              </div>

              <button
                type="button"
                onClick={() => signIn('github', { callbackUrl: '/' })}
                className="w-full bg-black py-3 rounded-lg shadow-lg hover:bg-gray-900 transition duration-300 mb-2"
              >
                Continue with GitHub
              </button>

              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="w-full bg-red-600 py-3 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
              >
                Continue with Google
              </button>

              <p className="mt-4 text-center">
                <button
                  onClick={() => setMode('forgot')}
                  className="text-blue-300 underline"
                  type="button"
                >
                  Forgot Password?
                </button>
              </p>

              <p className="mt-2 text-center">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-300 underline">
                  Sign up here
                </Link>
              </p>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block">Enter your email to reset password</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="Email"
                    className="w-full p-3 border border-white/30 bg-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                >
                  {loading ? 'Sending...' : 'Proceed to Reset'}
                </button>
              </form>

              <p className="mt-4 text-center">
                Remembered your password?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-blue-300 underline"
                  type="button"
                >
                  Login here
                </button>
              </p>
            </>
          )}

          {mode === 'reset' && (
            <>
              <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={resetPassword.newPassword}
                    onChange={handleResetChange}
                    required
                    placeholder="New Password"
                    className="w-full p-3 border border-white/30 bg-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={resetPassword.confirmPassword}
                    onChange={handleResetChange}
                    required
                    placeholder="Confirm New Password"
                    className="w-full p-3 border border-white/30 bg-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 py-3 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
