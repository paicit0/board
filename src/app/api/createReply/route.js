import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Reply from '../../../../models/reply';
import Counter from '../../../../models/counter';
import Thread from '../../../../models/thread';

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
    const { replyContent, parentReply } = await req.json();

    if (!replyContent) {
      return NextResponse.json({ message: "Reply content is required." }, { status: 400 });
    }

    await connectMongoDB();

    const replyId = await getNextSequenceValue('threadId');
    console.log('Generated threadId:', replyId); 

    const newReply = new Reply({
      replyId,
      replyContent,
      createdAt: new Date(),
      parentReply
    });

    await newReply.save();
    console.log('New Reply:', newReply);
    return NextResponse.json({ message: "Reply Submitted.", replyId }, { status: 201 });
  } catch (error) {
    console.error("Error submitting reply:", error);
    return NextResponse.json({ message: "An error occurred while submitting the reply." }, { status: 500 });
  }
}