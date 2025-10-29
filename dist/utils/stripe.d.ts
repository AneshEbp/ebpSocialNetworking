import type { Request, Response } from "express";
export declare const createSession: (price: number, metadata: {
    purpose: string;
    userId: string;
    messageId?: string;
}) => Promise<string | null>;
export declare const webhookHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=stripe.d.ts.map