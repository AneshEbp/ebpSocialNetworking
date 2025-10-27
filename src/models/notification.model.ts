import mongoose from "mongoose";

interface INotification {
  message: string;
}

const notificationSchema: mongoose.Schema = new mongoose.Schema(
  {
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default NotificationModel;
