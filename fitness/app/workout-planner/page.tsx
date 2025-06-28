'use client';

import React, { useState, useEffect, useLayoutEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import debounce from "lodash.debounce";

export default function WorkoutPlanner() {
  const router = useRouter();

  const [goal, setGoal] = useState<string>("");
  const [planType, setPlanType] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [allergy, setAllergy] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [injuries, setInjuries] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadUserData() {
      try {
        const res = await axios.get("/api/user/workout-data");
        if (res.data) {
          const data = res.data.workoutData || {};
          setGoal(data.goal || "");
          setPlanType(data.planType || "");
          setHeight(data.height || "");
          setWeight(data.weight || "");
          setAllergy(data.allergy || "");
          setGender(data.gender || "");
          setInjuries(data.injuries || "");
        }
      } catch {
        toast.error("Failed to load workout data.");
      }
    }
    loadUserData();
  }, []);

  // debounce update function
  const updateBackend = debounce(async (field: string, value: string) => {
    try {
      await axios.patch("/api/user/workout-data", { [field]: value });
    } catch {
      toast.error("Failed to save changes.");
    }
  }, 700);

  function handleChange(
    setter: React.Dispatch<React.SetStateAction<string>>,
    field: string
  ) {
    return (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      setter(e.target.value);
      updateBackend(field, e.target.value);
    };
  }

  async function handleGeneratePlan(e: React.FormEvent) {
    e.preventDefault();

    if (
      !goal ||
      !planType ||
      !height ||
      !weight ||
      !gender ||
      !injuries
    ) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/user/generate-plan");
      if (res.data?.workoutPlan) {
        router.push("/WorkoutPlanPage");
      } else {
        toast.error("Failed to generate workout plan.");
      }
    } catch {
      toast.error("Failed to generate workout plan.");
    } finally {
      setLoading(false);
    }
  }

  useLayoutEffect(() => {
    gsap.set(".form-container", { opacity: 0, y: -20 });
    gsap.to(".form-container", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    });
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-purple-900 to-blue-800 p-6">
        <motion.div
          className="form-container w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-xl text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-6">Workout Planner</h2>

          <form className="space-y-4" onSubmit={handleGeneratePlan}>
            <div>
              <label className="block text-gray-300">What is your fitness goal?</label>
              <select
                className="w-full p-3 mt-1 bg-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white"
                value={goal}
                onChange={handleChange(setGoal, "goal")}
                required
              >
                <option value="">Select a goal</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="strength_training">Strength Training</option>
                <option value="endurance">Endurance & Cardio</option>
                <option value="flexibility">Mobility & Flexibility</option>
                <option value="crossfit">CrossFit / HIIT</option>
                <option value="calisthenics">Calisthenics</option>
                <option value="rehab">Rehabilitation & Recovery</option>
                <option value="senior_fitness">Senior Fitness</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300">Select a workout type</label>
              <select
                className="w-full p-3 mt-1 bg-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white"
                value={planType}
                onChange={handleChange(setPlanType, "planType")}
                required
              >
                <option value="">Choose a workout plan</option>
                <option value="home">Home Workout</option>
                <option value="gym">Gym Workout</option>
                <option value="cardio">Cardio Training</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300">Height (cm)</label>
              <input
                type="number"
                className="w-full p-3 mt-1 bg-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white"
                value={height}
                onChange={handleChange(setHeight, "height")}
                placeholder="Enter your height in cm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300">Weight (kg)</label>
              <input
                type="number"
                className="w-full p-3 mt-1 bg-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white"
                value={weight}
                onChange={handleChange(setWeight, "weight")}
                placeholder="Enter your weight in kg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300">Any Allergies?</label>
              <input
                type="text"
                className="w-full p-3 mt-1 bg-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white"
                value={allergy}
                onChange={handleChange(setAllergy, "allergy")}
                placeholder="List any allergies (optional)"
              />
            </div>

            <div>
              <label className="block text-gray-300">Gender</label>
              <select
                className="w-full p-3 mt-1 bg-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white"
                value={gender}
                onChange={handleChange(setGender, "gender")}
                required
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non_binary">Non-Binary</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300">Injuries (if any)</label>
              <input
                type="text"
                className="w-full p-3 mt-1 bg-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white"
                value={injuries}
                onChange={handleChange(setInjuries, "injuries")}
                placeholder="List any injuries (optional)"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              type="submit"
              disabled={loading}
              className={`w-full p-3 mt-4 rounded-lg font-semibold transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
              }`}
            >
              {loading ? (
                <span className="flex justify-center items-center">
                  <FaSpinner className="animate-spin mr-2" /> Generating...
                </span>
              ) : (
                "Generate Plan"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
