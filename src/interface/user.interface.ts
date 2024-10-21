export interface IUser {
    id: string;
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    otp:number
    fcmToken?: string;
    createdAt: string;
    updatedAt: string;
}