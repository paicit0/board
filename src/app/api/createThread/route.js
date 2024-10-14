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
    const { title, threadContent, threadFileUrl, threadThumbnailFileUrl } = await req.json();

    if (!title || !threadContent) {
      return NextResponse.json({ message: "Title and content are required." }, { status: 400 });
    }

    await connectMongoDB();

    const threadId = await getNextSequenceValue('commonId');
    console.log('Generated threadId:', threadId);

    const newThread = new Thread({
      threadId,
      title,
      threadContent,
      createdAt: new Date(),
      replyCount: 0,
      threadFileUrl,
      threadThumbnailFileUrl,
      latestReplyAt: new Date()
    });

    await newThread.save();
    console.log('New Thread:', newThread);

    return NextResponse.json({ message: "Thread Submitted.", threadId }, { status: 201 });
  } catch (error) {
    console.error("Error submitting thread:", error);
    return NextResponse.json({ message: "An error occurred while submitting the thread." }, { status: 500 });
  }
}