import multer from "multer";
declare module "express-serve-static-core" {
    interface Request {
        user?: any;
    }
}
export declare const upload: multer.Multer;
//# sourceMappingURL=handleFile.d.ts.map