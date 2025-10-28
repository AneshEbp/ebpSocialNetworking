import type { Request, Response } from "express";
import User from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";

const sendMail = async (
  to: string,
  subject: string,
  template: string,
  context: {}
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASS,
      },
    });

    const hbsOptions = {
      viewEngine: {
        extname: ".hbs",
        partialsDir: "./views/partials",
        layoutsDir: "./views/layouts",
      },
      viewPath: "./views",
      extName: ".handlebars",
    };

    transporter.use("compile", hbs(hbsOptions));

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to,
      subject,
      template: `${template}`,
      context: context,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

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
const generateVerificationCode = (): Number => {
  return Math.floor(100000 + Math.random() * 900000);
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
    const verificationCode = generateVerificationCode();
    const registerUser = new User({
      name,
      email,
      password: hashedPwd,
      verificationCode: {
        createdAt: Date.now(),
        code: verificationCode,
      },
    });
    const registeredUser = await registerUser.save();
    if (!registeredUser) return res.send("user registration failed");

    const context = {
      name: `${name}`,
      verificationCode: `${verificationCode}`,
    };

    await sendMail(
      email,
      "Account Verification Mail",
      "emailVerification",
      context
    );
    return res.send("user registered successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  let { email, verificationCode } = req.body;
  verificationCode = parseInt(verificationCode);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("user not found");
    }
    if (
      user.verificationCode.createdAt.getTime() <
      Date.now() - 5 * 60 * 1000
    ) {
      console.log("Verification code expired");
      return res.status(400).send("invalid verification code");
    }
    if (user.verificationCode.code === verificationCode) {
      await User.findOneAndUpdate(
        { email },
        { $set: { verified: true }, $unset: { verificationCode: "" } }
      );

      return res.send("email verified successfully");
    } else {
      console.log("Invalid verification code");
      return res.status(400).send("invalid verification code");
    }
  } catch (err) {
    console.log(err);
  }
};

const resendVerificationCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.send("invalid email");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("user not found");
    }
    if (
      !(user.verificationCode.createdAt.getTime() < Date.now() - 5 * 60 * 1000)
    ) {
      return res.status(400).send("verification code  has not expired yet");
    }

    const verificationCode = generateVerificationCode();
    user.verificationCode = {
      createdAt: new Date(),
      code: verificationCode,
    };
    await user.save();

    const context = {
      name: `${user.name}`,
      verificationCode: `${verificationCode}`,
    };
    await sendMail(
      email,
      "Resend Verification Code",
      "emailVerification",
      context
    );
    return res.send("verification code resent successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
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
    if (user.verified === false) {
      return res.status(403).send("User email not verified");
    }

    const isMatch: boolean = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.send("invalid credentials");
    }

    const ip = req.ip;
    const userAgent = req.headers["user-agent"];
    const uniqueid = ip + "-" + userAgent;
    console.log("User Agent:", userAgent);
    if (!ip) {
      return res.send("IP address not found");
    }
    const loginIps = user.loginIp || [];

    // Check if IP is already in the list
    const ipExists = loginIps.includes(uniqueid);
    if (!ipExists) {
      if (loginIps.length >= 3) {
        return res.send("Maximum 3 devices are allowed");
      }
      user?.loginIp?.push(uniqueid); // Add new IP
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

  await sendMail(email, "Password Reset", "resetEmail", { resetLink });

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

export {
  register,
  verifyEmail,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  resendVerificationCode,
};
