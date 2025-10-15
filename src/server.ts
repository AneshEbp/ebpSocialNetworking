import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT;
const mongoUrl: string = process.env.MONGO_URL ? process.env.MONGO_URL : "";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/my-uploads", express.static("my-uploads"));

app.get("/", (req, res) => {
  res.send("Hello World!");
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
