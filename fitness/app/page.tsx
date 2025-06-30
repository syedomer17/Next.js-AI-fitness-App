"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const DEFAULT_AVATAR =
  "https://play-lh.googleusercontent.com/nV5JHE9tyyqNcVqh0JLVGoV2ldpAqC8htiBpsbjqxATjXQnpNTKgU99B-euShOJPu-8";

export default function HomePage() {
  const { data: session, status } = useSession();
  // Initialize avatarUrl once from session or default
  const [avatarUrl, setAvatarUrl] = useState<string>(
    () => session?.user?.image || DEFAULT_AVATAR
  );
  const [uploading, setUploading] = useState(false);

  // Update avatarUrl only if it is still default and session image exists
  useEffect(() => {
    if (
      (!avatarUrl || avatarUrl === DEFAULT_AVATAR) &&
      session?.user?.image &&
      session.user.image.length > 10
    ) {
      setAvatarUrl(session.user.image);
    }
  }, [session, avatarUrl]);

  if (status === "loading") {
    return (
      <div className="text-center mt-20 text-gray-600 text-lg animate-pulse">
        Loading...
      </div>
    );
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64data = reader.result;

      setUploading(true);
      try {
        const res = await fetch("/api/user/avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: base64data }),
        });

        const data = await res.json();

        if (res.ok) {
          toast.success("✅ Avatar updated!");
          if (data.imageUrl) {
            setAvatarUrl(data.imageUrl); // update avatar instantly and persist in state
          }
          await signIn(); // refresh NextAuth session with updated avatar
        } else {
          toast.error("❌ Failed to update avatar: " + data.message);
        }
      } catch {
        toast.error("❌ Error uploading avatar.");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex items-center justify-center px-4">
      <ToastContainer position="top-right" autoClose={2500} />
      <motion.main
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-2xl text-center"
      >
        {session ? (
          <>
            <motion.h1
              className="text-3xl font-extrabold text-gray-800 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome, {session.user?.name}!
            </motion.h1>

            <p className="text-gray-500 mb-4">{session.user?.email}</p>

            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-blue-400 shadow-md"
              >
                <Image
                  key={avatarUrl}
                  src={avatarUrl}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="mt-4 mb-6 text-sm text-gray-700 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />

            <Link
              href="/workout-planner"
              className="block w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl mb-3 transition-all duration-300 shadow-md"
            >
              Go to Workout Planner
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="block w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all duration-300 shadow-md"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
              You're not logged in
            </h1>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 shadow-md"
            >
              Go to Login
            </Link>
          </>
        )}
      </motion.main>
    </div>
  );
}
