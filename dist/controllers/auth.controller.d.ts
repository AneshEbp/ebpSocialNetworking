import type { Request, Response } from "express";
declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const verifyEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const resendVerificationCode: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const logout: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const logoutFromAllDevices: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const changePassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const forgotPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const resetPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export { register, verifyEmail, login, changePassword, forgotPassword, resetPassword, resendVerificationCode, };
//# sourceMappingURL=auth.controller.d.ts.map