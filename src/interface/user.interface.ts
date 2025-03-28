import { Types } from "mongoose";
import { ICategory } from "./category.interface";

export interface ISubscription {
  plan: string;
  subscribe: boolean;
  price: string;
  product: string;
  subscriptionAuth: string;
  expirytime: Date;
}

export interface IUser {
  id: string;
  _id: string;
  name: string;
  isDeleted:boolean;
  isActive:boolean;
  username: string;
  email: string;
  languagePreference: string;
  interest: string[] | Types.ObjectId[] | ICategory[];
  bio: string;
  website: string;
  badge: string[] | Types.ObjectId[];
  socialAuth: string;
  dob: Date;
  followingCount: number;
  followerCount: number;
  subscription: ISubscription;
  notification:{
    isEmailNotificationAllow: boolean;
    isPushNotificationAllow: boolean;
    isMarketingNotificationAllow: boolean;
    isPromotionalNotificationAllow: boolean;
  }
  customer:string
  postCount: number;
  phone: string;
  settings: {
    notification: boolean;
  };
  location: string;
  gender: string;
  isProfileCompleted: boolean;
  profilePicture: string;
  password: string;
  role: string;
  otp: number;
  fcmToken?: string;
  createdAt: string;
  updatedAt: string;
}
