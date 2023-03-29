import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface User {
  email: string;
  password: string;
  checkPassword(password: string): boolean;
}

export interface UserModel extends mongoose.Model<User> {
  checkPassword(password: string): boolean;
}


export const userSchema = new mongoose.Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  } else {
    var hash = bcrypt.hashSync(this.password, 8);
    this.password = hash;

    return next();
  }
});

userSchema.methods.checkPassword = function (password: any) {
  return bcrypt.compareSync(password, this.password);
};

export const User = mongoose.model<User,UserModel>("user", userSchema);
