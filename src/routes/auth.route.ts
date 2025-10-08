import express, { Router } from "express";
import {register, login, changePassword} from "../controllers/auth.controller.js"
import jwtVerify from "../middlewares/jwtVerify.js";

const router:Router=Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', jwtVerify, changePassword);

export default router;