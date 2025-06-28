import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import User from '@/models/User';
import { connectToDB } from '@/lib/mongodb';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email }).select('workoutPlan');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ workoutPlan: user.workoutPlan || '' }, { status: 200 });
  } catch (error) {
    console.error('Workout plan fetch error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
