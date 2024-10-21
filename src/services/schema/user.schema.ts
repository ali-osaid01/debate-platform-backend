import { Schema, Document } from "mongoose";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { IUser } from "../../interface/user.interface";
import { EUserRole } from "../../interface/enum";

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string,
                name: string,
                email: string,
                role: string,
            };
        }
    }
}

export type UserDocument = IUser & Document;

export const UserSchema = new Schema<UserDocument>({
    name: { type: String },
    email: { type: String, lowercase: true },
    password: { type: String, require: true, select: false },
    role: { type: String, enum: Object.values(EUserRole), default: "user" },
    fcmToken: { type: String, require: true, select: false },
    otp:{ type:Number }
}, { timestamps: true, versionKey: false });

// UserSchema.index({ email: 1 }, { unique: true });

UserSchema.pre<UserDocument>("save", async function (next: any) {
    if (!this.isModified("password")) return next();
    this.password = await hash(this.password as string, 10);
    next();
});

UserSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await compare(password, this.password);
};

UserSchema.methods.generateAccessToken = function (): string {
    return sign(
        {
            id: this._id,
            name: this.name,
            email: this.email,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

UserSchema.methods.generateRefreshToken = function (): string {
    return sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};