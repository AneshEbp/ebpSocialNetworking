import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";

dotenv.config();

const PORT = process.env.PORT;
const mongoUrl: string = process.env.MONGO_URL ? process.env.MONGO_URL : "";
const app = express();

import { confrimPayment } from "./controllers/message.controller.js";
app.post("/webhook", express.raw({ type: "application/json" }), confrimPayment);

app.use("/my-uploads", express.static("my-uploads"));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/payment-success", (req, res) => {
  res.send("Payment Successful!");
});

app.get("/payment-cancel", (req, res) => {
  res.send("Payment Cancelled.");
});

import connectToMongoDb from "./config/db.js";

import authRoutes from "./routes/auth.route.js";
app.use("/auth", authRoutes);

import userRoute from "./routes/user.route.js";
app.use("/user", userRoute);

import postRoute from "./routes/post.route.js";
app.use("/posts", postRoute);

import commentRoute from "./routes/comment.route.js";
app.use("/comment", commentRoute);

import chatRoute from "./routes/chat.route.js";
app.use("/chat", chatRoute);

import templateRoute from "./routes/template.route.js";
app.use("/template", templateRoute);

import { sendUserNotification } from "./controllers/notification.controller.js";
cron.schedule("0 * * * *", sendUserNotification);

import notificationRoute from "./routes/notification.route.js";
app.use("/notifications", notificationRoute);

//Database connection and server start
const startServer = async () => {
  try {
    await connectToMongoDb(mongoUrl);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
