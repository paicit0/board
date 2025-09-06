import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Thread from '../../../../models/thread';

export async function GET() {
    try {
      await connectMongoDB();
      const threads = await Thread.find().sort({ createdAt: -1 }).exec();
      return NextResponse.json(threads, { status: 200 });
    } catch (error) {
      console.error("Error fetching threads:", error);
      return NextResponse.json({ message: "An error occurred while fetching the threads." }, { status: 500 });
    }
  }
  