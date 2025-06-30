"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { FaPaperPlane } from "react-icons/fa";

export default function WorkoutPlanPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [workoutPlan, setWorkoutPlan] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchWorkoutPlan() {
      try {
        const res = await axios.get("/api/user/workout-plan");
        if (res.data?.workoutPlan) {
          setWorkoutPlan(res.data.workoutPlan);
          gsap.fromTo(
            ".plan-container",
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
          );
        } else {
          toast.error("No workout plan found. Please generate one.");
          router.push("/workout-planner");
        }
      } catch {
        toast.error("Failed to load workout plan.");
        router.push("/workout-planner");
      }
    }

    fetchWorkoutPlan();
  }, [router]);

  async function sendPlan() {
    if (!workoutPlan) {
      toast.error("No workout plan available to send.");
      return;
    }

    if (!session?.user?.email) {
      toast.error("User email not found.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/user/send-plan", {
        email: session.user.email,
        plan: workoutPlan,
      });
      toast.success(res.data.message || "Workout plan sent successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send workout plan.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 text-white text-lg">
        Loading session...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 p-6">
      <motion.div
        className="w-full max-w-5xl flex flex-col md:flex-row md:justify-between items-center gap-4 p-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
          Your Workout Plan
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/workout-planner")}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold transition"
        >
          Back to Planner
        </motion.button>
      </motion.div>

      <motion.div
        className="plan-container max-w-5xl w-full bg-white/10 backdrop-blur-md text-white p-8 rounded-3xl shadow-2xl mt-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <pre className="whitespace-pre-wrap break-words font-mono text-base">
          {workoutPlan}
        </pre>
      </motion.div>

      <motion.button
        whileHover={{
          scale: loading ? 1 : 1.03,
          boxShadow: loading ? "none" : "0 0 20px #3b82f6",
        }}
        whileTap={{ scale: loading ? 1 : 0.97 }}
        onClick={sendPlan}
        disabled={loading}
        className={`mt-6 w-full max-w-5xl py-3 rounded-lg font-semibold text-lg transition flex items-center justify-center ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {loading ? (
          "Sending..."
        ) : (
          <>
            <FaPaperPlane className="mr-2" />
            Send Plan to Email
          </>
        )}
      </motion.button>
    </div>
  );
}
