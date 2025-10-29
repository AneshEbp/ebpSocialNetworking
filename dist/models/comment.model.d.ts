import mongoose, { Types } from "mongoose";
import type IComment from "../types/comment.type.js";
declare const Comment: mongoose.Model<IComment, {}, {}, {}, mongoose.Document<unknown, {}, IComment, {}, mongoose.DefaultSchemaOptions> & IComment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<IComment, mongoose.Model<IComment, any, any, any, mongoose.Document<unknown, any, IComment, any, {}> & IComment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IComment, mongoose.Document<unknown, {}, mongoose.FlatRecord<IComment>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<IComment> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>>;
export default Comment;
//# sourceMappingURL=comment.model.d.ts.map