import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Thread from '../../../../models/thread';

export async function POST(req) {
  try {
    const { title, threadContent } = await req.json();

    if (!title || !threadContent) {
      return NextResponse.json({ message: "Title and content are required." }, { status: 400 });
    }

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
