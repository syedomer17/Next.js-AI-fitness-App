import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; // adjust path
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY!;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.workoutData) {
      return NextResponse.json(
        { message: "Workout data not found. Please fill the form first." },
        { status: 400 }
      );
    }

    const {
      goal,
      planType,
      height,
      weight,
      allergy,
      gender,
      injuries,
    } = user.workoutData;

    if (
      !goal ||
      !planType ||
      !height ||
      !weight ||
      !gender ||
      !injuries ||
      allergy === undefined
    ) {
      return NextResponse.json(
        { message: "Please fill all required fields before generating a plan." },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Create a ${planType} workout plan for someone focused on ${goal}. Their height is ${height} cm, weight is ${weight} kg, allergies: ${allergy}, injuries: ${injuries}.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    let workoutPlan =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No workout plan generated.";

    workoutPlan = workoutPlan.replace(/\*/g, ""); // clean asterisks

    user.workoutPlan = workoutPlan;
    await user.save();

    return NextResponse.json({ workoutPlan });
  } catch (error) {
    console.error("POST generate-plan error:", error);
    return NextResponse.json(
      { message: "Failed to generate workout plan." },
      { status: 500 }
    );
  }
}
