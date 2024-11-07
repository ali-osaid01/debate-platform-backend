import { RateLimitRequestHandler, rateLimit } from "express-rate-limit";
import { STATUS_CODES } from "../interface/enum";

export const rateLimiter: RateLimitRequestHandler = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 500,
    standardHeaders: true, 
    legacyHeaders: false,
    keyGenerator: (req, res): any => {
        return req.clientIp; 
    },
    handler: (req, res, next, options) => {
        next({
            statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
            message: `Too many requests, You are only allowed ${options?.max} requests per ${options.windowMs / 60000} minutes`
        });
    },
});