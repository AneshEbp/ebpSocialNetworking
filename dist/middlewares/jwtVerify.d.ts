import type { Request, Response, NextFunction } from "express";
declare module "express-serve-static-core" {
    interface Request {
        user?: any;
    }
}
declare const jwtVerify: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default jwtVerify;
//# sourceMappingURL=jwtVerify.d.ts.map