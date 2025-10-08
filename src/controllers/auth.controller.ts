import type { Request, Response } from "express";
import User from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    const jwtsecretkey: string = process.env.JWT_SECRET || "your_jwt_secret";
    const token: string = jwt.sign({ id: user._id }, jwtsecretkey, {
      expiresIn: "7 day",
    });
    res.json({ token, message: "login successful" });
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    console.log(oldPassword, newPassword);
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

export { register, login, changePassword };
