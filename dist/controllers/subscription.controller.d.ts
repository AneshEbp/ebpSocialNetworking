import express from "express";
import type { Request, Response } from "express";
export declare const createSubscription: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const getSubscriptionStatus: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>>>;
export declare const getSubscriptionDetails: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>>>;
export declare const inactiveSubscription: () => Promise<void>;
//# sourceMappingURL=subscription.controller.d.ts.map