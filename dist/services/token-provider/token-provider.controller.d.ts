import { TokenProviderService } from './token-provider.service';
import * as aws from '@aws-sdk/client-api-gateway';
import { Response } from 'express';
export declare class TokenProviderController {
    private readonly tokenProviderService;
    private readonly logger;
    constructor(tokenProviderService: TokenProviderService);
    createUsagePlan(planInfo: aws.CreateUsagePlanCommandInput, res: Response): Promise<void>;
    getAllUsagePlans(res: Response): Promise<void>;
    updateUsagePlan(planInfo: aws.UpdateUsagePlanCommandInput, res: Response): Promise<void>;
    physicalDeleteUsagePlan(planId: aws.DeleteUsagePlanCommandInput, res: Response): Promise<void>;
    createToken(tokenInfo: aws.CreateApiKeyCommandInput, res: Response): Promise<void>;
    getAllTokens(res: Response): Promise<void>;
    allowUsageToken({ tokenId, status }: {
        tokenId: any;
        status: any;
    }, res: Response): Promise<void>;
    physicalDeleteToken(tokenId: aws.DeleteApiKeyCommandInput, res: Response): Promise<void>;
    mappingPlanAndToken(mappingPlan: aws.CreateUsagePlanKeyCommandInput, res: Response): Promise<void>;
}
