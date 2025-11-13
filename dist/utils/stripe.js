import Stripe from "stripe";
import Message from "../models/message.module.js";
import SubscriptionModel from "../models/subscription.model.js";
import NotificationModel from "../models/notification.model.js";
import UserNotificationModel from "../models/userNotification.model.js";
import ProcessedEvent from "../models/processedEvent.model.js";
import mongoose from "mongoose";
import { sendMail } from "../utils/sendMail.js";
import User from "../models/user.model.js";
export const createSession = async (price, metadata) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: { name: `Pay ${metadata.purpose}` },
                    unit_amount: price * 100, // price in cents
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `https://ebpsocialnetworking.onrender.com/payment-success`,
        cancel_url: "https://ebpsocialnetworking.onrender.com/payment-cancel",
        metadata,
    });
    return session.url;
};
export const webhookHandler = async (req, res) => {
    const endpointSecret = process.env.ENDPOINT_SECRET;
    const sig = req.headers["stripe-signature"];
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        const existing = await ProcessedEvent.findOne({ eventId: event.id });
        if (existing) {
            console.warn(`Event ${event.id} already processed — skipping.`);
            return res.status(200).json({ received: true });
        }
        await ProcessedEvent.create({ eventId: event.id });
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const userId = session.metadata?.userId;
            if (session.metadata?.purpose === "Unlock Image") {
                await unlockImage(session);
            }
            else if (session.metadata?.purpose == "Pay Subscription") {
                const updateSuccess = await updateUserSubscription(userId);
                if (!updateSuccess) {
                    console.error("Failed to update user subscription");
                    return res.status(500).send("Internal Server Error");
                }
                // const userEmail = session.customer_details?.email;
                try {
                    const userDetails = await User.findOne({ _id: userId });
                    const userEmail = userDetails?.email || "";
                    const mailSubject = "Subscription Activated Successfully";
                    const mailTemplate = "subscriptionMail";
                    const mailContext = {
                        name: userDetails?.name || "User",
                        startDate: new Date().toDateString(),
                        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toDateString(),
                    };
                    await sendMail(userEmail, mailSubject, mailTemplate, mailContext);
                }
                catch (error) {
                    console.error("Error sending subscription email:", error);
                }
            }
            return res.status(200).json({ received: true });
        }
    }
    catch (err) {
        console.error("Error checking for existing event:", err);
        return res.status(500).send("Internal Server Error");
    }
};
const unlockImage = async (session) => {
    const userId = session.metadata?.userId;
    const messageId = session.metadata?.messageId;
    if (!userId || !messageId) {
        return false;
    }
    try {
        const message = await Message.findOne({ _id: messageId });
        if (!message) {
            return false;
        }
        message.locked = false;
        await message.save();
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
};
const updateUserSubscription = async (userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const today = new Date();
        const endDate = new Date(today.getTime());
        endDate.setMonth(endDate.getMonth() + 1);
        const subscription = new SubscriptionModel({
            userId,
            startDate: today,
            endDate,
            status: "active",
        });
        await subscription.save({ session });
        const notification = new NotificationModel({
            message: `Your subscription has been activated successfully! from ${today.toDateString()} to ${endDate.toDateString()}.`,
        });
        const notificationResult = await notification.save({ session });
        const userNotification = new UserNotificationModel({
            userId,
            notificationId: notificationResult._id,
        });
        await userNotification.save({ session });
        await session.commitTransaction();
        session.endSession();
        return true;
    }
    catch (err) {
        console.error("Error creating subscription:", err);
        await session.abortTransaction();
        session.endSession();
        return false;
    }
};
//# sourceMappingURL=stripe.js.map