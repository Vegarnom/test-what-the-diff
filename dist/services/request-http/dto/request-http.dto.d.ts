import { AxiosRequestHeaders } from 'axios';
export declare class GetRequestDto {
    url: string;
    option?: AxiosRequestHeaders;
    payload?: any;
    param?: any;
}
export declare class PostRequestDto {
    url: string;
    option?: AxiosRequestHeaders;
    payload?: any;
    param?: any;
}
