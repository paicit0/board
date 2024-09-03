import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Reply from '../../../../models/reply';
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
    const { replyContent, threadId, replyFileUrl, replyThumbnailFileUrl, parentReplyId } = await req.json();

    if (!replyContent || !threadId) {
      return NextResponse.json({ message: "Reply content and thread ID are required." }, { status: 400 });
    }

    await connectMongoDB();

    const replyId = await getNextSequenceValue('commonId');
    console.log('Generated replyId:', replyId);

    const newReply = new Reply({
      replyId,
      threadId,
      parentReplyId: parentReplyId || null,
      createdAt: new Date(),
      replyContent,
      replyFileUrl,
      replyThumbnailFileUrl,
    });

    await newReply.save();
    console.log('New Reply:', newReply);

    if (parentReplyId) {
      const updatedParentReply = await Reply.findOneAndUpdate(
        { replyId: parentReplyId },
        { 
          $push: { replies: newReply._id }, 
        },
        { new: true }
      );
      console.log('Updated Parent Reply:', updatedParentReply);
    } 

    const updatedThread = await Thread.findOneAndUpdate( 
      { threadId: threadId },
      { 
        $push: { replies: newReply._id }, 
        $inc: { replyCount: 1 },
        $set: { latestReplyAt: new Date() } 
      },
      { new: true }
    );
    console.log('Updated Thread:', updatedThread);

    return NextResponse.json({ message: "Reply Submitted.", replyId }, { status: 201 });
  } catch (error) {
    console.error("Error submitting reply:", error);
    return NextResponse.json({ message: "An error occurred while submitting the reply." }, { status: 500 });
  }
}
