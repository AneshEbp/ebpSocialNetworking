import express, { Router } from "express";
import { deleteAcademicQualification, deleteHobby, followUser, getFollowers, getFollowing, getUserProfile, unfollowUser, updateAcademicQualification, updateDateOfBirth, updateHobbies, updateLocation } from "../controllers/user.controller.js";
import jwtVerify from "../middlewares/jwtVerify.js";
const router = Router();
router.get("/profile", jwtVerify, getUserProfile);
router.put("/hobbies", jwtVerify, updateHobbies);
router.delete("/hobbies", jwtVerify, deleteHobby);
router.put("/date-of-birth", jwtVerify, updateDateOfBirth);
router.put("/academic-qualification", jwtVerify, updateAcademicQualification);
router.delete("/academic-qualification", jwtVerify, deleteAcademicQualification);
router.put("/location", jwtVerify, updateLocation);
router.get("/followers", jwtVerify, getFollowers);
router.get("/following", jwtVerify, getFollowing);
router.post("/follow", jwtVerify, followUser);
router.post("/unfollow", jwtVerify, unfollowUser);
export default router;
//# sourceMappingURL=user.route.js.map