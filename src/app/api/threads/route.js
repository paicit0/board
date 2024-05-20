import { connectMongoDB } from '../../../../lib/mongodb';
import Thread from '../../../../models/thread';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    await connectMongoDB();
    console.log('Connected to MongoDB');

    if (!id) {
      return res.status(400).json({ message: 'Thread ID is required' });
    }

    console.log(`Fetching thread with ID: ${id}`);

    const thread = await Thread.findOne({ threadId: parseInt(id) }).populate('replies');
    
    if (!thread) {
      console.log('Thread not found');
      return res.status(404).json({ message: 'Thread not found' });
    }

    console.log('Thread found:', thread);
    res.status(200).json(thread);
  } catch (error) {
    console.error('Error fetching thread:', error);
    res.status(500).json({ message: 'Server error', error });
  }
}