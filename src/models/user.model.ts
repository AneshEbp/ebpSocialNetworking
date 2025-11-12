import mongoose, { Types } from "mongoose";

interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  hobbies: string[];
  dateOfBirth?: string | null;
  location: { type: "Point"; coordinates: [number, number] };
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
  defaultVerificationCode?: Number;
}

const userSchema = new mongoose.Schema<IUser>({
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
