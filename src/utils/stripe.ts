import Stripe from "stripe";
import type { Request, Response } from "express";
import Message from "../models/message.module.js";
import SubscriptionModel from "../models/subscription.model.js";

export const createSession = async (
  price: number,
  metadata: { purpose: string; userId: string; messageId?: string }
) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
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
    success_url: `https://northeastwardly-subcultrate-perla.ngrok-free.dev/payment-success`,
    cancel_url:
      "https://northeastwardly-subcultrate-perla.ngrok-free.dev/payment-cancel",
    metadata,
  });
  return session.url;
};

export const webhookHandler = async (req: Request, res: Response) => {
  const endpointSecret = process.env.ENDPOINT_SECRET as string;
  const sig = req.headers["stripe-signature"] as string;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("i m here");
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId as string;
    if (session.metadata?.purpose === "Unlock Image") {
      unlockImage(session);
    } else if (session.metadata?.purpose == "Pay Subscription") {
      updateUserSubscription(userId);
    }
  }
};

const unlockImage = async (session: Stripe.Checkout.Session) => {
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
  } catch (err) {
    console.error(err);
    return false;
  }
};

const updateUserSubscription = async (userId: string) => {
  try {
    console.log("i m here");
    const today = new Date();
    const endDate = new Date(today.getTime()); 
    endDate.setMonth(endDate.getMonth() + 1);
    const subscription = new SubscriptionModel({
      userId,
      startDate: today,
      endDate,
      status: "active",
    });
    await subscription.save();
    return true;
  } catch (err) {
    console.error("Error creating subscription:", err);
    return false;
  }
};
