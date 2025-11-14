import User from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "../utils/sendMail.js";
const isExistingUser = async (email) => {
    try {
        const existUser = await User.findOne({ email });
        if (existUser)
            return false;
        else
            return true;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
const hashedPassword = async (password) => {
    try {
        const salt = parseInt(process.env.SALT || "10");
        return await bcrypt.hash(password, salt);
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }
    catch (err) {
        console.log(err);
        return false;
    }
};
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
// const register = async (req: Request, res: Response) => {
//   try {
//     const { email, name, password } = req.body;
//     if (!validator.isEmail(email)) {
//       return res.send("invalid email");
//     }
//     if (!validator.isLength(name, { min: 3, max: 15 }))
//       return res.send(
//         "name must have at least three character and should not exceed 15 character"
//       );
//     if (!validator.isLength(password, { min: 6, max: 12 }))
//       return res.send(
//         "password must have atleast 6 character and should not exceed 12 characters"
//       );
//     const userExist = await isExistingUser(email);
//     if (!userExist) {
//       return res.send("user with email already exists");
//     }
//     const hashedPwd = await hashedPassword(password);
//     const verificationCode = generateVerificationCode();
//     const registerUser = new User({
//       name,
//       email,
//       password: hashedPwd,
//       verificationCode: {
//         createdAt: Date.now(),
//         code: verificationCode,
//       },
//       defaultVerificationCode: 123456,
//     });
//     const registeredUser = await registerUser.save();
//     if (!registeredUser) return res.send("user registration failed");
//     const context = {
//       name: `${name}`,
//       verificationCode: `${verificationCode}`,
//     };
//     // await sendMail(
//     //   email,
//     //   "Account Verification Mail",
//     //   "emailVerification",
//     //   context
//     // );
//     return res.send("user registered successfully");
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
const register = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        // ✅ Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }
        // ✅ Validate name length
        if (!validator.isLength(name, { min: 3, max: 15 })) {
            return res.status(400).json({
                message: "Name must have at least 3 characters and should not exceed 15 characters",
            });
        }
        // ✅ Validate password length
        if (!validator.isLength(password, { min: 6, max: 12 })) {
            return res.status(400).json({
                message: "Password must have at least 6 characters and should not exceed 12 characters",
            });
        }
        // ✅ Check if user already exists
        const userExist = await isExistingUser(email);
        if (!userExist) {
            return res
                .status(409)
                .json({ message: "User with this email already exists" });
        }
        // ✅ Hash password and generate verification code
        const hashedPwd = await hashedPassword(password);
        const verificationCode = generateVerificationCode();
        // ✅ Create new user
        const registerUser = new User({
            name,
            email,
            password: hashedPwd,
            verificationCode: {
                createdAt: Date.now(),
                code: verificationCode,
            },
            defaultVerificationCode: 123456,
        });
        const registeredUser = await registerUser.save();
        if (!registeredUser) {
            return res.status(500).json({ message: "User registration failed" });
        }
        const context = {
            name: `${name}`,
            verificationCode: `${verificationCode}`,
        };
        await sendMail(email, "Account Verification Mail", "emailVerification", context);
        return res.status(201).json({
            message: "User registered successfully",
            data: {
                id: registeredUser._id,
                name: registeredUser.name,
                email: registeredUser.email,
            },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
// const verifyEmail = async (req: Request, res: Response) => {
//   let { email, verificationCode } = req.body;
//   verificationCode = parseInt(verificationCode);
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).send("user not found");
//     }
//     if (verificationCode == 123456) {
//       await User.findOneAndUpdate(
//         { email },
//         { $set: { verified: true }, $unset: { verificationCode: "" } }
//       );
//       return res.send("email verified successfully");
//     }
//     if (
//       user.verificationCode.createdAt.getTime() <
//       Date.now() - 5 * 60 * 1000
//     ) {
//       console.log("Verification code expired");
//       return res.status(400).send("invalid verification code");
//     }
//     if (user.verificationCode.code === verificationCode) {
//       await User.findOneAndUpdate(
//         { email },
//         { $set: { verified: true }, $unset: { verificationCode: "" } }
//       );
//       return res.send("email verified successfully");
//     } else {
//       console.log("Invalid verification code");
//       return res.status(400).send("invalid verification code");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
const verifyEmail = async (req, res) => {
    let { email, verificationCode } = req.body;
    verificationCode = parseInt(verificationCode);
    try {
        const user = await User.findOne({ email });
        // ✅ Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // ✅ Handle default verification code (for testing/admin)
        if (verificationCode === 123456) {
            await User.findOneAndUpdate({ email }, { $set: { verified: true }, $unset: { verificationCode: "" } });
            return res.status(200).json({ message: "Email verified successfully" });
        }
        // ✅ Check for expired code (older than 5 minutes)
        if (user.verificationCode?.createdAt.getTime() <
            Date.now() - 5 * 60 * 1000) {
            console.log("Verification code expired");
            return res.status(400).json({ message: "Verification code expired" });
        }
        // ✅ Validate verification code match
        if (user.verificationCode?.code === verificationCode) {
            await User.findOneAndUpdate({ email }, { $set: { verified: true }, $unset: { verificationCode: "" } });
            return res.status(200).json({ message: "Email verified successfully" });
        }
        else {
            console.log("Invalid verification code");
            return res.status(400).json({ message: "Invalid verification code" });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
// const resendVerificationCode = async (req: Request, res: Response) => {
//   const { email } = req.body;
//   if (!email || !validator.isEmail(email)) {
//     return res.send("invalid email");
//   }
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).send("user not found");
//     }
//     if (
//       !(user.verificationCode.createdAt.getTime() < Date.now() - 5 * 60 * 1000)
//     ) {
//       return res.status(400).send("verification code  has not expired yet");
//     }
//     const verificationCode = generateVerificationCode();
//     user.verificationCode = {
//       createdAt: new Date(),
//       code: verificationCode,
//     };
//     user.defaultVerificationCode = 123456;
//     await user.save();
//     const context = {
//       name: `${user.name}`,
//       verificationCode: `${verificationCode}`,
//     };
//     // await sendMail(
//     //   email,
//     //   "Resend Verification Code",
//     //   "emailVerification",
//     //   context
//     // );
//     return res.send("verification code resent successfully");
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("Internal server error");
//   }
// };
// const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   if (!validator.isEmail(email)) {
//     return res.send("invalid email");
//   }
//   if (!validator.isLength(password, { min: 6, max: 12 })) {
//     return res.send(
//       "password must have atleast 6 character and should not exceed 12 character"
//     );
//   }
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.send("invalid credentials");
//     }
//     if (!user.password) {
//       return res.status(500).send("User password not set.");
//     }
//     if (user.verified === false) {
//       return res.status(403).send("User email not verified");
//     }
//     const isMatch: boolean = await comparePassword(password, user.password);
//     if (!isMatch) {
//       return res.send("invalid credentials");
//     }
//     const ip = req.ip;
//     const userAgent = req.headers["user-agent"];
//     const uniqueid = ip + "-" + userAgent;
//     console.log("User Agent:", userAgent);
//     if (!ip) {
//       return res.send("IP address not found");
//     }
//     const loginIps = user.loginIp || [];
//     // Check if IP is already in the list
//     const ipExists = loginIps.includes(uniqueid);
//     if (!ipExists) {
//       if (loginIps.length >= 3) {
//         return res.send("Maximum 3 devices are allowed");
//       }
//       user?.loginIp?.push(uniqueid); // Add new IP
//     }
//     const jwtsecretkey: string = process.env.JWT_SECRET || "your_jwt_secret";
//     const jwtId = uuidv4();
//     const token: string = jwt.sign({ id: user._id, jwtId }, jwtsecretkey, {
//       expiresIn: "7 day",
//     });
//     user.whitelist?.push(jwtId);
//     await user.save();
//     const data = {
//       token,
//       id: user._id,
//       name: user.name,
//       email: user.email,
//     };
//     res.json({ data, message: "login successful" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("internal server error");
//   }
// };
const resendVerificationCode = async (req, res) => {
    const { email } = req.body;
    // ✅ Validate email
    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email" });
    }
    try {
        const user = await User.findOne({ email });
        // ✅ Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // ✅ Check if old verification code has expired (5 min)
        if (!(user.verificationCode?.createdAt.getTime() < Date.now() - 5 * 60 * 1000)) {
            return res
                .status(400)
                .json({ message: "Verification code has not expired yet" });
        }
        // ✅ Generate and update verification code
        const verificationCode = generateVerificationCode();
        user.verificationCode = {
            createdAt: new Date(),
            code: verificationCode,
        };
        user.defaultVerificationCode = 123456;
        await user.save();
        // ✅ Prepare email context
        const context = {
            name: user.name,
            verificationCode: verificationCode.toString(),
        };
        await sendMail(email, "Resend Verification Code", "emailVerification", context);
        return res
            .status(200)
            .json({ message: "Verification code resent successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email" });
    }
    if (!validator.isLength(password, { min: 6, max: 12 })) {
        return res.status(400).json({
            message: "Password must have at least 6 characters and should not exceed 12 characters",
        });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        if (!user.password) {
            return res.status(500).json({ message: "User password not set" });
        }
        if (user.verified === false) {
            return res.status(403).json({ message: "User email not verified" });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const ip = req.ip;
        const userAgent = req.headers["user-agent"];
        const uniqueid = ip + "-" + userAgent;
        if (!ip) {
            return res.status(400).json({ message: "IP address not found" });
        }
        const loginIps = user.loginIp || [];
        const ipExists = loginIps.includes(uniqueid);
        if (!ipExists) {
            if (loginIps.length >= 3) {
                return res
                    .status(403)
                    .json({ message: "Maximum 3 devices are allowed" });
            }
            user?.loginIp?.push(uniqueid);
        }
        const jwtsecretkey = process.env.JWT_SECRET || "your_jwt_secret";
        const jwtId = uuidv4();
        const token = jwt.sign({ id: user._id, jwtId }, jwtsecretkey, {
            expiresIn: "7d",
        });
        user.whitelist?.push(jwtId);
        await user.save();
        const data = {
            token,
            id: user._id,
            name: user.name,
            email: user.email,
        };
        return res.status(200).json({ message: "Login successful", data });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
// export const logout = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     const jwtId = req.user?.jwtId;
//     if (!userId || !jwtId) {
//       return res.status(401).send("user not found");
//     }
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).send("user not found");
//     }
//     if (!user.loginIp) {
//       user.loginIp = [];
//     }
//     user.loginIp = user.loginIp.filter((ip) => ip !== req.ip);
//     if (!user.whitelist) {
//       user.whitelist = [];
//     }
//     user.whitelist = user.whitelist.filter((id) => id !== jwtId);
//     await user.save();
//     res.status(200).send("logout successful");
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("internal server error");
//   }
// };
export const logout = async (req, res) => {
    try {
        const userId = req.user?.id;
        const jwtId = req.user?.jwtId;
        // ✅ Check for valid authentication
        if (!userId || !jwtId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        // ✅ Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // ✅ Remove current device IP
        if (!user.loginIp)
            user.loginIp = [];
        user.loginIp = user.loginIp.filter((ip) => ip !== req.ip);
        // ✅ Remove JWT from whitelist
        if (!user.whitelist)
            user.whitelist = [];
        user.whitelist = user.whitelist.filter((id) => id !== jwtId);
        await user.save();
        return res.status(200).json({ message: "Logout successful" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const logoutFromAllDevices = async (req, res) => {
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
    }
    catch (err) {
        console.log(err);
        res.status(500).send("internal server error");
    }
};
// const changePassword = async (req: Request, res: Response) => {
//   try {
//     const { oldPassword, newPassword } = req.body;
//     const userId = req.user?.id;
//     if (!validator.isLength(oldPassword, { min: 6, max: 12 })) {
//       return res.send(
//         "password must have atleast 6 character and should not exceed 12 character"
//       );
//     }
//     if (!validator.isLength(newPassword, { min: 6, max: 12 })) {
//       return res.send(
//         "password must have atleast 6 character and should not exceed 12 character"
//       );
//     }
//     if (!userId) {
//       return res.status(401).send("user not found");
//     }
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).send("user not found");
//     }
//     if (!user.password) {
//       return res.status(500).send("User password not set.");
//     }
//     const isMatch = await comparePassword(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(401).send("old password is incorrect");
//     }
//     const hashedNewPassword = await hashedPassword(newPassword);
//     user.password = hashedNewPassword;
//     await user.save();
//     return res.send("password changed successfully");
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("internal server error");
//   }
// };
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user?.id;
        // ✅ Validate passwords
        if (!validator.isLength(oldPassword, { min: 6, max: 12 })) {
            return res.status(400).json({
                message: "Old password must have at least 6 characters and should not exceed 12 characters",
            });
        }
        if (!validator.isLength(newPassword, { min: 6, max: 12 })) {
            return res.status(400).json({
                message: "New password must have at least 6 characters and should not exceed 12 characters",
            });
        }
        // ✅ Check authentication
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        // ✅ Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.password) {
            return res.status(500).json({ message: "User password not set" });
        }
        // ✅ Verify old password
        const isMatch = await comparePassword(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }
        // ✅ Hash and save new password
        const hashedNewPassword = await hashedPassword(newPassword);
        user.password = hashedNewPassword;
        await user.save();
        return res.status(200).json({ message: "Password changed successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const generateResetToken = async (userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || "your_jwt_secret", {
        expiresIn: "1h",
    });
    return token;
};
const sendResetEmail = async (email, token) => {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    await sendMail(email, "Password Reset", "resetEmail", { resetLink });
    console.log(`Sending password reset email to ${email} with link: ${resetLink}`);
};
const forgotPassword = async (req, res) => {
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
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("internal server error");
    }
};
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token && !newPassword) {
            return res.status(400).send("token and new password are required");
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
        if (!payload) {
            return res.status(401).send("invalid token");
        }
        const user = await User.findById(payload.id);
        if (!user) {
            return res.status(404).send("user not found");
        }
        user.password = await hashedPassword(newPassword);
        user.resetPasswordToken = null;
        await user.save();
        return res.send("password reset successfully");
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("internal server error");
    }
};
export { register, verifyEmail, login, changePassword, forgotPassword, resetPassword, resendVerificationCode, };
//# sourceMappingURL=auth.controller.js.map