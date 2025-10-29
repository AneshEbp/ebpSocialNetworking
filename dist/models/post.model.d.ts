import mongoose from "mongoose";
import type IPost from "../types/post.type.js";
declare const Post: mongoose.Model<IPost, {}, {}, {}, mongoose.Document<unknown, {}, IPost, {}, mongoose.DefaultSchemaOptions> & IPost & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<IPost, mongoose.Model<IPost, any, any, any, mongoose.Document<unknown, any, IPost, any, {}> & IPost & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IPost, mongoose.Document<unknown, {}, mongoose.FlatRecord<IPost>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<IPost> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Post;
//# sourceMappingURL=post.model.d.ts.map