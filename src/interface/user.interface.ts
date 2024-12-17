export interface IUser {
  id: string;
  _id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  website: string;
  socialAuth: string;
  dob: Date;
  followingCount: number;
  followerCount: number;
  subscription:{
    subscriptionId: string;
    subscriptionStatus: string;
    subscriptionPlan: string;
    subscriptionStart: Date;
    subscriptionEnd: Date;
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
