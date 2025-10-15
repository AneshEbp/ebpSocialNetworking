interface IConversation {
  participantOne: Types.ObjectId;
  participantTwo: Types.ObjectId;
  lastMessageDate: Date;
}

import mongoose from "mongoose";
import { Types } from "mongoose";

const conversationSchema = new mongoose.Schema<IConversation>({
  participantOne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  participantTwo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  lastMessageDate: { type: Date, default: Date.now },
});

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);
export default Conversation;
