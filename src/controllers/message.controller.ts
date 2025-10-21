import type { Request, Response } from "express";
import Conversation from "../models/conversationList.model.js";
import Message from "../models/message.module.js";

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

  if (!senderId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!receiverId || !text) {
    return res.status(400).json({ message: "Bad Request" });
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

    const totalMessages = await Message.countDocuments({ conversationId });
    const totalPages = Math.ceil(totalMessages / limit);
    const hasNextPage = totalPages > page;
    const hasPrevPage = page > 1;
    // let unreadCount = await Message.countDocuments({
    //   conversationId,
    //   readCheck: false,
    // });
    res.status(200).json({
      messages,
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
