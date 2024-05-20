import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Thread from '../../../../models/thread';

export async function POST(req, res) {
  try {
    const { title, threadContent } = await req.json(); 

    await connectMongoDB();

    const newThread = new Thread({
      title,
      threadContent,
      createdAt: new Date(),
      threadUpvotes: 0,
      threadDownvotes: 0,
    });

    await newThread.save();
    return NextResponse.json({ message: "Thread Submitted." }, { status: 201 });
  } catch (error) {
    console.error("Error submitting thread:", error);
    return NextResponse.json({ message: "An error occurred while submitting the thread." }, { status: 500 });
  }
}

export function GET(req, res) {
  res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}