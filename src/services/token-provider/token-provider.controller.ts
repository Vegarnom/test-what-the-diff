import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { TokenProviderService } from './token-provider.service';
import * as aws from '@aws-sdk/client-api-gateway';
import { responseCreated, responseOk } from '../../common/helper/response';
import { Response } from 'express';

@Controller('token-provider')
export class TokenProviderController {
  private readonly logger = new Logger(TokenProviderController.name);

  constructor(private readonly tokenProviderService: TokenProviderService) {}

  @Post('usage-plan')
  async createUsagePlan(
    @Body() planInfo: aws.CreateUsagePlanCommandInput,
    @Res() res: Response,
  ) {
    const result = await this.tokenProviderService.createUsagePlan(planInfo);
    responseCreated(res, result);
  }

  @Get('usage-plan')
  async getAllUsagePlans(@Res() res: Response) {
    const result = await this.tokenProviderService.searchUsagePlans('');
    responseOk(res, result);
  }

  @Put('usage-plan')
  async updateUsagePlan(
    @Body() planInfo: aws.UpdateUsagePlanCommandInput,
    @Res() res: Response,
  ) {
    const result = await this.tokenProviderService.updateUsagePlan(planInfo);
    responseOk(res, result);
  }

  @Delete('usage-plan')
  async physicalDeleteUsagePlan(
    @Body() planId: aws.DeleteUsagePlanCommandInput,
    @Res() res: Response,
  ) {
    const result = await this.tokenProviderService.deleteUsagePlan(planId);
    responseOk(res, result);
  }

  @Post('token')
  async createToken(
    @Body() tokenInfo: aws.CreateApiKeyCommandInput,
    @Res() res: Response,
  ) {
    const result = await this.tokenProviderService.createToken(tokenInfo);
    responseCreated(res, result);
  }

  @Get('token')
  async getAllTokens(@Res() res: Response) {
    const result = await this.tokenProviderService.searchToken('');
    responseOk(res, result);
  }

  @Put('token')
  async allowUsageToken(@Body() { tokenId, status }, @Res() res: Response) {
    const result = await this.tokenProviderService.allowUsageToken(
      tokenId,
      status,
    );
    responseOk(res, result);
  }

  @Delete('token')
  async physicalDeleteToken(
    @Body() tokenId: aws.DeleteApiKeyCommandInput,
    @Res() res: Response,
  ) {
    const result = await this.tokenProviderService.deleteToken(tokenId);
    responseOk(res, result);
  }

  @Post('map-plan-token')
  async mappingPlanAndToken(
    @Body() mappingPlan: aws.CreateUsagePlanKeyCommandInput,
    @Res() res: Response,
  ) {
    const result = await this.tokenProviderService.mappingUsagePlanAndToken(
      mappingPlan,
    );
    responseOk(res, result);
  }
}
