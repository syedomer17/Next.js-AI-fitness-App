import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  emailVerified: boolean;
  otp?: string;
  otpCreatedAt?: Date;
  avatar?: string;
  bio?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    emailVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpCreatedAt: { type: Date },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
