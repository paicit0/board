// lib/thread.js

import { connectMongoDB } from './mongodb'; // Ensure this import is correct
import mongoose from 'mongoose';

// Define your schema if not already defined
const replySchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const threadSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema],
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
});

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);

export const getThreadById = async (id) => {
  await connectMongoDB();
  const thread = await Thread.findById(id);
  return thread;
};

export const addReplyToThread = async (id, reply) => {
  await connectMongoDB();
  const thread = await Thread.findById(id);
  if (thread) {
    thread.replies.push({ text: reply });
    await thread.save();
    return { modifiedCount: 1 };
  } else {
    return { modifiedCount: 0 };
  }
};

export const updateThreadVotes = async (id, upvotes, downvotes) => {
  await connectMongoDB();
  const result = await Thread.updateOne(
    { _id: id },
    { $set: { upvotes: upvotes, downvotes: downvotes } }
  );
  return result;
};
