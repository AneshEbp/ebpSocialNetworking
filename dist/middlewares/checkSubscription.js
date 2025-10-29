import express from "express";
import SubscriptionModel from "../models/subscription.model.js";
export const checkSubscription = async (req, res, next) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const subscription = await SubscriptionModel.findOne({ userId }).sort({
            createdAt: -1,
        });
        if (!subscription ||
            subscription.status !== "active" ||
            new Date() > subscription.endDate) {
            return res.status(403).json({ message: "Active subscription required" });
        }
        next();
    }
    catch (err) {
        console.error("Error checking subscription status:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=checkSubscription.js.map