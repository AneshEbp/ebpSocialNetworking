import express from "express";
import {
  getNotification,
  clearAllUserNotifications,
  clearUserNotificationsById,
  markReadUserNotification,
} from "../controllers/notification.controller.js";
import jwtVerify from "../middlewares/jwtVerify.js";

const router: express.Router = express.Router();

router.get("/getNotifications", jwtVerify, getNotification);
router.post(
  "/clearUserNotificationsById",
  jwtVerify,
  clearUserNotificationsById
);
router.post("/markReadUserNotification", jwtVerify, markReadUserNotification);
router.post("/clearAllUserNotifications", jwtVerify, clearAllUserNotifications);

export default router;
