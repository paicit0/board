import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        createAt: {
            type:String,
            required: true,
            default: Date.now
        },
        thread: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Thread'
        },
        parentReply: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Reply', 
            default: null
        },

    },
    { timestamps: true }
)

const Reply = mongoose.models.Reply || mongoose.model("Reply", userSchema);
export default Reply;