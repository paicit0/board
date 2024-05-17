import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        threadContent: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        replies: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Reply'
        },
        replyCount: {
            type: Number,
            default: 0
        }
        
    },
    { timestamps: true }
)

const Thread = mongoose.models.Thread || mongoose.model("Thread", userSchema);
export default Thread;