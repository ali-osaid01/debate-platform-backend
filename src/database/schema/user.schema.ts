import { Schema, Document, Types } from "mongoose";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { IUser } from "../../interface/user.interface";
import { EUserRole, Subscription_Type } from "../../interface/enum";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string;
        email: string;
        username: string;
        role: string;
      };
    }
  }
}

export type UserDocument = IUser & Document;
export const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String },
    email: { type: String, lowercase: true },
    username: { type: String, lowercase: true, unique: true },
    password: { type: String, require: true, select: false },
    role: { type: String, enum: Object.values(EUserRole), default: "user" },
    socialAuth: { type: String },
    bio: { type: String, default: null },
    dob: { type: Date },
    badge:[{type:Types.ObjectId,ref:'Badge'}],
    gender: { type: String },
    phone: { type: String, default: null },
    website: { type: String, default: null },
    isProfileCompleted: { type: Boolean, default: false },
    followingCount: { type: Number, default: 0, positive: true },
    followerCount: { type: Number, default: 0, positive: true },
    postCount: { type: Number, default: 0, positive: true },
    languagePreference: { type: String, default: "en" },
    interest:[{type:Types.ObjectId,ref:'Category'}],
    subscription: {
      plan: { type: String, enum: Object.values(Subscription_Type) },
      subscribe: { type: Boolean, default: false },
      price: { type: String, default: null },
      product: { type: String, default: null },
      subscriptionAuth: { type: String, default: null },
      expirytime: { type: Date, default: null },
    },
    notification: {
      isEmailNotificationAllow: { type: Boolean, default: false },
      isPushNotificationAllow: { type: Boolean, default: false },
      isMarketingNotificationAllow: { type: Boolean, default: false },
      isPromotionalNotificationAllow: { type: Boolean, default: false },
    },
    customer: { type: String, default: null },
    profilePicture: { type: String, default: null },
    fcmToken: { type: String, select: false },
    location: { type: String, default: null },
    otp: { type: Number },
    settings: {
      notification: { type: Boolean, default: true },
    },
  },
  { timestamps: true, versionKey: false },
);

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.pre<UserDocument>("save", async function (next: any) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password as string, 10);
  next();
});

UserSchema.methods.isPasswordCorrect = async function (
  password: string,
): Promise<boolean> {
  return await compare(password, this.password);
};

UserSchema.methods.generateAccessToken = function (): string {
  return sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

UserSchema.methods.generateRefreshToken = function (): string {
  return sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};
