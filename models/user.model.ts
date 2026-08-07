import mongoose, { Mongoose } from "mongoose";

interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  role?: "user" | "admin" | "partner";
  isEmailVerified?: boolean;
  otp?: string;
  otpExpiresAt?: Date;
  partnerOnboardingSteps: number;
  mobileNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["user", "admin", "partner"], default: "user" },
  isEmailVerified: { type: Boolean, default: false },
  otp: { type: String },
  partnerOnboardingSteps: { type: Number, min: 0, max: 8, default: 0 },
  mobileNumber: { type: String },
  otpExpiresAt: { type: Date }
}, { timestamps: true });


const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;