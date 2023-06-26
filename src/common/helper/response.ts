import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export const responseCreated = (res: Response, appData: any) => {
  if (appData) {
    res.status(HttpStatus.CREATED).json({ appData: appData });
  }
  res.status(HttpStatus.BAD_REQUEST);
};

export const responseOk = (res: Response, appData: any) => {
  if (appData) {
    res.status(HttpStatus.OK).json({ appData: appData });
  }
  res.status(HttpStatus.BAD_REQUEST);
};

export const responseData = (res: Response, resData: any, statusCode?: number) => {
  if(resData && statusCode) {
    return res.status(statusCode).send(resData);
  }
  if (resData) {
    return res.status(HttpStatus.OK).send(resData);
  }
  return res
    .status(HttpStatus.BAD_REQUEST)
    .json({ meseage: 'request type not match' });
};
