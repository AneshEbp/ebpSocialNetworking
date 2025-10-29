import express from "express";
import jwtVerify from "../middlewares/jwtVerify.js";
import { createSubscription, getSubscriptionStatus, getSubscriptionDetails, } from "../controllers/subscription.controller.js";
const router = express.Router();
router.post("/create", jwtVerify, createSubscription);
router.get("/status", jwtVerify, getSubscriptionStatus);
router.get("/subscriptionlist", jwtVerify, getSubscriptionDetails);
export default router;
//# sourceMappingURL=subscription.route.js.map