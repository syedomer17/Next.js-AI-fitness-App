import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await connectToDB();
  const { email, otp } = await req.json();

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp) return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });

  user.emailVerified = true;
  user.otp = null;
  await user.save();

  return NextResponse.json({ message: 'Email verified successfully' });
}
