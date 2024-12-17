import { Response } from "express";

export const setAccessTokenCookie = (res: Response, accessToken: string) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true, 
        secure: true, 
        sameSite: 'none',
        path: '/', 
        domain: '.debate-platform.vercel.app',
    });
};