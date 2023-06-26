import { HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

export class RequestHttpController {
  responseCreated(@Res() res: Response, appData: any) {
    if (appData) {
      res.status(HttpStatus.CREATED).json({ appData: appData });
    }
    res.status(HttpStatus.BAD_REQUEST);
  }

  responseOk(@Res() res: Response, appData: any) {
    if (appData) {
      res.status(HttpStatus.OK).json({ appData: appData });
    }
    res.status(HttpStatus.BAD_REQUEST);
  }
}
