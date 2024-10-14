import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Reply from "../../../../models/reply";

export async function DELETE(req) {
    try { 
        const {replyId} = await req.json();
        

    } catch {
        
    }
    
}