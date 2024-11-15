import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";

export const defaultHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({message:"Health Check Passed"})   
});

