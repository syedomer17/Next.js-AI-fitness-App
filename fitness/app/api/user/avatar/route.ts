import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { avatar } = body;

  if (!avatar) {
    return NextResponse.json({ message: 'No avatar provided' }, { status: 400 });
  }

  await connectToDB();

  try {
    await User.findOneAndUpdate(
      { email: session.user.email },
      { avatar }
    );

    return NextResponse.json({ message: 'Avatar updated' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'DB error', error }, { status: 500 });
  }
}
