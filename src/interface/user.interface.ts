export interface IUser {
    id: string;
    _id: string;
    name: string;
    email: string;
    bio:string;
    dob:Date;
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