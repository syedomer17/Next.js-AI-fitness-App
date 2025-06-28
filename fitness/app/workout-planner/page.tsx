"use client";

import React, { useState, useEffect, useLayoutEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaSpinner, FaSignOutAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import debounce from "lodash.debounce";
import { signOut } from "next-auth/react";

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

    if (!goal || !planType || !height || !weight || !gender || !injuries) {
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
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 p-4">
        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => signOut()}
          className="absolute top-6 right-6 flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          <FaSignOutAlt />
          Logout
        </motion.button>

        <motion.div
          className="form-container relative w-full max-w-lg p-8 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Workout Planner
          </motion.h2>

          <form className="space-y-5" onSubmit={handleGeneratePlan}>
            {[
              {
                label: "What is your fitness goal?",
                type: "select",
                value: goal,
                onChange: handleChange(setGoal, "goal"),
                options: [
                  "Muscle Gain",
                  "Weight Loss",
                  "Strength Training",
                  "Endurance & Cardio",
                  "Mobility & Flexibility",
                  "CrossFit / HIIT",
                  "Calisthenics",
                  "Rehabilitation & Recovery",
                  "Senior Fitness",
                ],
                placeholder: "Select a goal",
              },
              {
                label: "Select a workout type",
                type: "select",
                value: planType,
                onChange: handleChange(setPlanType, "planType"),
                options: ["Home Workout", "Gym Workout", "Cardio Training"],
                placeholder: "Choose a workout plan",
              },
              {
                label: "Height (cm)",
                type: "input",
                value: height,
                onChange: handleChange(setHeight, "height"),
                placeholder: "Enter your height in cm",
                inputType: "number",
              },
              {
                label: "Weight (kg)",
                type: "input",
                value: weight,
                onChange: handleChange(setWeight, "weight"),
                placeholder: "Enter your weight in kg",
                inputType: "number",
              },
              {
                label: "Any Allergies?",
                type: "input",
                value: allergy,
                onChange: handleChange(setAllergy, "allergy"),
                placeholder: "List any allergies (optional)",
              },
              {
                label: "Gender",
                type: "select",
                value: gender,
                onChange: handleChange(setGender, "gender"),
                options: ["Male", "Female", "Non-Binary", "Other"],
                placeholder: "Select your gender",
              },
              {
                label: "Injuries (if any)",
                type: "input",
                value: injuries,
                onChange: handleChange(setInjuries, "injuries"),
                placeholder: "List any injuries (optional)",
              },
            ].map((field, idx) => (
              <div key={idx}>
                <label className="block text-sm font-semibold text-gray-200 mb-1">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-pink-400 text-white transition hover:bg-gray-700"
                    value={field.value}
                    onChange={field.onChange}
                    required={field.label !== "Any Allergies?"}
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options!.map((opt) => (
                      <option key={opt} value={opt.toLowerCase().replace(/ /g, "_")}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.inputType || "text"}
                    className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-pink-400 text-white transition hover:bg-gray-700"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={field.placeholder}
                    required={field.label !== "Any Allergies?"}
                  />
                )}
              </div>
            ))}

            <motion.button
              whileHover={{
                scale: loading ? 1 : 1.05,
                boxShadow: loading ? "none" : "0 0 20px #facc15",
              }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              type="submit"
              disabled={loading}
              className={`w-full p-3 mt-4 rounded-lg font-semibold transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
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
