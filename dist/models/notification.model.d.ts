import mongoose from "mongoose";
interface INotification {
    message: string;
}
declare const NotificationModel: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, {}> & INotification & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export default NotificationModel;
//# sourceMappingURL=notification.model.d.ts.map