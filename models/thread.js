import mongoose, { Schema } from "mongoose";

const threadSchema = new Schema({
    threadId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    threadContent: {
        type: String,
        required: true
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Reply'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    replyCount: {
        type: Number,
        default: 0
    },
    threadFileUrl: {
        required: true,
        type: String
    },
    threadThumbnailFileUrl: {
        required: true,
        type: String
    }
}, { timestamps: true });

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);
export default Thread;
