import type { Request, Response } from "express";
import Conversation from "../models/conversationList.model.js";
import Message from "../models/message.module.js";
import Stripe from "stripe";

export const getConversationList = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const conversations = await Conversation.find({
      $or: [{ participantOne: userId }, { participantTwo: userId }],
    })
      .sort({ lastMessageDate: -1 })
      .populate("participantOne participantTwo", "name")
      .skip(skip)
      .limit(limit);

    if (!conversations) {
      return res.status(404).json({ message: "No conversations found" });
    }

    const totalConversations = await Conversation.countDocuments({
      $or: [{ participantOne: userId }, { participantTwo: userId }],
    });
    const totalPages = Math.ceil(totalConversations / limit);
    const hasNextPage = totalPages > page;
    const hasPrevPage = page > 1;

    const conversationArrayWithUnreadNumber: Array<Object> = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conversation._id,
          readCheck: false,
        });
        const lastMessage = await Message.find(
          { conversationId: conversation._id },
          { text: 1, createdAt: 1 }
        )
          .sort({ createdAt: -1 })
          .limit(1);
        let newobject = {
          conversation,
          unreadCount,
          lastMessage,
        };

        return newobject;
      })
    );

    return res.status(200).json({
      conversations: conversationArrayWithUnreadNumber,
      currentPage: page,
      totalPages,
      hasNextPage,
      hasPrevPage,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  const { receiverId, text } = req.body;
  const senderId = req.user?.id;
  let imageMessage = req.file?.path;

  if (!senderId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
console.log(receiverId)
  if (!receiverId) {
    return res.status(400).json({ message: "Bad Request" });
  }
  if (!text && !imageMessage) {
    return res.status(400).json({ message: "input required" });
  }

  try {
    let findChat = await Conversation.findOne({
      $or: [
        { participantOne: senderId, participantTwo: receiverId },
        { participantOne: receiverId, participantTwo: senderId },
      ],
    });

    if (!findChat) {
      const newConversation = new Conversation({
        participantOne: senderId,
        participantTwo: receiverId,
      });
      findChat = await newConversation.save();
    } else {
      findChat.lastMessageDate = new Date();
      await findChat.save();
    }

    const newMessage = new Message({
      conversationId: findChat?._id,
      senderId,
      receiverId,
      text,
      imageMessage,
      locked: !!imageMessage,
    });
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const conversationId = req.params.conversationId;
  const userId = req.user?.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  try {
    const messages = await Message.find({ conversationId })
      .sort({
        createdAt: 1,
      })
      .populate("senderId", "name")
      .populate("receiverId", "name")
      .skip(skip)
      .limit(limit);

    const formattedMessages = messages.map((message) => {
      const isSender =
        (message.senderId as any)._id?.toString() === userId.toString();
      console.log(userId, message.senderId.toString());
      if (message.locked && !isSender) {
        message.imageMessage = "default-image";
      }
      return message;
    });

    const totalMessages = await Message.countDocuments({ conversationId });
    const totalPages = Math.ceil(totalMessages / limit);
    const hasNextPage = totalPages > page;
    const hasPrevPage = page > 1;
    res.status(200).json({
      formattedMessages,
      currentPage: page,
      totalPages,
      hasNextPage,
      hasPrevPage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readMessages = async (req: Request, res: Response) => {
  const conversationId = req.params.conversationId;
  try {
    await Message.updateMany(
      { conversationId, readCheck: false },
      { $set: { readCheck: true } }
    );
    res.status(200).json({ message: "Messages marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

import { createSession } from "../utils/stripe.js";
export const payToUnlockImage = async (req: Request, res: Response) => {
  const { messageId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const message = await Message.findOne({ _id: messageId });
  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  try {
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: "usd",
    //         product_data: { name: `Unlock Image ${messageId}` },
    //         unit_amount: 50 * 100, // price in cents
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: "payment",
    //   success_url: `https://northeastwardly-subcultrate-perla.ngrok-free.dev/payment-success`,
    //   cancel_url:
    //     "https://northeastwardly-subcultrate-perla.ngrok-free.dev/payment-cancel",
    //   metadata: {
    //     userId,
    //     messageId,
    //   },
    // });

    const metadata={
      userId,
      messageId,
      purpose: "Unlock Image"
    }
    const price = 50;
    const sessionUrl = await createSession(price, metadata);

    res.status(200).json({ url: sessionUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const confrimPayment = async (req: Request, res: Response) => {
//   const endpointSecret = process.env.ENDPOINT_SECRET as string;
//   const sig = req.headers["stripe-signature"] as string;
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err: any) {
//     console.error("Webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object as Stripe.Checkout.Session;
//     const userId = session.metadata?.userId;
//     const messageId = session.metadata?.messageId;

//     if (!userId || !messageId) {
//       return res.status(400).send("Missing metadata");
//     }

//     try {
//       const message = await Message.findOne({ _id: messageId });
//       if (!message) {
//         return res.status(404).send("Message not found");
//       }

//       message.locked = false;
//       await message.save();
//       console.log("Image unlocked for message:", messageId);
//       res.status(200).send("Payment confirmed and image unlocked");
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// };
