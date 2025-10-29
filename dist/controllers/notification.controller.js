import NotificationModel from "../models/notification.model.js";
import User from "../models/user.model.js";
import UserNotificationModel from "../models/userNotification.model.js";
const generateNotification = async () => {
    try {
        // const notifications: Array<String> = [
        //   "Check out what’s trending today!",
        //   "New posts you might like are waiting!",
        //   "See the latest stories from the community!",
        //   "Discover what people are talking about right now!",
        //   "Fresh content added — don’t miss it!",
        //   "Join the conversation happening now!",
        //   "Explore new posts that everyone’s talking about!",
        //   "Catch the latest updates in your feed!",
        //   "Something exciting just happened on the platform!",
        //   "Check out today’s top highlights!",
        // ];
        // const notificationPointer = Math.floor(
        //   Math.random() * notifications.length
        // );
        // const selectedNotification = notifications[notificationPointer];
        const subjects = ["Check out", "Discover", "See", "Explore", "Catch"];
        const objects = [
            "the latest posts",
            "trending stories",
            "what’s popular today",
            "community highlights",
            "new updates",
        ];
        const actions = [
            "right now!",
            "before it’s gone!",
            "happening today!",
            "you’ll love it!",
            "everyone is talking about!",
        ];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const object = objects[Math.floor(Math.random() * objects.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const notificationMessage = `${subject} ${object} ${action}`;
        const notificationDoc = new NotificationModel({
            message: notificationMessage,
        });
        const savedNotification = await notificationDoc.save();
        return savedNotification;
    }
    catch (err) {
        console.error("Error generating notification:", err);
        throw new Error("Failed to generate notification");
    }
};
export const sendUserNotification = async () => {
    try {
        const savedNotification = await generateNotification();
        if (!savedNotification) {
            throw new Error("Failed to generate notification");
        }
        const allUsers = await User.find({});
        await Promise.all(allUsers.map(async (user) => {
            const userNotification = new UserNotificationModel({
                userId: user._id,
                notificationId: savedNotification._id,
            });
            await userNotification.save();
        }));
        console.log("User notifications created successfully");
    }
    catch (err) {
        console.error("Error creating user notification:", err);
        throw new Error("Failed to create user notification");
    }
};
export const getNotification = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const notifications = await UserNotificationModel.find({
            userId,
            cleared: false,
        }).populate("notificationId");
        res.status(200).json(notifications);
    }
    catch (err) {
        console.error("Error fetching user notifications:", err);
        res.status(500).json({ error: "Failed to fetch user notifications" });
    }
};
export const clearAllUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        await UserNotificationModel.updateMany({ userId, cleared: false }, { $set: { cleared: true } });
        res
            .status(200)
            .json({ message: "User notifications cleared successfully" });
    }
    catch (err) {
        console.error("Error clearing user notifications:", err);
        res.status(500).json({ error: "Failed to clear user notifications" });
    }
};
export const clearUserNotificationsById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { notificationId } = req.body;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        await UserNotificationModel.updateOne({ userId, notificationId }, { $set: { cleared: true } });
        res.status(200).json({ message: "User notification cleared successfully" });
    }
    catch (err) {
        console.error("Error clearing user notification:", err);
        res.status(500).json({ error: "Failed to clear user notification" });
    }
};
export const markReadUserNotification = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        await UserNotificationModel.updateMany({ userId }, { $set: { read: true } });
        res
            .status(200)
            .json({ message: "User notification marked as read successfully" });
    }
    catch (err) {
        console.error("Error marking user notification as read:", err);
        res.status(500).json({ error: "Failed to mark user notification as read" });
    }
};
//# sourceMappingURL=notification.controller.js.map