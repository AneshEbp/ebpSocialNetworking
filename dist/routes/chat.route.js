import express from "express";
import { createMessage, getConversationList, getMessages, readMessages, payToUnlockImage, } from "../controllers/message.controller.js";
import verifyToken from "../middlewares/jwtVerify.js";
import { upload } from "../middlewares/handleFile.js";
const router = express.Router();
router.post("/send-message", verifyToken, upload.single("imageMessage"), createMessage);
router.get("/messages/:conversationId", verifyToken, getMessages);
router.get("/conversation-list", verifyToken, getConversationList);
router.post("/read-messages/:conversationId", verifyToken, readMessages);
router.post("/pay-to-unlock-image", verifyToken, payToUnlockImage);
export default router;
//# sourceMappingURL=chat.route.js.map