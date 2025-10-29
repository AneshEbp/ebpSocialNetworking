import mongoose, { Types } from "mongoose";
const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    content: { type: String, required: true },
}, { timestamps: true });
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
//# sourceMappingURL=comment.model.js.map