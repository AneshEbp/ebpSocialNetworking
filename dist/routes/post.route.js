import express from "express";
import { createPost, deletePost, getPostById, getPostComments, getPosts, likePost, showFeed, updatePost, } from "../controllers/post.controller.js";
import jwtVerify from "../middlewares/jwtVerify.js";
import { upload } from "../middlewares/handleFile.js";
import { checkSubscription } from "../middlewares/checkSubscription.js";
const router = express.Router();
router.post("/uploadpost", jwtVerify, checkSubscription, upload.single("image"), createPost);
router.get("/getposts", jwtVerify, getPosts);
router.delete("/deletepost/:id", jwtVerify, deletePost);
router.put("/updatepost/:id", jwtVerify, checkSubscription, upload.single("image"), updatePost);
router.get("/postbyid/:id", getPostById);
router.get("/postcomments/:id", getPostComments);
router.get("/showfeed", jwtVerify, showFeed);
router.post("/likepost", jwtVerify, likePost);
export default router;
//# sourceMappingURL=post.route.js.map