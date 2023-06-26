import { AxiosRequestHeaders } from 'axios';

export class GetRequestDto {
  url: string;

  option?: AxiosRequestHeaders;

  payload?: any;

  param?: any;
}

export class PostRequestDto {
  url: string;

  option?: AxiosRequestHeaders;

  payload?: any;

  param?: any;
}
