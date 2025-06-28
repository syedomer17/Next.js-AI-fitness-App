import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; // adjust path if needed
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse JSON body
    const { email, plan } = await request.json();

    // Validate inputs
    if (!email || !plan) {
      return NextResponse.json(
        { message: "Email and plan are required" },
        { status: 400 }
      );
    }

    // Ensure the email matches session user email
    if (email !== session.user.email) {
      return NextResponse.json(
        { message: "Forbidden: Email mismatch" },
        { status: 403 }
      );
    }

    // Setup nodemailer transporter (Gmail example)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail address
        pass: process.env.EMAIL_PASS, // your gmail app password or OAuth token
      },
    });

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Workout Plan from Workout Planner",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 5px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #4caf50;">Your Personalized Workout Plan 💪</h2>
        <p>Hi there,</p>
        <p>Here's the workout plan you generated:</p>
        <pre style="white-space: pre-wrap; background-color: #f0f0f0; padding: 15px; border-radius: 5px; border: 1px solid #ccc;">${plan}</pre>
        <p>Stay consistent and smash your fitness goals! 🏋️‍♂️</p>
        <p style="margin-top: 20px;">– The Workout Planner Team</p>
      </div>
    </div>
  `,
    });

    return NextResponse.json({ message: "Workout plan sent successfully!" });
  } catch (error) {
    console.error("POST send-plan error:", error);
    return NextResponse.json(
      { message: "Failed to send workout plan. Please try again." },
      { status: 500 }
    );
  }
}
