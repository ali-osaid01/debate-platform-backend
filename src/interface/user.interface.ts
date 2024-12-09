export interface IUser {
    id: string;
    _id: string;
    name: string;
    email: string;
    bio:string;
    website:string
    socialAuth:string
    dob:Date;
    followingCount:number
    followerCount:number
    postCount:number
    phone:string
    settings:{
        notification:boolean
    }
    location:string;
    gender:string;
    isProfileCompleted:boolean
    profilePicture:string;
    password: string;
    role: string;
    otp:number
    fcmToken?: string;
    createdAt: string;
    updatedAt: string;
}