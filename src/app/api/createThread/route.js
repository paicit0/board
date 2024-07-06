import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Thread from '../../../../models/thread';
import Counter from '../../../../models/counter';

async function getNextSequenceValue(sequenceName) {
  const counter = await Counter.findByIdAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  console.log('Counter after update:', counter);
  return counter.seq;
}

export async function POST(req) {
  try {
    const { title, threadContent, threadFileUrl } = await req.json(); // Include threadFileUrl here

    if (!title || !threadContent) {
      return NextResponse.json({ message: "Title and content are required." }, { status: 400 });
    }

    await connectMongoDB();

    const threadId = await getNextSequenceValue('threadId');
    console.log('Generated threadId:', threadId);

    const newThread = new Thread({
      threadId,
      title,
      threadContent,
      createdAt: new Date(),
      replyCount: 0,
      threadFileUrl, 
    });

    await newThread.save();
    console.log('New Thread:', newThread);
    return NextResponse.json({ message: "Thread Submitted.", threadId }, { status: 201 });
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
