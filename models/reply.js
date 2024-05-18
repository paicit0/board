import mongoose, { Schema } from "mongoose";

const replySchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type:Date,
            default: Date.now
        },
        parentReply: [{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Reply', 
            default: null
        }],
        replyUpvotes: {
            type: Number,
            default: 0
        },
        replyDownvotes: {
            type: Number,
            default: 0
        }
        

    },
    { timestamps: true }
);

replySchema.virtual('replyNetVotes').get(function() {
    return this.replyUpvotes - this.replyDownvotes;
});

const Reply = mongoose.models.Reply || mongoose.model("Reply", replySchema);
export default Reply;