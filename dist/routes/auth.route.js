import express, { Router } from "express";
import { register, login, changePassword, logoutFromAllDevices, logout, forgotPassword, resetPassword, verifyEmail, resendVerificationCode, } from "../controllers/auth.controller.js";
import jwtVerify from "../middlewares/jwtVerify.js";
const router = Router();
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-code", resendVerificationCode);
router.post("/login", login);
router.post("/change-password", jwtVerify, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", jwtVerify, logout);
router.post("/logout-all", jwtVerify, logoutFromAllDevices);
export default router;
//# sourceMappingURL=auth.route.js.map