// auth.service.ts
import { userRepository } from "../services";
import { generateOTP } from "../utils/helpers";
import { hash } from "bcrypt";
import { IUser } from "../interface/user.interface";
import Response from "../utils/response";

class AuthService {
    private responseHandler = new Response();

    public async register(userData: Partial<IUser>) {
        const existingUser = await userRepository.getOne({ email: userData.email });
        if (existingUser) {
            return this.responseHandler.sendResponse(409, "User already exists");
        }

        const user: any = await userRepository.create(userData);
        const accessToken = await user.generateAccessToken();
        return this.responseHandler.sendSuccessResponse("Registration successful", { user, accessToken });
    }

    public async login(email: string, password: string, fcmToken: string) {
        let user: any = await userRepository.getOne({ email }, '+password');
        if (!user) {
            return this.responseHandler.sendResponse(401, "Invalid email or password");
        }

        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) {
            return this.responseHandler.sendResponse(401, "Invalid password");
        }

        const accessToken = await user.generateAccessToken();

        user = await userRepository.updateOne({ _id: user._id }, { fcmToken }).select('+fcmtoken');
        return this.responseHandler.sendSuccessResponse("Login successful", { user, accessToken });
    }

    public async sendOtp(email: string) {
        const user = await userRepository.getOne({ email }).lean();
        if (!user) {
            return this.responseHandler.sendResponse(400, "User not found");
        }

        const otp = generateOTP();
        await userRepository.updateById(user._id, { otp });
        return this.responseHandler.sendSuccessResponse("OTP sent to email", { otp });
    }

    public async verifyOtp(email: string, otp: string) {
        const user: any = await userRepository.getOne({ email });
        if (!user) {
            return this.responseHandler.sendResponse(400, "User not found");
        }

        if (user.otp !== otp) {
            return this.responseHandler.sendResponse(401, "Invalid OTP");
        }

        await userRepository.updateById(user._id, { otp: null, isVerified: true });
        const token = await user.generateAccessToken();
        return this.responseHandler.sendSuccessResponse("OTP verified successfully", { token });
    }

    public async resetPassword(userId: string, newPassword: string) {
        if (!userId) return this.responseHandler.sendResponse(401, "Unauthorized Request");
        const hashedPassword = await hash(newPassword, 10);
        await userRepository.updateById(userId, { password: hashedPassword });
        return this.responseHandler.sendSuccessResponse("Password reset successfully");
    }

    public async googleAuth(email: string, socialAuth: string, fcmToken: string,name:string,profilePicture:string) {
        const isUserExist:any = await userRepository.getOne({$or:[{socialAuth},{email}]});
        if(isUserExist){
            const accessToken = await isUserExist.generateAccessToken();
            return this.responseHandler.sendSuccessResponse("Google Login Successfully",{user:isUserExist,accessToken:accessToken});
        }
        
        const user = await this.register({email,socialAuth,fcmToken,name,profilePicture})
        return this.responseHandler.sendSuccessResponse("User Register Successfully",user?.data);
    }
}

export default AuthService
