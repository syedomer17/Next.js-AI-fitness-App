import { connectToDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verify } from "jsonwebtoken";  // <--- Correct import here

export async function POST(req: Request) {
  await connectToDB();
  const { token, newPassword } = await req.json();
  try {
    const { email } = verify(token, process.env.RESET_SECRET!) as { email: string };
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return NextResponse.json({ message: 'Password reset successful' });
  } catch {
    return NextResponse.json({ error: 'Expired or invalid token' }, { status: 400 });
  }
}
