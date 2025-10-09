import type { Request, Response } from "express";
import User from "../models/user.model.js";
import type { ObjectId } from "mongodb";

export const getUserProfile = async (req: Request, res: Response) => {
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
  } catch (err) {
    console.log(err);
    return res.status(500).send("internal server error");
  }
};

export const updateHobbies = async (req: Request, res: Response) => {
    try{
        const {hobbies}: {hobbies: Array<string>} = req.body;
        console.log(hobbies);
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).send("user not found");
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).send("user not found");
        }
        if(user.hobbies==null){
            user.hobbies = hobbies;
        }else{
            user.hobbies.push(...hobbies);
        }
        await user.save();
        return res.json({ user });
    }catch(err){
        console.log(err);
        return res.status(500).send("internal server error");
    }
}
export const deleteHobby = async (req: Request, res: Response) => {
    try {
        const { hobby }: { hobby: string } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send("user not found");
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("user not found");
        }
        user.hobbies = user.hobbies.filter(h => h !== hobby);
        await user.save();
        return res.json({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).send("internal server error");
    }
}

export const updateDateOfBirth = async (req: Request, res: Response) => {
    try{
        const {dateOfBirth}: {dateOfBirth: string} = req.body;
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).send("user not found");
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).send("user not found");
        }
        user.dateOfBirth = dateOfBirth;
        await user.save();
        return res.json({ user , message:"Date of birth updated successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).send("internal server error");
    }
}

export const deleteAcademicQualification = async (req: Request, res: Response) => {
    try {
        const { degreeId }: { degreeId: ObjectId } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send("user not found");
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("user not found");
        }
        user.academicQualification.pull({ _id: degreeId });
        await user.save();
        return res.json({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).send("internal server error");
    }
}

export const updateAcademicQualification = async (req: Request, res: Response) => {
    try{
        const {academicQualification}: {academicQualification: Array<{passedYear: number, degreeName: string}>} = req.body;
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).send("user not found");
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).send("user not found");
        }
        user.academicQualification.push(...academicQualification);
        await user.save();
        return res.json({ user , message:"Academic qualification updated successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).send("internal server error");
    }
}

