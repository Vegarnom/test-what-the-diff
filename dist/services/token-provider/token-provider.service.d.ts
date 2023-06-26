import * as aws from '@aws-sdk/client-api-gateway';
export declare class TokenProviderService {
    private readonly logger;
    private readonly client;
    private readonly client2;
    createToken(tokenInfo: aws.CreateApiKeyCommandInput): Promise<aws.CreateApiKeyCommandOutput>;
    getTokenInfo(tokenId: string): Promise<aws.GetApiKeyCommandOutput>;
    allowUsageToken(tokenId: string, status: boolean): Promise<aws.UpdateApiKeyCommandOutput>;
    searchToken(tokenName: string): Promise<aws.GetApiKeysCommandOutput>;
    deleteToken(tokenId: aws.DeleteApiKeyCommandInput): Promise<aws.DeleteApiKeyCommandOutput>;
    createUsagePlan(planInfo: aws.CreateUsagePlanCommandInput): Promise<aws.CreateUsagePlanCommandOutput>;
    searchUsagePlans(planName: string): Promise<aws.GetUsagePlansCommandOutput>;
    updateUsagePlan(usagePlanInfo: aws.UpdateUsagePlanCommandInput): Promise<aws.UpdateUsageCommandOutput>;
    deleteUsagePlan(usagePlanId: aws.DeleteUsagePlanCommandInput): Promise<aws.DeleteUsagePlanCommandOutput>;
    mappingUsagePlanAndToken(mappingPlanInfo: aws.CreateUsagePlanKeyCommandInput): Promise<aws.CreateUsagePlanKeyCommandOutput>;
    generateApiKeyAndMappingToUsagePlan(nameToken: string, usagePlanId: string): Promise<aws.CreateUsagePlanKeyCommandOutput>;
    addIpAndDeployToRestAPI(restApiId: string, stageName: string, listIp: string[]): Promise<any>;
    deleteApiKey(apiKey: string): Promise<any>;
}
