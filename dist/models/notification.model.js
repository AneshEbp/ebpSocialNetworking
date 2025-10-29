import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
}, { timestamps: true });
const NotificationModel = mongoose.model("Notification", notificationSchema);
export default NotificationModel;
//# sourceMappingURL=notification.model.js.map