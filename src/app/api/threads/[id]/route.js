import { connectMongoDB } from '../../../../../lib/mongodb';
import Thread from '../../../../../models/thread';

export const GET = async (req, { params }) => {
    const { id } = params;

    console.log('Received ID:', id);

    try {
        await connectMongoDB();

        const thread = await Thread.findOne({ threadId: id });
        console.log('Fetched Thread:', thread);

        if (!thread) {
            return new Response(JSON.stringify({ success: false, message: 'Thread not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, data: thread }), { status: 200 });
    } catch (error) {
        console.error('Error fetching thread:', error); 
        return new Response(JSON.stringify({ success: false, message: 'Error fetching thread', error: error.message }), { status: 500 });
    }
};