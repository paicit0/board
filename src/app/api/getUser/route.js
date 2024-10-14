import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import Counter from '../../../../models/counter';

export async function GET() {
    try {
      await connectMongoDB();
      const users = await User.find().sort({ createdAt: -1 }).exec();
      const usersJson = users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        date: user.createdAt,
      }))
      return NextResponse.json(usersJson, { status: 200 });
    } catch (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json({ message: "An error occurred while fetching the users." }, { status: 500 });
    }
  }
  