interface IConversation {
    participantOne: Types.ObjectId;
    participantTwo: Types.ObjectId;
    lastMessageDate: Date;
}
import mongoose from "mongoose";
import { Types } from "mongoose";
declare const Conversation: mongoose.Model<IConversation, {}, {}, {}, mongoose.Document<unknown, {}, IConversation, {}, {}> & IConversation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
export default Conversation;
//# sourceMappingURL=conversationList.model.d.ts.map