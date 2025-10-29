import express from "express";
import { addComment, deleteComment, updateComment } from "../controllers/comment.controller.js";
import verifyToken from "../middlewares/jwtVerify.js";
const router = express.Router();
router.post('/add', verifyToken, addComment);
router.put('/update', verifyToken, updateComment);
router.delete('/delete', verifyToken, deleteComment);
export default router;
//# sourceMappingURL=comment.route.js.map