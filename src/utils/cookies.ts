import { Response } from "express";

export const setAccessTokenCookie = (res: Response, accessToken: string) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: false, 
        secure: true, 
        sameSite: 'none',
        path: '/', 
        domain: 'debate-platform.vercel.app',
    });
};