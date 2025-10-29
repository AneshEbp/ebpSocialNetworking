import mongoose from "mongoose";
declare const TemplateModel: mongoose.Model<{
    name: string;
    content: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    content: string;
}, {}, mongoose.DefaultSchemaOptions> & {
    name: string;
    content: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    content: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    content: string;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    name: string;
    content: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default TemplateModel;
//# sourceMappingURL=template.model.d.ts.map