import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  await connectToDB();
  const { name, email, password } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const newUser = await User.create({ name, email, password: hashed, otp });

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    html: `<p>Your OTP is <b>${otp}</b></p>`,
  });

  return NextResponse.json({ message: 'User created. OTP sent to email' });
}
