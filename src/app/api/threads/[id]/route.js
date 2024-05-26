import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Thread from '../../../../../models/thread';
import Reply from '../../../../../models/reply';

export async function GET(req, { params }) {
    try {
      await connectMongoDB();
  
      const threadId = params.id;
  
      // Fetch the thread without populating to log its initial state
      const threadBeforePopulate = await Thread.findOne({ threadId: threadId });
      console.log('Thread before populate:', threadBeforePopulate);
  
      // Fetch the thread with populating the replies
      const thread = await Thread.findOne({ threadId: threadId }).populate('replies').exec();
      console.log('Thread after populate:', thread);
  
      if (!thread) {
        return NextResponse.json({ success: false, message: 'Thread not found' }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, data: thread }, { status: 200 });
    } catch (error) {
      console.error('Error fetching thread:', error);
      return NextResponse.json({ success: false, message: 'Error fetching thread' }, { status: 500 });
    }
  }