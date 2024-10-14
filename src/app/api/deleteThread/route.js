import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Thread from "../../../../models/thread";
import User from "../../../../models/user";

export async function DELETE(req) {
    await connectMongoDB();
    try { 
        const {threadId} = await req.json();
        const deletedThread = await Thread.findOneAndDelete({threadId:threadId})

        if (session.user.role !== 'admin') {
            return NextResponse.json({success: false, message: "Not an admin."}, {status: 403});
        }
        
        return NextResponse.json({success: true, message: "Thread deleted  successfully"}, {status:200});

    } catch{

    }
}