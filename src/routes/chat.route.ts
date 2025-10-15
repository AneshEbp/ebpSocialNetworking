import express from "express";
import {
  createMessage,
  getConversationList,
  getMessages,
  readMessages,
} from "../controllers/message.controller.js";
import verifyToken from "../middlewares/jwtVerify.js";

const router: express.Router = express.Router();

router.post("/send-message", verifyToken, createMessage);
router.get("/messages/:conversationId", verifyToken, getMessages);
router.get("/conversation-list", verifyToken, getConversationList);
router.post('/read-messages/:conversationId', verifyToken, readMessages);

export default router;
