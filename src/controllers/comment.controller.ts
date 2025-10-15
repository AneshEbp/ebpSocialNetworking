import express from "express";
import type { Request, Response } from "express";
import validator from "validator";
import Comment from "../models/comment.model.js";

export const addComment = async (req: Request, res: Response) => {
  const { postId, content } = req.body;
  const authorId = req.user?.id;
  if (!postId || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!authorId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!validator.isMongoId(postId)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }
  if (!validator.isLength(content, { min: 1, max: 500 })) {
    return res.status(400).json({ message: "Invalid content" });
  }
  try {
    const newComment = new Comment({ postId, content, authorId });
    await newComment.save();
    return res.status(201).json({ message: "Comment added successfully", comment: newComment });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const updateComment = async (req: Request, res: Response) => {
    const { commentId, content } = req.body;
    const authorId = req.user?.id;
    if (!commentId || !content) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!authorId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!validator.isMongoId(commentId)) {
        return res.status(400).json({ message: "Invalid comment ID" });
    }
    if (!validator.isLength(content, { min: 1, max: 500 })) {
        return res.status(400).json({ message: "Invalid content" });
    }
    try {
        const updatedComment = await Comment.findOneAndUpdate(
            { _id: commentId, authorId },
            { content },
            { new: true }
        );
        if (!updatedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res.status(200).json({ message: "Comment updated successfully", comment: updatedComment });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.body;
    const authorId = req.user?.id;
    if (!commentId) {
        return res.status(400).json({ message: "Comment ID is required" });
    }
    if (!authorId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!validator.isMongoId(commentId)) {
        return res.status(400).json({ message: "Invalid comment ID" });
    }
    try {
        const deletedComment = await Comment.findOneAndDelete({ _id: commentId, authorId });
        if (!deletedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
