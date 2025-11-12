import mongoose, { Types } from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    hobbies: {
        type: [String],
        default: [],
    },
    dateOfBirth: {
        type: String,
        default: null,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
            index: "2dsphere",
        },
    },
    followers: {
        type: [Types.ObjectId],
        ref: "Users",
        default: [],
    },
    following: {
        type: [Types.ObjectId],
        ref: "Users",
        default: [],
    },
    academicQualification: {
        type: [
            {
                passedYear: { type: Number },
                degreeName: { type: String },
            },
        ],
        default: [],
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    loginIp: {
        type: [String],
        default: [],
    },
    whitelist: {
        type: [String],
        default: [],
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        createdAt: { type: Date, default: Date.now },
        code: { type: Number },
    },
    defaultVerificationCode: {
        type: Number,
    },
});
const User = mongoose.model("Users", userSchema);
export default User;
//# sourceMappingURL=user.model.js.map