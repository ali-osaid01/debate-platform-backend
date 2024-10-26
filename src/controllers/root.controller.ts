import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse } from "../utils/helpers";
import { STATUS_CODES } from "../interface/enum";

export const defaultHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    generateResponse(null, `Health check passed`, res);   
});