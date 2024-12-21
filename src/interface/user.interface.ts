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
  username: string;
  email: string;
  bio: string;
  website: string;
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
