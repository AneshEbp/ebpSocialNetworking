import mongoose from "mongoose";

interface IProcessedEvent extends mongoose.Document {
  eventId: string;
  createdAt: Date;
}

const ProcessedEventSchema = new mongoose.Schema<IProcessedEvent>({
  eventId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const ProcessedEventModel = mongoose.model<IProcessedEvent>("ProcessedEvent", ProcessedEventSchema);

export default ProcessedEventModel;
