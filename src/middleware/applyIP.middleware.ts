import { ForbiddenException, Injectable, Logger, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class IpFilterMiddleware implements NestMiddleware {
  private readonly logger = new Logger(IpFilterMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    let allowApiId: string[] = [];
    const xAmznApigatewayApiId = req.headers['x-amzn-apigateway-api-id'] as string;
    this.logger.log(`[x-amzn-apigateway-api-id]: ${xAmznApigatewayApiId}`);
    allowApiId = [process.env.AWS_NO_KEY_REST_API_ID, process.env.AWS_NEED_KEY_REST_API_ID];
    if (!allowApiId.includes(xAmznApigatewayApiId)) {
      throw new ForbiddenException('ID of API GATEWAY is forbidden');
    }
    next();
  }
}