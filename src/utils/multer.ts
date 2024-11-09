import multer, { FileFilterCallback } from 'multer';
import fs from 'fs';
import { Request } from 'express';

const generateFilename = (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${fileExtension}`);
};

const filterImageOrDocsOrPDF = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = /image\/(jpg|jpeg|png|gif|webp|jfif|svg|bmp|ico|tiff|psd)|application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.ms-powerpoint|vnd.openxmlformats-officedocument.presentationml.presentation)/i;

    if (!allowedTypes.test(file.mimetype)) {
        return cb(null, false);
    }
    cb(null, true);
};

export const upload = (folderName: string) => {
    return multer({
        storage: multer.diskStorage({
            destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
                const path = `/tmp/${folderName}/`;
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path, { recursive: true });
                }
                cb(null, path);
            },
            filename: generateFilename
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: filterImageOrDocsOrPDF
    });
};
