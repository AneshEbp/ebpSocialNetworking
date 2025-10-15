import type { Request, Response } from "express";
import User from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const isExistingUser = async (email: string): Promise<boolean> => {
  try {
    const existUser = await User.findOne({ email });
    if (existUser) return false;
    else return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const hashedPassword = async (password: string): Promise<string> => {
  try {
    const salt = parseInt(process.env.SALT || "10");
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.log(err);

    throw err;
  }
};
const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.send("invalid email");
    }
    if (!validator.isLength(name, { min: 3, max: 15 }))
      return res.send(
        "name must have at least three character and should not exceed 15 character"
      );

    if (!validator.isLength(password, { min: 6, max: 12 }))
      return res.send(
        "password must have atleast 6 character and should not exceed 12 characters"
      );

    const userExist = await isExistingUser(email);
    if (!userExist) {
      return res.send("user with email already exists");
    }
    const hashedPwd = await hashedPassword(password);
    const registerUser = new User({
      name,
      email,
      password: hashedPwd,
    });
    await registerUser.save();
    console.log("here");
    return res.send("user registered successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.send("invalid email");
  }

  if (!validator.isLength(password, { min: 6, max: 12 })) {
    return res.send(
      "password must have atleast 6 character and should not exceed 12 character"
    );
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.send("invalid credentials");
    }
    if (!user.password) {
      return res.status(500).send("User password not set.");
    }

    const isMatch: boolean = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.send("invalid credentials");
    }

    const ip = req.ip;
    if (!ip) {
      return res.send("IP address not found");
    }
    const loginIps = user.loginIp || [];

    // Check if IP is already in the list
    const ipExists = loginIps.includes(ip);
    if (!ipExists) {
      if (loginIps.length >= 3) {
        return res.send("Maximum 3 devices are allowed");
      }
      user?.loginIp?.push(ip); // Add new IP
    }
    const jwtsecretkey: string = process.env.JWT_SECRET || "your_jwt_secret";
    const jwtId = uuidv4();
    const token: string = jwt.sign({ id: user._id, jwtId }, jwtsecretkey, {
      expiresIn: "7 day",
    });
    user.whitelist?.push(jwtId);
    await user.save();
    res.json({ token, message: "login successful" });
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const jwtId = req.user?.jwtId;

    if (!userId || !jwtId) {
      return res.status(401).send("user not found");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("user not found");
    }

    if (!user.loginIp) {
      user.loginIp = [];
    }
    user.loginIp = user.loginIp.filter((ip) => ip !== req.ip);
    if (!user.whitelist) {
      user.whitelist = [];
    }
    user.whitelist = user.whitelist.filter((id) => id !== jwtId);
    await user.save();

    res.status(200).send("logout successful");
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
};

export const logoutFromAllDevices = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send("user not found");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("user not found");
    }

    user.whitelist = [];
    user.loginIp = [];
    await user.save();

    res.send("logout from all devices successful");
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!validator.isLength(oldPassword, { min: 6, max: 12 })) {
      return res.send(
        "password must have atleast 6 character and should not exceed 12 character"
      );
    }
    if (!validator.isLength(newPassword, { min: 6, max: 12 })) {
      return res.send(
        "password must have atleast 6 character and should not exceed 12 character"
      );
    }
    if (!userId) {
      return res.status(401).send("user not found");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("user not found");
    }
    if (!user.password) {
      return res.status(500).send("User password not set.");
    }
    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).send("old password is incorrect");
    }

    const hashedNewPassword = await hashedPassword(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    return res.send("password changed successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).send("internal server error");
  }
};

const generateResetToken = async (userId: string) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "your_jwt_secret",
    {
      expiresIn: "1h",
    }
  );
  return token;
};

const sendResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  // Send the email using your preferred email service
  console.log(
    `Sending password reset email to ${email} with link: ${resetLink}`
  );
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log(`Received password reset request for email: ${email}`);
    if (!validator.isEmail(email)) {
      return res.send("invalid email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.send("user not found");
    }
    if (!user._id) {
      return res.status(500).send("User password not set.");
    }
    if (user.resetPasswordToken != null) {
      return res.send("password reset token already exists");
    }
    // Generate a password reset token and send it to the user's email
    const token = await generateResetToken(user._id.toString());
    user.resetPasswordToken = token;
    await user.save();
    await sendResetEmail(email, token);
    return res.send("password reset email sent");
  } catch (err) {
    console.log(err);
    return res.status(500).send("internal server error");
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token && !newPassword) {
      return res.status(400).send("token and new password are required");
    }
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    if (!payload) {
      return res.status(401).send("invalid token");
    }
    const user = await User.findById((payload as { id: string }).id);
    if (!user) {
      return res.status(404).send("user not found");
    }
    user.password = await hashedPassword(newPassword);
    user.resetPasswordToken = null;
    await user.save();
    return res.send("password reset successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).send("internal server error");
  }
};

export { register, login, changePassword, forgotPassword, resetPassword };
