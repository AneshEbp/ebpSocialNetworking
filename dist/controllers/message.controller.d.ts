import type { Request, Response } from "express";
export declare const getConversationList: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createMessage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMessages: (req: Request, res: Response) => Promise<void>;
export declare const readMessages: (req: Request, res: Response) => Promise<void>;
export declare const payToUnlockImage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=message.controller.d.ts.map