import mongoose from "mongoose";
const ProcessedEventSchema = new mongoose.Schema({
    eventId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});
const ProcessedEventModel = mongoose.model("ProcessedEvent", ProcessedEventSchema);
export default ProcessedEventModel;
//# sourceMappingURL=processedEvent.model.js.map