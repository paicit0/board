import mongoose, { Schema } from "mongoose";

const threadSchema = new Schema(
    {   
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
        file: {
            type: String,
            required: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        replies: [{
            type: Array, 
            ref: 'Reply'
        }],
        replyCount: {
            type: Number,
            default: 0
        }
        
    },
    { timestamps: true }
);

threadSchema.virtual('threadNetVotes').get(function() {
    return this.threadUpvotes - this.threadDownvotes;
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);
export default Thread;