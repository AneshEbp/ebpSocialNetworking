import User from "../models/user.model.js";
import { Types } from "mongoose";
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send("user not found");
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("user not found");
        }
        return res.json({ user });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("internal server error");
    }
};
export const updateHobbies = async (req, res) => {
    try {
        const { hobbies } = req.body;
        console.log(hobbies);
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send("user not found");
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("user not found");
        }
        if (user.hobbies == null) {
            user.hobbies = hobbies;
        }
        else {
            user.hobbies.push(...hobbies);
        }
        await user.save();
        return res.json({ user });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("internal server error");
    }
};
export const deleteHobby = async (req, res) => {
    try {
        const { hobby } = req.body;
        console.log(hobby);
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send("user not found");
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("user not found");
        }
        console.log(user.hobbies);
        user.hobbies = user.hobbies.filter((h) => h !== hobby);
        await user.save();
        return res.json({ user });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("internal server error");
    }
};
export const updateDateOfBirth = async (req, res) => {
    try {
        const { dateOfBirth } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send("user not found");
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("user not found");
        }
        user.dateOfBirth = dateOfBirth;
        await user.save();
        return res.json({ user, message: "Date of birth updated successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("internal server error");
    }
};
export const updateAcademicQualification = async (req, res) => {
    try {
        const { academicQualification, } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send("user not found");
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("user not found");
        }
        user.academicQualification.push(...academicQualification);
        await user.save();
        return res.json({
            user,
            message: "Academic qualification updated successfully",
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("internal server error");
    }
};
export const deleteAcademicQualification = async (req, res) => {
    try {
        const { degreeName } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send("user not found");
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("user not found");
        }
        user.academicQualification = user.academicQualification.filter((qual) => qual.degreeName !== degreeName);
        await user.save();
        return res.json({ user });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("internal server error");
    }
};
export const updateLocation = async (req, res) => {
    try {
        const { location, } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send("user not found");
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("user not found");
        }
        user.location = location;
        await user.save();
        return res.json({ user, message: "Location updated successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("internal server error");
    }
};
export const followUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { followUserId } = req.body;
        if (!userId || !followUserId) {
            return res.status(401).send("User not found");
        }
        const user = await User.findById(userId);
        const followuser = await User.findById(followUserId);
        if (!user || !followuser) {
            return res.status(404).send("User not found");
        }
        if (user?.following.includes(followUserId)) {
            return res.status(400).send("You are already following this user");
        }
        user.following.push(followUserId);
        followuser.followers.push(userId);
        const userSaveResult = await user.save();
        const followuserSaveResult = await followuser.save();
        if (!userSaveResult || !followuserSaveResult) {
            return res.status(500).send("Internal server error");
        }
        return res.json({ message: `You are now following ${followuser.name}` });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};
export const unfollowUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { unfollowUserId } = req.body;
        if (!userId || !unfollowUserId) {
            return res.status(401).send("Userid not found");
        }
        const user = await User.findById(userId);
        const unfollowUser = await User.findById(unfollowUserId);
        if (!user || !unfollowUser) {
            return res.status(404).send("UserDetails not found");
        }
        if (!user?.following.includes(unfollowUserId)) {
            return res.status(400).send("You are not following this user");
        }
        user.following = user.following.filter((id) => id.toString() !== unfollowUserId);
        unfollowUser.followers = unfollowUser.followers.filter((id) => id.toString() !== userId);
        const userSaveResult = await user.save();
        const unfollowUserSaveResult = await unfollowUser.save();
        console.log("User unfollowed:", userSaveResult);
        console.log("User following updated:", unfollowUserSaveResult);
        if (!userSaveResult || !unfollowUserSaveResult) {
            return res.status(500).send("Internal server error");
        }
        return res.json({ message: "Unfollowed user successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};
export const getFollowers = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send("User not found");
        }
        const followersResult = await User.findById(userId, {
            _id: 0,
            followers: 1,
        }).populate("followers", "_id name");
        if (!followersResult) {
            return res.status(404).send("User not found");
        }
        return res.json({
            followers: followersResult,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};
export const getFollowing = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send("User not found");
        }
        const followingResult = await User.findById(userId, {
            _id: 0,
            following: 1,
        }).populate("following", "_id name");
        if (!followingResult) {
            return res.status(404).send("User not found");
        }
        return res.json({ following: followingResult });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};
//# sourceMappingURL=user.controller.js.map