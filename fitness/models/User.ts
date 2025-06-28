import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  emailVerified: boolean;
  otp?: string;
  otpCreatedAt?: Date;
  avatar?: string;
  bio?: string;

  // New workout planner fields:
  workoutData?: {
    goal?: string;
    planType?: string;
    height?: string;
    weight?: string;
    allergy?: string;
    gender?: string;
    injuries?: string;
  };
  workoutPlan?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    emailVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpCreatedAt: { type: Date },
    avatar: {
      type: String,
      default:
        "https://play-lh.googleusercontent.com/nV5JHE9tyyqNcVqh0JLVGoV2ldpAqC8htiBpsbjqxATjXQnpNTKgU99B-euShOJPu-8",
    },
    bio: { type: String, default: "" },

    // New fields for workout planner data
    workoutData: {
      goal: { type: String },
      planType: { type: String },
      height: { type: String },
      weight: { type: String },
      allergy: { type: String },
      gender: { type: String },
      injuries: { type: String },
    },
    workoutPlan: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
