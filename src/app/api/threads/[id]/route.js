import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Thread from '../../../../../models/thread';

export async function GET(req, { params }) {
  const { id } = params;
  console.log(`Fetching thread with threadId: ${id}`); // Debugging statement

  try {
    await connectMongoDB();

    // Ensure id is a number
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ message: 'Invalid thread ID' }, { status: 400 });
    }

    const thread = await Thread.findOne({ threadId: numericId }).populate('replies');

    if (!thread) {
      console.log(`Thread with threadId ${numericId} not found`); // Debugging statement
      return NextResponse.json({ message: 'Thread not found' }, { status: 404 });
    }

    return NextResponse.json(thread, { status: 200 });
  } catch (error) {
    console.error('Error fetching thread:', error);
    return NextResponse.json({ message: 'An error occurred while fetching the thread.' }, { status: 500 });
  }
}