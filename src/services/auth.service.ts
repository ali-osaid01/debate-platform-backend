// auth.service.ts
import { UserService } from "../services";
import { generateOTP } from "../utils/helpers";
import { hash } from "bcrypt";
import Response from "../utils/response";  // Assuming response.ts is in utils

class AuthService {
    private responseHandler = new Response();

    public async register(userData: any) {
        const existingUser = await UserService.getOne({ email: userData.email });
        if (existingUser) {
            return this.responseHandler.sendResponse(409, "User already exists");
        }

        const newUser:any = await UserService.create(userData);
        const accessToken = await newUser.generateAccessToken();
        return this.responseHandler.sendSuccessResponse("Registration successful", { newUser, accessToken });
    }

    public async login(email: string, password: string, fcmToken: string) {
        let user: any = await UserService.getOne({ email }, '+password');
        if (!user) {
            return this.responseHandler.sendResponse(400, "Invalid email or password");
        }

        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) {
            return this.responseHandler.sendResponse(401, "Invalid password");
        }

        const accessToken = await user.generateAccessToken();
        user = await UserService.updateOne({ _id: user._id }, { fcmToken }).select('+fcmtoken');
        return this.responseHandler.sendSuccessResponse("Login successful", { user, accessToken });
    }

    public async sendOtp(email: string) {
        const user = await UserService.getOne({ email }).lean();
        if (!user) {
            return this.responseHandler.sendResponse(400, "User not found");
        }

        const otp = generateOTP();
        await UserService.updateById(user._id, { otp });
        return this.responseHandler.sendSuccessResponse("OTP sent to email", { otp });
    }

    public async verifyOtp(email: string, otp: string) {
        const user: any = await UserService.getOne({ email });
        if (!user) {
            return this.responseHandler.sendResponse(400, "User not found");
        }

        if (user.otp !== otp) {
            return this.responseHandler.sendResponse(401, "Invalid OTP");
        }

        await UserService.updateById(user._id, { otp: null, isVerified: true });
        const token = await user.generateAccessToken();
        return this.responseHandler.sendSuccessResponse("OTP verified successfully", { token });
    }

    public async resetPassword(userId: string, newPassword: string) {
        const hashedPassword = await hash(newPassword, 10);
        await UserService.updateById(userId, { password: hashedPassword });
        return this.responseHandler.sendSuccessResponse("Password reset successfully");
    }
}

export default new AuthService();