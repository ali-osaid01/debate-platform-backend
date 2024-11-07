import { Request, Response, NextFunction, RequestHandler } from 'express';
import { userRepository } from '../services';
import { hash } from 'bcrypt';
import { EUserRole } from '../interface/enum';

export const parseBody = (body: any) => {
    if (typeof body === 'string') {
        return JSON.parse(body);
    }
    return body;
}

export const asyncHandler = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export const generateOTP = () =>{
    return Math.floor(100000 + Math.random() * 900000);
}

export const createDefaultAdmin = async () => {
    try {
        const userExist = await userRepository.getOne({ email: process.env.ADMIN_DEFAULT_EMAIL, role: EUserRole.ADMIN });
        if (userExist) {
            console.log('admin exists ->', userExist.email);
            return
        };

        console.log('admin not exist');
        const password = await hash(process.env.ADMIN_DEFAULT_PASSWORD as string, 10);

        await userRepository.create({
            name: 'Admin',
            email: process.env.ADMIN_DEFAULT_EMAIL,
            password,
            role: EUserRole.ADMIN
        });

        console.log('Admin default created successfully');
    } catch (error) {
        console.log('error - create default admin -> ', error);
    }
};
