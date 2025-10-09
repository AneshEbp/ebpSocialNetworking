import express, { Router } from "express";
import { deleteAcademicQualification, deleteHobby, getUserProfile, updateAcademicQualification, updateDateOfBirth, updateHobbies } from "../controllers/user.controller.js";
import jwtVerify from "../middlewares/jwtVerify.js";

const router = Router();

router.get("/profile", jwtVerify, getUserProfile);
router.put("/hobbies", jwtVerify, updateHobbies);
router.delete("/hobbies", jwtVerify, deleteHobby);
router.put("/date-of-birth", jwtVerify, updateDateOfBirth);
router.put("/academic-qualification", jwtVerify, updateAcademicQualification);
router.delete("/academic-qualification", jwtVerify, deleteAcademicQualification);

export default router;
