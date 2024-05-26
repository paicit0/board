import mongoose, { Schema } from "mongoose";

const replySchema = new Schema(
    {
        replyId: {
            type: Number,
            required: true,
            unique: true
        },
        replyContent: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        parentReply: [{
            type: Schema.Types.ObjectId,
            ref: 'Reply',
            default: null
        }],
    },
    { timestamps: true }
);

const Reply = mongoose.models.Reply || mongoose.model("Reply", replySchema);
export default Reply;
