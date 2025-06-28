'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

const DEFAULT_AVATAR =
  'https://play-lh.googleusercontent.com/nV5JHE9tyyqNcVqh0JLVGoV2ldpAqC8htiBpsbjqxATjXQnpNTKgU99B-euShOJPu-8';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [uploading, setUploading] = useState(false);

  if (status === 'loading') {
    return <div className="text-center mt-20 text-gray-600">Loading...</div>;
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64data = reader.result;

      setUploading(true);
      try {
        const res = await fetch('/api/user/avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar: base64data }),
        });

        if (res.ok) {
          alert('Avatar updated! Refresh to see changes.');
        } else {
          alert('Failed to update avatar.');
        }
      } catch {
        alert('Error uploading avatar.');
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  }

  return (
    <main className="max-w-2xl mx-auto mt-20 p-6 text-center border rounded shadow bg-white">
      {session ? (
        <>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Welcome, {session.user?.name}!</h1>
          <p className="mb-4 text-gray-600">Email: {session.user?.email}</p>

          <img
            src={session.user?.image || DEFAULT_AVATAR}
            alt="Avatar"
            className="mx-auto rounded-full w-24 h-24 mb-4 border-4 border-yellow-400"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="mb-4 block mx-auto text-sm"
          />

          <Link
            href="/workout-planner"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700 transition"
          >
            Go to Workout Planner
          </Link>

          <br />

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">You are not logged in</h1>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded inline-block hover:bg-blue-700 transition"
          >
            Go to Login
          </Link>
        </>
      )}
    </main>
  );
}
