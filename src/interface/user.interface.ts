export interface IUser {
    id: string;
    _id: string;
    name: string;
    email: string;
    bio:string,
    dob:Date,
    phone:string
    settings:{
        notification:boolean
    }
    gender:string,
    isProfileCompleted:boolean
    profilePictire:string,
    password: string;
    role: string;
    otp:number
    fcmToken?: string;
    createdAt: string;
    updatedAt: string;
}