import mongoose from "mongoose";

interface IUserNotification {
  userId: mongoose.Schema.Types.ObjectId;
  notificationId: mongoose.Schema.Types.ObjectId;
  cleared: boolean;
  read: boolean;
}

const userNotificationSchema: mongoose.Schema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const UserNotificationModel = mongoose.model<IUserNotification>(
  "UserNotification",
  userNotificationSchema
);

export default UserNotificationModel;
