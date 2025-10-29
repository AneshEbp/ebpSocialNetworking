import mongoose from "mongoose";
import { Types } from "mongoose";
const conversationSchema = new mongoose.Schema({
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
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
//# sourceMappingURL=conversationList.model.js.map