import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserService } from '../services';
import { ROLES } from './constants';
import { hash } from 'bcrypt';

export const generateResponse = (data: any, message: string, res: Response, code = 200) => {
    return res.status(code).json({
        statusCode: code,
        message,
        data,
    });
}

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

// create default admin
export const createDefaultAdmin = async () => {
    try {
        const userExist = await UserService.getOne({ email: process.env.ADMIN_DEFAULT_EMAIL, role: ROLES.ADMIN });
        if (userExist) {
            console.log('admin exists ->', userExist.email);
            return
        };

        console.log('admin not exist');
        const password = await hash(process.env.ADMIN_DEFAULT_PASSWORD as string, 10);

        // create default admin
        await UserService.create({
            name: 'Admin',
            email: process.env.ADMIN_DEFAULT_EMAIL,
            password,
            role: ROLES.ADMIN
        });

        console.log('Admin default created successfully');
    } catch (error) {
        console.log('error - create default admin -> ', error);
    }
};
