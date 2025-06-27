'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState('');
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (res.ok) {
      alert('Email verified successfully.');
      router.push('/login');
    } else {
      alert(data.error || 'Verification failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Verify Email</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Verify
        </button>
      </form>
    </div>
  );
}
