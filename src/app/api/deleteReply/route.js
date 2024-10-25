import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Reply from "../../../../models/reply";
import { getServerSession } from "next-auth"; 
import { authOptions } from "next-auth";

export async function DELETE(req) {
    await connectMongoDB();

    try {
        const session = await getServerSession(req, authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, message: "Not an admin." }, { status: 403 });
        }

        const { replyId } = await req.json();
        const deleteReply = await Reply.findOneAndDelete({ replyId: replyId });

        if (!deleteReply) {
            return NextResponse.json({ success: false, message: "Reply not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Reply deleted successfully." }, { status: 200 });

    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ success: false, message: "An error occurred while deleting the reply." }, { status: 500 });
    }
}
