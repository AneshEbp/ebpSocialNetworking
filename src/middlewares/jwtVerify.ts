import type { Request, Response, NextFunction } from "express";

// Extend Express's Request interface to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

import jwt from "jsonwebtoken";

const jwtVerify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("authorization header missing or malformed");
    }

    const token = authHeader.split(" ")[1];
    console.log(token)
    if (!token) {
      return res.status(401).json({ message: "token missing" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const decoded = await jwt.verify(token, jwtSecret) ;
    req.user = decoded;

    next();
  } catch (err) {
    console.log("jwt verification failed", err);
    return res.status(403).json({ message: "invalid token" });
  }
};

export default jwtVerify;
