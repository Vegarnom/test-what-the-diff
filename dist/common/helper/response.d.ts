import { Response } from 'express';
export declare const responseCreated: (res: Response, appData: any) => void;
export declare const responseOk: (res: Response, appData: any) => void;
export declare const responseData: (res: Response, resData: any, statusCode?: number) => Response<any, Record<string, any>>;
