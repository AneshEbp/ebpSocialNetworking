import express from "express";
import type { Request, Response } from "express";
import SubscriptionModel from "../models/subscription.model.js";
import { createSession } from "../utils/stripe.js";
import User from "../models/user.model.js";
import NotificationModel from "../models/notification.model.js";

export const createSubscription = async (req: Request, res: Response) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).send("User ID is required");
  }
  //   try {
  //     const today = new Date();
  //     const subscription = new SubscriptionModel({
  //       userId,
  //       startDate: today,
  //       endDate: new Date(today.setMonth(today.getMonth() + 1)),
  //       status: "active",
  //     });
  //     await subscription.save();
  //     return res.status(201).send("Subscription created successfully");
  //   } catch (err) {
  //     console.error("Error creating subscription:", err);
  //     return res.status(500).send("Internal server error");
  //   }
  try {
    const activeSubscription = await SubscriptionModel.find({
      userId,
      status: "active",
    }).sort({ createdAt: -1 });
    console.log("activeSubscription", activeSubscription);
    if (activeSubscription && activeSubscription.length > 0) {
      return res.send("user is already subscribed");
    }

    const metadata = {
      purpose: "Pay Subscription",
      userId,
    };
    const url = await createSession(50, metadata);
    if (!url) {
      return res.status(500).send("Failed to create subscription session");
    }
    res.json({ url });
  } catch (err) {
    console.error("Error creating subscription session:", err);
    return res.status(500).send("Internal server error");
  }
};

export const getSubscriptionStatus = async (req: Request, res: Response) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).send("User ID is required");
  }
  try {
    const subscription = await SubscriptionModel.findOne({ userId }).sort({
      createdAt: -1,
    });
    if (!subscription) {
      return res.status(404).send("No subscription found for this user");
    }
    return res
      .status(200)
      .json({
        status: subscription.status,
        endDate: subscription.endDate,
        startDate: subscription.startDate,
      });
  } catch (err) {
    console.error("Error fetching subscription status:", err);
    return res.status(500).send("Internal server error");
  }
};

export const getSubscriptionDetails = async (req: Request, res: Response) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).send("User ID is required");
  }
  try {
    const subscription = await SubscriptionModel.findOne({ userId }).sort({
      createdAt: -1,
    });
    if (!subscription) {
      return res.status(404).send("No subscription found for this user");
    }
    return res.status(200).json(subscription);
  } catch (err) {
    console.error("Error fetching subscription details:", err);
    return res.status(500).send("Internal server error");
  }
};

export const inactiveSubscription = async () => {
  console.log("eneter corn job ");
  try {
    const subscriptions = await SubscriptionModel.find({ status: "active" });
    const today = new Date();
    for (const subscription of subscriptions) {
      if (subscription.endDate < today) {
        subscription.status = "inactive";
        await subscription.save();
      }
    }
  } catch (err) {
    console.error("Error updating subscription statuses:", err);
  }
};

// export const informUsersAboutExpiringSubscriptions = async () => {
//   try {
//     const today = new Date();
//     const checkDay = new Date(today);
//     checkDay.setDate(checkDay.getDate() + 7);

//     const subscriptions = await SubscriptionModel.find({
//       endDate: {
//         $eq: checkDay,
//       },
//       status: "active",
//     });

//     for (const subscription of subscriptions) {
//       const user = await User.findById(subscription.userId);
//       if (user) {
//         const notification = new NotificationModel({
//           userId: user._id,
//           message: "Your subscription is about to expire in 7 days.",
//           read: false,
//         });
//         await notification.save();
//       }
//     }
//   } catch (err) {
//     console.error("Error sending notifications for expired subscriptions:", err);
//   }
// }
