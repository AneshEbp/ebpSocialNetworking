import mongoose from "mongoose";
const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    status: {
        type: String,
        required: true,
        enum: ["active", "inactive"],
        default: "inactive",
    },
}, { timestamps: true });
const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
//# sourceMappingURL=subscription.model.js.map