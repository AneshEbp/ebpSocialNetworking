import type { Request, Response } from "express";
export declare const sendUserNotification: () => Promise<void>;
export declare const getNotification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const clearAllUserNotifications: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const clearUserNotificationsById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const markReadUserNotification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=notification.controller.d.ts.map