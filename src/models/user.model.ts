import mongoose from "mongoose";

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
    expires: "1h",
  },
});

const User = mongoose.model("Users", userSchema);
export default User;
