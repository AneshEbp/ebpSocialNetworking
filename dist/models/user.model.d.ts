import mongoose from "mongoose";
interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    hobbies: string[];
    dateOfBirth?: string | null;
    location: {
        type: "Point";
        coordinates: [number, number];
    };
    followers: string[];
    following: string[];
    academicQualification: {
        passedYear?: number;
        degreeName?: string;
    }[];
    resetPasswordToken?: string | null;
    loginIp?: string[];
    whitelist?: string[];
    verified: boolean;
    verificationCode: {
        createdAt: Date;
        code: Number;
    };
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, mongoose.Schema<IUser, mongoose.Model<IUser, any, any, any, mongoose.Document<unknown, any, IUser, any, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IUser, mongoose.Document<unknown, {}, mongoose.FlatRecord<IUser>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<IUser> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>>;
export default User;
//# sourceMappingURL=user.model.d.ts.map