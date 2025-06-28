'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";

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
    return <div className="text-center text-white">Loading session...</div>;
  }

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
        <div className="w-full max-w-5xl flex justify-between items-center p-4">
          <h1 className="text-yellow-400 text-2xl font-bold">Your Workout Plan</h1>
          <button
            onClick={() => router.push("/workout-planner")}
            className="bg-yellow-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-yellow-600 transition"
          >
            Back to Planner
          </button>
        </div>

        <motion.div
          className="plan-container max-w-5xl w-full bg-gray-800 text-white p-8 rounded-2xl shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <pre className="whitespace-pre-wrap break-words">{workoutPlan}</pre>
        </motion.div>

        <button
          onClick={sendPlan}
          disabled={loading}
          className={`mt-6 w-full max-w-5xl py-3 rounded-lg font-semibold text-lg transition ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Sending..." : "Send Plan to Email"}
        </button>
      </div>
    </>
  );
}
