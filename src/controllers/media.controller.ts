import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import uploadOnCloudinary from "../utils/upload";

class MediaController {

    public create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const files = req.files as { media: Express.Multer.File[] }; 

        if (!files || !files.media || !Array.isArray(files.media)) {
            return res.status(400).json({ message: "No media files provided" });
        }

        const uploadResults = [];
        for (const file of files.media) {
            try {
                const uploadResult = await uploadOnCloudinary(file.path);
                if (uploadResult) uploadResults.push(uploadResult);
            } catch (error) {
                console.error("Error uploading file:", error);
                return res.status(500).json({ message: "File upload failed", error });
            }
        }
        res.json({ message: "Files received and uploaded", urls: uploadResults });
    });
}

export default MediaController;
