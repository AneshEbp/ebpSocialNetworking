import type { Request, Response } from "express";
export declare const getUserProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateHobbies: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteHobby: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateDateOfBirth: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateAcademicQualification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteAcademicQualification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateLocation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const followUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const unfollowUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFollowers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFollowing: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=user.controller.d.ts.map