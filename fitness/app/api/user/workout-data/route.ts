import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; // adjust path if needed
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      workoutData: user.workoutData || {},
      workoutPlan: user.workoutPlan || "",
    });
  } catch (error) {
    console.error("GET workout-data error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    await connectToDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.workoutData) user.workoutData = {};

    // Update allowed fields only
    for (const key of Object.keys(body)) {
      if (key in user.workoutData) {
        user.workoutData[key] = body[key];
      }
    }

    await user.save();

    return NextResponse.json({ workoutData: user.workoutData });
  } catch (error) {
    console.error("PATCH workout-data error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
