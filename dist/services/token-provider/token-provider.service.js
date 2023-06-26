"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TokenProviderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenProviderService = void 0;
const common_1 = require("@nestjs/common");
const aws = require("@aws-sdk/client-api-gateway");
const constant_1 = require("../../common/helper/constant");
let TokenProviderService = TokenProviderService_1 = class TokenProviderService {
    constructor() {
        this.logger = new common_1.Logger(TokenProviderService_1.name);
        this.client = new aws.APIGatewayClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_S1,
                secretAccessKey: process.env.AWS_SECRET_KEY_S1
            }
        });
        this.client2 = new aws.APIGatewayClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_S2,
                secretAccessKey: process.env.AWS_SECRET_KEY_S2
            }
        });
    }
    async createToken(tokenInfo) {
        try {
            this.logger.log('[createToken]: ' + JSON.stringify(tokenInfo));
            const listToken = await this.searchToken(tokenInfo.name);
            const filterData = listToken.items.filter((item) => item.name.trim() === tokenInfo.name.trim());
            this.logger.log('[createtoken] filter data result: ' + JSON.stringify(filterData));
            if (filterData.length > 0) {
                tokenInfo.name += `_${filterData.length + 1}`;
                this.logger.log('[createToken] rename token: ' + tokenInfo.name);
            }
            const command = new aws.CreateApiKeyCommand(tokenInfo);
            const result = await this.client.send(command);
            this.logger.log('[createToken] success: ' + JSON.stringify(result));
            delete result.$metadata;
            this.client.destroy();
            return result;
        }
        catch (error) {
            this.logger.error('[createToken]: ' + error.toString());
            throw error;
        }
    }
    async getTokenInfo(tokenId) {
        try {
            this.logger.log('[getTokenInfo] tokenId=' + tokenId);
            const params = {
                apiKey: tokenId,
                includeValue: true,
            };
            const command = new aws.GetApiKeyCommand(params);
            const result = await this.client.send(command);
            this.logger.log('[getTokenInfo] success: ' + JSON.stringify(result));
            delete result.$metadata;
            this.client.destroy();
            return result;
        }
        catch (error) {
            this.logger.error('[getTokenInfo]: ' + error.toString());
            throw error;
        }
    }
    async allowUsageToken(tokenId, status) {
        try {
            this.logger.log('[allowUsageToken] : tokenId=' + JSON.stringify(tokenId));
            const params = {
                apiKey: tokenId,
                patchOperations: [
                    {
                        op: 'replace',
                        path: '/enabled',
                        value: `${status}`,
                    },
                ],
            };
            const command = new aws.UpdateApiKeyCommand(params);
            const result = await this.client.send(command);
            this.logger.log('[allowUsageToken] success: ' + JSON.stringify(result));
            delete result.$metadata;
            return result;
        }
        catch (error) {
            this.logger.error('[allowUsage]: ' + error.toString());
            throw error;
        }
    }
    async searchToken(tokenName) {
        try {
            this.logger.log('[searchToken]: tokenName=' + tokenName);
            const params = {
                nameQuery: tokenName,
                includeValues: false,
            };
            const command = new aws.GetApiKeysCommand(params);
            const result = await this.client.send(command);
            this.logger.log('[searchToken] success: ' + JSON.stringify(result));
            delete result.$metadata;
            this.client.destroy();
            return result;
        }
        catch (error) {
            this.logger.error('[searchToken]: ' + error.toString());
            throw error;
        }
    }
    async deleteToken(tokenId) {
        try {
            this.logger.log('[deleteToken] tokenId=' + JSON.stringify(tokenId));
            const command = new aws.DeleteApiKeyCommand(tokenId);
            const result = await this.client.send(command);
            this.logger.log('[deleteToken] success: ' + JSON.stringify(result));
            delete result.$metadata;
            this.client.destroy();
            return result;
        }
        catch (error) {
            this.logger.error('[deleteToken]: ' + error.toString());
            throw error;
        }
    }
    async createUsagePlan(planInfo) {
        try {
            this.logger.log('[createUsagePlan]: ' + JSON.stringify(planInfo));
            const params = {
                name: planInfo === null || planInfo === void 0 ? void 0 : planInfo.name,
                apiStages: planInfo === null || planInfo === void 0 ? void 0 : planInfo.apiStages,
                description: planInfo === null || planInfo === void 0 ? void 0 : planInfo.description,
                quota: planInfo === null || planInfo === void 0 ? void 0 : planInfo.quota,
                throttle: planInfo === null || planInfo === void 0 ? void 0 : planInfo.throttle,
            };
            const command = new aws.CreateUsagePlanCommand(params);
            const result = await this.client.send(command);
            this.logger.log('[createUsagePlan] success: ' + JSON.stringify(result));
            delete result.$metadata;
            return result;
        }
        catch (error) {
            this.logger.error('[createUsagePlan]: ' + error.toString());
            throw error;
        }
    }
    async searchUsagePlans(planName) {
        try {
            this.logger.log('[searchUsagePlan]: ' + JSON.stringify(planName));
            const params = {
                keyId: planName,
            };
            const command = new aws.GetUsagePlansCommand(params);
            const result = await this.client.send(command);
            this.logger.log('[searchUsagePlan] succcess: ' + JSON.stringify(result));
            delete result.$metadata;
            return result;
        }
        catch (error) {
            this.logger.error('[searchUsagePlan]: ' + error.toString());
            throw error;
        }
    }
    async updateUsagePlan(usagePlanInfo) {
        try {
            this.logger.log('[updateUsagePlan]: ' + JSON.stringify(usagePlanInfo));
            const params = {
                usagePlanId: usagePlanInfo === null || usagePlanInfo === void 0 ? void 0 : usagePlanInfo.usagePlanId,
                patchOperations: usagePlanInfo === null || usagePlanInfo === void 0 ? void 0 : usagePlanInfo.patchOperations,
            };
            const command = new aws.UpdateUsagePlanCommand(params);
            const result = await this.client.send(command);
            this.logger.log('[updateUsagePlan] success: ' + JSON.stringify(result));
            delete result.$metadata;
            return result;
        }
        catch (error) {
            this.logger.log('[updateUsagePlan]: ' + error.toString());
            throw error;
        }
    }
    async deleteUsagePlan(usagePlanId) {
        try {
            this.logger.log('[deleteUsagePlan] usagePlanId=' + JSON.stringify(usagePlanId));
            const command = new aws.DeleteUsagePlanCommand(usagePlanId);
            const result = await this.client.send(command);
            this.logger.log('[deleteUsagePlan] success: ' + JSON.stringify(result));
            delete result.$metadata;
            return result;
        }
        catch (error) {
            this.logger.error('[deleteUdagePlane]: ' + error.toString());
            throw error;
        }
    }
    async mappingUsagePlanAndToken(mappingPlanInfo) {
        try {
            this.logger.log('[mappingUsagePlanAndToken] ' + JSON.stringify(mappingPlanInfo));
            const command = new aws.CreateUsagePlanKeyCommand(mappingPlanInfo);
            const result = await this.client.send(command);
            this.logger.log('[mappingUsagePlanAndToken] success : ' + JSON.stringify(result));
            delete result.$metadata;
            return result;
        }
        catch (error) {
            this.logger.error('[mappingUsagePlanAndToken] ' + error.toString());
            throw error;
        }
    }
    async generateApiKeyAndMappingToUsagePlan(nameToken, usagePlanId) {
        try {
            this.logger.log(`[generateApiKeyAndMappingToUsagePlan] name token: ${nameToken}, usage plan id: ${usagePlanId}`);
            const token = {
                name: nameToken,
                enabled: true
            };
            const apiKey = await this.createToken(token);
            const mapTokenInput = {
                usagePlanId,
                keyId: apiKey.id,
                keyType: 'API_KEY'
            };
            const map = await this.mappingUsagePlanAndToken(mapTokenInput);
            return map;
        }
        catch (error) {
            this.logger.error('[generateApiKeyAndMappingToUsagePlan] ' + error.toString());
            throw error;
        }
    }
    async addIpAndDeployToRestAPI(restApiId, stageName, listIp) {
        try {
            this.logger.log(`[addIpAndDeployToRestAPI] restApiId: ${restApiId}, stageName id: ${stageName}, listIp: ${listIp}`);
            let ips = ``;
            listIp.forEach((item, index) => {
                ips = ips + `"${item}"`;
                if (index !== listIp.length - 1) {
                    ips = ips + ',';
                }
            });
            let input = {
                restApiId,
                patchOperations: [
                    {
                        path: '/policy',
                        op: 'replace',
                        value: `
                {
                  "Version": "2012-10-17",
                  "Statement": [
                      {
                          "Effect": "Allow",
                          "Principal": "*",
                          "Action": "execute-api:Invoke",
                          "Resource": "*"
                      },
                      {
                          "Effect": "Deny",
                          "Principal": "*",
                          "Action": "execute-api:Invoke",
                          "Resource": "*",
                          "Condition": {
                              "NotIpAddress": {
                                  "aws:SourceIp": [ ${ips} ]
                              }
                          }
                      }
                  ]
                }
              `
                    }
                ]
            };
            let command = new aws.UpdateRestApiCommand(input);
            let result = await this.client.send(command);
            this.logger.log(`result when send update rest api: ${JSON.stringify(result)}`);
            const input2 = {
                restApiId,
                stageName
            };
            const command2 = new aws.CreateDeploymentCommand(input2);
            let result2;
            if (restApiId === constant_1.DeploymentRestApiNeedKey.restApiId) {
                result2 = await this.client.send(command2);
            }
            else {
                result2 = await this.client2.send(command2);
            }
            this.logger.log('[addIpAndDeployToRestAPI] deploy to stage success : ' + JSON.stringify(result2));
            return result2;
        }
        catch (error) {
            this.logger.error('[mappingUsagePlanAndToken] ' + error.toString());
            throw error;
        }
    }
    async deleteApiKey(apiKey) {
        try {
            const input = {
                apiKey,
            };
            await this.deleteToken(input);
        }
        catch (error) {
            throw error;
        }
    }
};
TokenProviderService = TokenProviderService_1 = __decorate([
    (0, common_1.Injectable)()
], TokenProviderService);
exports.TokenProviderService = TokenProviderService;
//# sourceMappingURL=token-provider.service.js.map