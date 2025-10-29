import mongoose from "mongoose";
const userNotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    notificationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
        required: true,
    },
    cleared: {
        type: Boolean,
        default: false,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const UserNotificationModel = mongoose.model("UserNotification", userNotificationSchema);
export default UserNotificationModel;
//# sourceMappingURL=userNotification.model.js.map