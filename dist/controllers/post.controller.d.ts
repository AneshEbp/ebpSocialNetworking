import type { Request, Response } from "express";
export declare const createPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPosts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPostById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updatePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deletePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPostComments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const likePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const showFeed: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=post.controller.d.ts.map