import Post from "../models/post.model.js";
import fs from "fs";
import Comment from "../models/comment.model.js";
import validator from "validator";
import User from "../models/user.model.js";
import { uploadToCloudinary } from "../middlewares/handleFile.js";
export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const author = req.user?.id;
        const image = req.file?.path;
        if (!title || !content || !image) {
            return res.status(400).send("All fields are required");
        }
        const imageUrl = await uploadToCloudinary(image);
        if (!author) {
            return res.status(401).send("User not authorized");
        }
        const newPost = new Post({ title, content, author, image: imageUrl });
        await newPost.save();
        return res
            .status(201)
            .json({ message: "Post created successfully", post: newPost });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};
export const getPosts = async (req, res) => {
    try {
        const userId = req.user?.id;
        const searchQuery = req.query.search?.trim() || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy;
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
        const allowedSortFields = ["createdAt", "title", "likesCounter"];
        allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
        const postFilter = {};
        if (searchQuery) {
            postFilter.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { content: { $regex: searchQuery, $options: "i" } },
            ];
        }
        const posts = await Post.find({ ...postFilter, author: userId })
            .skip(skip)
            .sort({ [sortBy]: sortOrder })
            .limit(limit)
            .populate("author", "name");
        const postList = await Promise.all(posts.map(async (post) => {
            const latestComment = await Comment.find({ postId: post._id }, { authorId: 1, content: 1, createdAt: 1 })
                .sort({ createdAt: -1 })
                .limit(3)
                .populate("authorId", "name");
            return { post, latestComment };
        }));
        const totalPosts = await Post.countDocuments({
            ...postFilter,
            author: userId,
        });
        const totalPages = Math.ceil(totalPosts / limit);
        const hasNextPage = totalPages > page;
        const hasPrevPage = page > 1;
        return res.status(200).json({
            postList,
            currentPage: page,
            totalPages,
            totalPosts,
            hasNextPage,
            hasPrevPage,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};
export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate("author", "name");
        if (!post) {
            return res.status(404).send("Post not found");
        }
        return res.status(200).json({ post });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};
export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content } = req.body;
        console.log(title, content);
        const image = req.file?.path;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        if (image) {
            try {
                // Delete the old image if it exists
                // if (post.image) {
                //   if (fs.existsSync(post.image)) {
                //     fs.unlinkSync(post.image);
                //     console.log("Old image deleted successfully.");
                //   }
                // }
                const imageUrl = await uploadToCloudinary(image);
                post.image = imageUrl;
            }
            catch (err) {
                console.error("Error deleting old image:", err);
                return res.status(500).send("Failed to update image.");
            }
        }
        post.title = title || post.title;
        post.content = content || post.content;
        await post.save();
        return res.status(200).json({ message: "Post updated successfully", post });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByIdAndDelete(postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        try {
            // Delete the old image if it exists
            if (post.image) {
                if (fs.existsSync(post.image)) {
                    fs.unlinkSync(post.image);
                    console.log("Old image deleted successfully.");
                }
            }
        }
        catch (err) {
            console.error("Error deleting old image:", err);
            return res.status(500).send("Failed to update image.");
        }
        return res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};
export const getPostComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const comments = await Comment.find({ postId })
            .skip(skip)
            .limit(limit)
            .populate("authorId", "name");
        const totalComments = await Comment.countDocuments({ postId });
        const totalPages = Math.ceil(totalComments / limit);
        const hasNextPage = totalPages > page;
        const hasPrevPage = page > 1;
        return res.status(200).json({
            comments,
            currentPage: page,
            totalPages,
            hasNextPage,
            hasPrevPage,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};
export const likePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user?.id;
        if (!validator.isMongoId(postId) || !postId) {
            return res.status(400).send("Invalid post ID");
        }
        if (!userId) {
            return res.status(401).send("Unauthorized");
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        if (post.likes.includes(userId)) {
            // User already liked the post, remove the like
            post.likes = post?.likes.filter((id) => id.toString() !== userId);
            post.likesCounter -= 1;
            await post.save();
            return res
                .status(200)
                .json({ message: "Post disliked successfully", post });
        }
        else {
            // User hasn't liked the post yet, add the like
            post.likes.push(userId);
            post.likesCounter += 1;
            await post.save();
            return res.status(200).json({ message: "Post liked successfully", post });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};
export const showFeed = async (req, res) => {
    try {
        const userId = req.user?.id;
        const searchQuery = req.query.search.trim() || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let skip = (page - 1) * limit;
        const sortBy = req.query.sortBy;
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
        const allowedSortFields = ["createdAt", "title", "likesCounter"];
        allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
        const postFilter = {};
        if (searchQuery) {
            postFilter.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { content: { $regex: searchQuery, $options: "i" } },
            ];
        }
        const userDetails = await User.findById(userId);
        if (!userDetails) {
            const feed = await Post.find({ ...postFilter })
                .populate("authorId", "name")
                .skip(skip)
                .limit(limit);
            const totalPosts = await Post.countDocuments();
            const totalPages = Math.ceil(totalPosts / limit);
            const hasNextPage = totalPages > page;
            const hasPrevPage = page > 1;
            return res.status(200).json({
                feed,
                currentPage: page,
                totalPages,
                totalPosts,
                hasNextPage,
                hasPrevPage,
            });
        }
        const following = userDetails.following;
        const feed = await Post.find({ author: { $in: following }, ...postFilter })
            .populate("author", "name")
            .lean()
            .skip(skip)
            .limit(limit);
        const totalPosts = await Post.countDocuments({
            authorId: { $in: following },
        });
        const totalPages = Math.ceil(totalPosts / limit);
        const hasNextPage = totalPages > page;
        const hasPrevPage = page > 1;
        return res.status(200).json({
            feed,
            currentPage: page,
            totalPages,
            totalPosts,
            hasNextPage,
            hasPrevPage,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};
//# sourceMappingURL=post.controller.js.map