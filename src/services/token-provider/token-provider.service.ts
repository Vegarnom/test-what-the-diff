import { Injectable, Logger } from '@nestjs/common';
import * as aws from '@aws-sdk/client-api-gateway';
import { DeploymentRestApiNeedKey } from 'src/common/helper/constant';

@Injectable()
export class TokenProviderService {
  private readonly logger = new Logger(TokenProviderService.name);

  private readonly client = new aws.APIGatewayClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_S1,
      secretAccessKey: process.env.AWS_SECRET_KEY_S1,
    },
  });

  private readonly client2 = new aws.APIGatewayClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_S2,
      secretAccessKey: process.env.AWS_SECRET_KEY_S2
    }
  });

  async createToken(
    tokenInfo: aws.CreateApiKeyCommandInput,
  ): Promise<aws.CreateApiKeyCommandOutput> {
    try {
      this.logger.log('[createToken]: ' + JSON.stringify(tokenInfo));

      const listToken: aws.GetApiKeysCommandOutput = await this.searchToken(
        tokenInfo.name,
      );

      // filter list token which name like new data takon info
      const filterData = listToken.items.filter(
        (item) => item.name.trim() === tokenInfo.name.trim(),
      );

      this.logger.log(
        '[createtoken] filter data result: ' + JSON.stringify(filterData),
      );

      // avoid create duplicate token name => rename token info
      if (filterData.length > 0) {
        tokenInfo.name += `_${filterData.length + 1}`;
        this.logger.log('[createToken] rename token: ' + tokenInfo.name);
      }

      const command = new aws.CreateApiKeyCommand(tokenInfo);
      const result: aws.CreateApiKeyCommandOutput = await this.client.send(
        command,
      );
      this.logger.log('[createToken] success: ' + JSON.stringify(result));

      // hidden metadata
      delete result.$metadata;

      // diconnect aws client
      this.client.destroy();

      return result;
    } catch (error) {
      this.logger.error('[createToken]: ' + error.toString());
      throw error;
    }
  }

  async getTokenInfo(tokenId: string): Promise<aws.GetApiKeyCommandOutput> {
    try {
      this.logger.log('[getTokenInfo] tokenId=' + tokenId);
      const params: aws.GetApiKeyRequest = {
        apiKey: tokenId,
        includeValue: true,
      };
      const command = new aws.GetApiKeyCommand(params);
      const result: aws.GetApiKeyCommandOutput = await this.client.send(
        command,
      );
      this.logger.log('[getTokenInfo] success: ' + JSON.stringify(result));

      // hidden metadata return
      delete result.$metadata;

      this.client.destroy();

      return result;
    } catch (error) {
      this.logger.error('[getTokenInfo]: ' + error.toString());
      throw error;
    }
  }

  async allowUsageToken(
    tokenId: string,
    status: boolean,
  ): Promise<aws.UpdateApiKeyCommandOutput> {
    try {
      this.logger.log('[allowUsageToken] : tokenId=' + JSON.stringify(tokenId));

      const params: aws.UpdateApiKeyCommandInput = {
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
      const result: aws.UpdateApiKeyCommandOutput = await this.client.send(
        command,
      );

      this.logger.log('[allowUsageToken] success: ' + JSON.stringify(result));

      // hidden metadata
      delete result.$metadata;

      return result;
    } catch (error) {
      this.logger.error('[allowUsage]: ' + error.toString());
      throw error;
    }
  }

  async searchToken(tokenName: string): Promise<aws.GetApiKeysCommandOutput> {
    try {
      this.logger.log('[searchToken]: tokenName=' + tokenName);
      const params: aws.GetApiKeysRequest = {
        nameQuery: tokenName,
        includeValues: true,
      };

      const command = new aws.GetApiKeysCommand(params);
      const result: aws.GetApiKeysCommandOutput = await this.client.send(
        command,
      );
      this.logger.log('[searchToken] success: ' + JSON.stringify(result));

      // hidden metadata
      delete result.$metadata;

      this.client.destroy();

      return result;
    } catch (error) {
      this.logger.error('[searchToken]: ' + error.toString());
      throw error;
    }
  }

  // BECAREFUL WITH THIS FUNCTION => IT"LL DELETE PHYSICAL DATA
  async deleteToken(
    tokenId: aws.DeleteApiKeyCommandInput,
  ): Promise<aws.DeleteApiKeyCommandOutput> {
    try {
      this.logger.log('[deleteToken] tokenId=' + JSON.stringify(tokenId));

      const command = new aws.DeleteApiKeyCommand(tokenId);
      const result: aws.DeleteApiKeyCommandOutput = await this.client.send(
        command,
      );

      this.logger.log('[deleteToken] success: ' + JSON.stringify(result));

      // hidden metedata
      delete result.$metadata;

      this.client.destroy();

      return result;
    } catch (error) {
      this.logger.error('[deleteToken]: ' + error.toString());
      throw error;
    }
  }

  async createUsagePlan(
    planInfo: aws.CreateUsagePlanCommandInput,
  ): Promise<aws.CreateUsagePlanCommandOutput> {
    try {
      this.logger.log('[createUsagePlan]: ' + JSON.stringify(planInfo));
      const params: aws.CreateUsagePlanCommandInput = {
        name: planInfo?.name,
        apiStages: planInfo?.apiStages,
        description: planInfo?.description,
        quota: planInfo?.quota,
        throttle: planInfo?.throttle,
      };

      const command = new aws.CreateUsagePlanCommand(params);
      const result: aws.CreateUsagePlanCommandOutput = await this.client.send(
        command,
      );

      this.logger.log('[createUsagePlan] success: ' + JSON.stringify(result));

      // hidden metadata
      delete result.$metadata;

      return result;
    } catch (error) {
      this.logger.error('[createUsagePlan]: ' + error.toString());
      throw error;
    }
  }

  async searchUsagePlans(
    planName: string,
  ): Promise<aws.GetUsagePlansCommandOutput> {
    try {
      this.logger.log('[searchUsagePlan]: ' + JSON.stringify(planName));
      const params: aws.GetUsagePlansCommandInput = {
        keyId: planName,
      };
      const command = new aws.GetUsagePlansCommand(params);
      const result: aws.GetUsagePlansCommandOutput = await this.client.send(
        command,
      );

      this.logger.log('[searchUsagePlan] succcess: ' + JSON.stringify(result));

      // hidden metadata
      delete result.$metadata;

      return result;
    } catch (error) {
      this.logger.error('[searchUsagePlan]: ' + error.toString());
      throw error;
    }
  }

  async updateUsagePlan(
    usagePlanInfo: aws.UpdateUsagePlanCommandInput,
  ): Promise<aws.UpdateUsageCommandOutput> {
    try {
      this.logger.log('[updateUsagePlan]: ' + JSON.stringify(usagePlanInfo));
      const params: aws.UpdateUsagePlanCommandInput = {
        usagePlanId: usagePlanInfo?.usagePlanId,
        patchOperations: usagePlanInfo?.patchOperations,
      };
      const command = new aws.UpdateUsagePlanCommand(params);
      const result: aws.UpdateUsageCommandOutput = await this.client.send(
        command,
      );

      this.logger.log('[updateUsagePlan] success: ' + JSON.stringify(result));

      delete result.$metadata;

      return result;
    } catch (error) {
      this.logger.log('[updateUsagePlan]: ' + error.toString());
      throw error;
    }
  }

  // BECAREFUL WITH THIS FUNCTION => IT"LL DELETE PHYSICAL DATA
  async deleteUsagePlan(
    usagePlanId: aws.DeleteUsagePlanCommandInput,
  ): Promise<aws.DeleteUsagePlanCommandOutput> {
    try {
      this.logger.log(
        '[deleteUsagePlan] usagePlanId=' + JSON.stringify(usagePlanId),
      );
      const command = new aws.DeleteUsagePlanCommand(usagePlanId);
      const result: aws.DeleteUsagePlanCommandOutput = await this.client.send(
        command,
      );

      this.logger.log('[deleteUsagePlan] success: ' + JSON.stringify(result));

      // hidden metadata
      delete result.$metadata;

      return result;
    } catch (error) {
      this.logger.error('[deleteUdagePlane]: ' + error.toString());
      throw error;
    }
  }

  async mappingUsagePlanAndToken(
    mappingPlanInfo: aws.CreateUsagePlanKeyCommandInput,
  ): Promise<aws.CreateUsagePlanKeyCommandOutput> {
    try {
      this.logger.log(
        '[mappingUsagePlanAndToken] ' + JSON.stringify(mappingPlanInfo),
      );
      const command = new aws.CreateUsagePlanKeyCommand(mappingPlanInfo);
      const result: aws.CreateUsagePlanCommandOutput = await this.client.send(
        command,
      );

      this.logger.log(
        '[mappingUsagePlanAndToken] success : ' + JSON.stringify(result),
      );

      // hidden metadata
      delete result.$metadata;

      return result;
    } catch (error) {
      this.logger.error('[mappingUsagePlanAndToken] ' + error.toString());
      throw error;
    }
  }

  async generateApiKeyAndMappingToUsagePlan(
    nameToken: string,
    usagePlanId: string,
  ): Promise<aws.CreateUsagePlanKeyCommandOutput> {
    try {
      this.logger.log(
        `[generateApiKeyAndMappingToUsagePlan] name token: ${nameToken}, usage plan id: ${usagePlanId}`,
      );
      const token: aws.CreateApiKeyCommandInput = {
        name: nameToken,
        enabled: true,
      };

      const apiKey: aws.CreateApiKeyCommandOutput = await this.createToken(
        token,
      );

      const mapTokenInput: aws.CreateUsagePlanKeyCommandInput = {
        usagePlanId,
        keyId: apiKey.id,
        keyType: 'API_KEY',
      };

      const map = await this.mappingUsagePlanAndToken(mapTokenInput);

      // hidden metadata
      return map;
    } catch (error) {
      this.logger.error(
        '[generateApiKeyAndMappingToUsagePlan] ' + error.toString(),
      );
      throw error;
    }
  }

  async addIpAndDeployToRestAPI(
    restApiId: string,
    stageName: string,
    listIp: string[],
  ): Promise<any> {
    try {
      this.logger.log(
        `[addIpAndDeployToRestAPI] restApiId: ${restApiId}, stageName id: ${stageName}, listIp: ${listIp}`,
      );

      //Create input policy for api gate way
      // "Resource": "execute-api:/dev/*" Resource for specific stage
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
              `,
          },
        ],
      };
      //Create command for update rest api
      let command = new aws.UpdateRestApiCommand(input);
      //Send request to api gateway to update
      let result = await this.client.send(command);
      this.logger.log(
        `result when send update rest api: ${JSON.stringify(result)}`,
      );

      // Create input for deploy api to stage
      const input2: aws.CreateDeploymentCommandInput = {
        restApiId,
        stageName,
      };

      //Create command for deploy to stage
      const command2 = new aws.CreateDeploymentCommand(input2);
      //Send request deploy stage to api gate way
      let result2: aws.CreateDeploymentCommandOutput;
      if (restApiId === DeploymentRestApiNeedKey.restApiId) {
        result2 = await this.client.send(command2);
      } else {
        result2 = await this.client2.send(command2);
      }

      this.logger.log(
        '[addIpAndDeployToRestAPI] deploy to stage success : ' +
          JSON.stringify(result2),
      );

      // // hidden metadata
      // delete result.$metadata;

      return result2;
    } catch (error) {
      this.logger.error('[mappingUsagePlanAndToken] ' + error.toString());
      throw error;
    }
  }

  async deleteApiKey(apiKey: string): Promise<any> {
    try {
      const input: aws.DeleteApiKeyCommandInput = {
        apiKey,
      };
      await this.deleteToken(input);
    } catch (error) {
      throw error;
    }
  }
}
