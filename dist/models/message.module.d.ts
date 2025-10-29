import mongoose from "mongoose";
interface IMessage {
    senderId: mongoose.Schema.Types.ObjectId;
    receiverId: mongoose.Schema.Types.ObjectId;
    conversationId: mongoose.Schema.Types.ObjectId;
    text: string;
    imageMessage: string;
    createdAt: Date;
    readCheck: boolean;
    locked: boolean;
}
declare const Message: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, {}> & IMessage & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export default Message;
//# sourceMappingURL=message.module.d.ts.map