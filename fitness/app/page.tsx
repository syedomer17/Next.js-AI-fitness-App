'use client';

import { useSession, signOut } from 'next-auth/react';

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="text-center mt-20 text-gray-600">Loading...</div>;
  }

  return (
    <main className="max-w-2xl mx-auto mt-20 p-6 text-center border rounded shadow">
      {session ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Welcome, {session.user?.name}!</h1>
          <p className="mb-4">Email: {session.user?.email}</p>
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="Avatar"
              className="mx-auto rounded-full w-24 h-24 mb-4"
            />
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">You are not logged in</h1>
          <a
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded inline-block"
          >
            Go to Login
          </a>
        </>
      )}
    </main>
  );
}
