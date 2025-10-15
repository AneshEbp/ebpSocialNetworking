import mongoose from "mongoose";

interface IMessage {
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  conversationId: mongoose.Schema.Types.ObjectId;
  text: string;
  createdAt: Date;
  readCheck: boolean;
}

const messageSchema: mongoose.Schema<IMessage> = new mongoose.Schema<IMessage>({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  readCheck: {
    type: Boolean,
    default: false,
  },
},{
    timestamps: true,
});

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
