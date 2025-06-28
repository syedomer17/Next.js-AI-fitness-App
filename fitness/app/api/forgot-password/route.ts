// app/api/forgot-password/route.ts

import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/sendEmail';

export async function POST(req: Request) {
  await connectToDB();

  const body = await req.json();
  const { email, newPassword } = body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!newPassword) {
    // Step 1: Just email provided — send a confirmation email that user can reset password
    await sendEmail({
      to: email,
      subject: 'Password Reset Requested',
      html: `<p>You requested to reset your password. Please enter your new password in the app to update it securely.</p>`,
    });

    return NextResponse.json({ message: 'Password reset allowed. Please enter your new password.' });
  }

  // Step 2: newPassword provided — hash and update password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  // Send confirmation email after password changed
  await sendEmail({
    to: email,
    subject: 'Password Changed Successfully',
    html: `<p>Your password has been changed successfully. If this wasn't you, please contact support immediately.</p>`,
  });

  return NextResponse.json({ message: 'Password changed successfully.' });
}
