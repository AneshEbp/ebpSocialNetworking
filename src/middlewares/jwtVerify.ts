import type { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { log } from "console";

interface JwtPayload {
  id: string;
  jwtId: string;
}

// Extend Express's Request interface to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
    // file?: any;
  }
}

const jwtVerify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("authorization header missing or malformed");
    }

    const token = authHeader.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "token missing" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const decoded = (await jwt.verify(token, jwtSecret)) as JwtPayload;
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (!user.whitelist || !user.whitelist.includes(decoded.jwtId)) {
      return res.status(401).json({ message: "Token revoked or invalid" });
    }

    req.user = decoded;

    next();
  } catch (err) {
    console.log("jwt verification failed", err);
    return res.status(403).json({ message: "invalid token" });
  }
};

export default jwtVerify;
