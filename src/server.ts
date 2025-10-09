import express from "express";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();

const PORT = process.env.PORT;
const mongoUrl: string = process.env.MONGO_URL ? process.env.MONGO_URL : "";
const app = express();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally shutdown the server in production
  // process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Optionally shutdown the server in production
  // process.exit(1);
});


app.use(cors());
app.use(express.json());
// Global error handlers


app.get("/", (req, res) => {
  res.send("Hello World!");
});

import connectToMongoDb from "./config/db.js";

import authRoutes from "./routes/auth.route.js";
app.use("/auth", authRoutes);

import userRoute from"./routes/user.route.js"
app.use("/user", userRoute);

// app.listen(PORT, async () => {
//   try {
//     await connectToMongoDb(mongoUrl);
//     console.log(`server running on port ${PORT}`);
//   } catch (err) {
//     console.log(err);
//   }
// });


//Database connection and server start
const startServer = async () => {
  try {
    await connectToMongoDb(mongoUrl);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();