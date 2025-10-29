import mongoose from "mongoose";
interface IUserNotification {
    userId: mongoose.Schema.Types.ObjectId;
    notificationId: mongoose.Schema.Types.ObjectId;
    cleared: boolean;
    read: boolean;
}
declare const UserNotificationModel: mongoose.Model<IUserNotification, {}, {}, {}, mongoose.Document<unknown, {}, IUserNotification, {}, {}> & IUserNotification & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export default UserNotificationModel;
//# sourceMappingURL=userNotification.model.d.ts.map