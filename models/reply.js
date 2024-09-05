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
        parentReplyId: {
            type: Number,
            default: null
        },
        replyFileUrl: {
            type: String
        },
        replyThumbnailFileUrl: {
            type: String
        },
        replies: [{
            type: Schema.Types.ObjectId,
            ref: 'Reply'
        }],
    },
    { timestamps: true }
);

const Reply = mongoose.models.Reply || mongoose.model("Reply", replySchema);
export default Reply;
