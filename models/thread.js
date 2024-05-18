import mongoose, { Schema } from "mongoose";

const threadSchema = new Schema(
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
        replies: [{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Reply'
        }],
        replyCount: {
            type: Number,
            default: 0
        },
        threadUpvotes: {
            type: Number,
            default: 0
        },
        threadDownvotes: {
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