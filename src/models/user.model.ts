import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    unique:true,
  },
  password: {
    type: String,
    require: true,
  },
});

const User = mongoose.model("Users", userSchema);
export default User;
