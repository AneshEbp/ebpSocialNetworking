import mongoose from "mongoose";
interface IProcessedEvent extends mongoose.Document {
    eventId: string;
    createdAt: Date;
}
declare const ProcessedEventModel: mongoose.Model<IProcessedEvent, {}, {}, {}, mongoose.Document<unknown, {}, IProcessedEvent, {}, {}> & IProcessedEvent & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default ProcessedEventModel;
//# sourceMappingURL=processedEvent.model.d.ts.map