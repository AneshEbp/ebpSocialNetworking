import express from "express";
export declare const uploadTemplate: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const deleteTemplate: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const getTemplatebyId: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const getAllTemplates: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const getTemplateByName: (name: string) => Promise<(import("mongoose").Document<unknown, {}, {
    name: string;
    content: string;
}, {}, import("mongoose").DefaultSchemaOptions> & {
    name: string;
    content: string;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
//# sourceMappingURL=hbsTemplate.controller.d.ts.map