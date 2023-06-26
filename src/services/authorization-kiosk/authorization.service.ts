import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthorizationKiosk } from './entities/authorization-kiosk.entity';
import { AuthorizationKioskDto } from './dto/authorization-kiosk.dto';
import { ResponseData } from 'src/common/params/response.data';
import { ThirdPartyService } from '../third-party/third-party.service';
import { TokenProviderService } from '../token-provider/token-provider.service';
import { DeploymentRestApiNeedKey, DeploymentRestApiNoKey, SALT_OR_ROUNDS, UsagePlanKioskId } from 'src/common/helper/constant';

@Injectable()
export class AuthorizationKioskService {
	private readonly logger = new Logger(AuthorizationKioskService.name);

	constructor(
		@InjectRepository(AuthorizationKiosk) private readonly authorizationKioskRepo: Repository<AuthorizationKiosk>,
		@Inject(forwardRef(() => ThirdPartyService))
		private readonly thirdPartyService: ThirdPartyService,
		private readonly tokenProviderService: TokenProviderService
	) { }

	async create(authorizationKioskDto: AuthorizationKioskDto) {
		let resData = new ResponseData();
		try {
			this.logger.log(`[create]: AuthKioskDto ${JSON.stringify(authorizationKioskDto)}`);
			//check have third party id
			resData = await this.thirdPartyService.findOne(authorizationKioskDto.thirdPartyId);
			if (resData.hasError) {
				return resData;
			}

			//create entity for save to database
			const authorizationKiosk = new AuthorizationKiosk();
			const { ip, deviceId, organizationId, thirdPartyId, token, isApiKey } = authorizationKioskDto || {};

			authorizationKiosk.ip = ip;
			authorizationKiosk.deviceId = deviceId;
			authorizationKiosk.organizationId = organizationId;
			authorizationKiosk.thirdPartyId = thirdPartyId;
			authorizationKiosk.token = token;

			//create env deploy for No Key
			let deployEnv = {
				restApiId: DeploymentRestApiNoKey.restApiId,
				stage: DeploymentRestApiNoKey.stage,
			}

			//if use api key
			if (isApiKey) {
				// generage api key
				const name = `${Date.now()}${organizationId}${thirdPartyId}`;
				const apiKey = await this.tokenProviderService.generateApiKeyAndMappingToUsagePlan(name, UsagePlanKioskId);
				// assign api key for entity
				authorizationKiosk.apiKey = apiKey.id;
				authorizationKiosk.apiKeyHash = await bcrypt.hash(apiKey.value, SALT_OR_ROUNDS);
				// set env deploy to need key
				deployEnv.restApiId = DeploymentRestApiNeedKey.restApiId;
				deployEnv.stage = DeploymentRestApiNeedKey.stage;
			}

			// get list ip to add to resource policy
			const listIp = await this.getAllIpByApiKey(isApiKey);
			// add new ip to list
			listIp.push(authorizationKiosk.ip);
			// save list ip and deploy to api gateway
			await this.tokenProviderService.addIpAndDeployToRestAPI(deployEnv.restApiId, deployEnv.stage, listIp);
			// save entity into database
			const result = await this.authorizationKioskRepo.save(authorizationKiosk);
			//reponse data
			resData.appData = result;
			resData.message = 'Add authorization for Kiosk success';
			return resData;
		} catch (error) {
			this.logger.error('[create]: ' + JSON.stringify(error));
			resData.appData = null;
			resData.message = error;
			resData.hasError = true;
			return resData;
		}
	}

	async findOne(id: number): Promise<ResponseData> {
		let resData = new ResponseData();
		try {
			this.logger.log(`[find one]: id ${id}`);
			// check valid id
			if (!id || id < 1) {
				resData.hasError = true;
				resData.message = 'Please fill Id valid please';
				return resData;
			}
			// check have id exist in database
			const result = await this.authorizationKioskRepo.findOne({
				where: {
					isDeleted: false,
					id,
				},
			});

			// if not found id in db
			if (result === null) {
				resData.hasError = true;
				resData.message = 'authorization kiosk not found';
				return resData;
			}
			// response data
			resData.appData = result;
			resData.message = "Get authorization for Kiosk success";
			return resData;
		} catch (error) {
			this.logger.error('[find one]: ' + JSON.stringify(error));
			resData.appData = null;
			resData.message = error;
			resData.hasError = true;
			return resData;
		}
	}

	async findOneByApiKey(apiKey: string): Promise<ResponseData> {
		let resData = new ResponseData();
		try {
			this.logger.log(`[find one by api key]: id ${apiKey}`);
			// check valid id
			if (!apiKey) {
				resData.hasError = true;
				resData.message = 'Please fill api key valid please';
				return resData;
			}

			// check have apiKeyHash exist in database
			resData = await this.findAll();
			let listApiKey = resData.appData;
			let result = null;
			for (let i = 0; i < listApiKey.length; i++) {
				const compare = await bcrypt.compare(apiKey, listApiKey[i].apiKeyHash);
				if (compare) {
					result = listApiKey[i];
					break;
				}
			}

			// if not found id in db
			if (result === null) {
				resData.hasError = true;
				resData.appData = null;
				resData.message = 'authorization kiosk not found';
				return resData;
			}
			// response data
			resData.appData = result;
			resData.message = "Get authorization for Kiosk success";
			return resData;
		} catch (error) {
			this.logger.error('[find one by api key]: ' + JSON.stringify(error));
			resData.appData = null;
			resData.message = error;
			resData.hasError = true;
			return resData;
		}
	}

	async findAll(): Promise<ResponseData> {
		let resData = new ResponseData();
		try {
			this.logger.log(`[find all]`);
			// get all
			const result = await this.authorizationKioskRepo.find({
				where: {
					isDeleted: false,
				},
				order: {
					id: 'ASC',
				}
			});
			// reponse data
			resData.appData = result;
			resData.message = "Get all authorization for Kiosk success";
			return resData;
		} catch (error) {
			this.logger.error('[find all]: ' + JSON.stringify(error));
			resData.appData = null;
			resData.message = error;
			resData.hasError = true;
			return resData;
		}
	}

	async findAllByThirdPartyId(thirdPartyId: number): Promise<ResponseData> {
		let resData = new ResponseData();
		try {
			this.logger.log(`[find all by third party id] third party id: ${thirdPartyId}`);
			// get all
			const result = await this.authorizationKioskRepo.find({
				where: {
					thirdPartyId,
					isDeleted: false,
				},
				order: {
					id: 'ASC',
				}
			});
			// reponse data
			resData.appData = result;
			resData.message = "Get all authorization for Kiosk by third party id success";
			return resData;
		} catch (error) {
			this.logger.error('[find all]: ' + JSON.stringify(error));
			resData.appData = null;
			resData.message = error;
			resData.hasError = true;
			return resData;
		}
	}

	async update(authorizationKioskDto: AuthorizationKioskDto) {
		let resData = new ResponseData();
		try {
			this.logger.log(`[update]: AuthKioskDto ${JSON.stringify(authorizationKioskDto)}`);
			// create same to check update same env or other
			let same = true;
			// create needKeyEnv to check env is need key or no key
			let needKeyEnv = true;

			// check id is exist in db
			resData = await this.findOne(authorizationKioskDto.id);
			if (resData.hasError) {
				return resData;
			}

			// create new entity for update
			const authorizationKiosk: AuthorizationKiosk = resData.appData;
			this.logger.log(`authorizer: ${JSON.stringify(authorizationKiosk)}`);

			// check have third party id in db
			resData = await this.thirdPartyService.findOne(authorizationKioskDto.thirdPartyId);
			if (resData.hasError) {
				return resData;
			}

			const { id, deviceId, organizationId, thirdPartyId, token, ip, isApiKey } = authorizationKioskDto || {};
			// fill data into entity
			authorizationKiosk.id = id;
			authorizationKiosk.deviceId = deviceId;
			authorizationKiosk.organizationId = organizationId;
			authorizationKiosk.thirdPartyId = thirdPartyId;
			authorizationKiosk.token = token;

			// set up env deploy to api gate way is need key
			let deployEnv = {
				restApiId: DeploymentRestApiNeedKey.restApiId,
				stage: DeploymentRestApiNeedKey.stage,
			}

			// check if update from need key to no key
			if (!isApiKey && authorizationKiosk.apiKey !== null) {
				// delete api key
				await this.tokenProviderService.deleteApiKey(authorizationKiosk.apiKey);
				authorizationKiosk.apiKey = null;
				authorizationKiosk.apiKeyHash = null;
				// set up env deploy to no key
				deployEnv.restApiId = DeploymentRestApiNoKey.restApiId;
				deployEnv.stage = DeploymentRestApiNoKey.stage;
				same = false;
				needKeyEnv = false;
				// check if update from no key to need key
			} else if (isApiKey && authorizationKiosk.apiKey === null) {
				const name = `${Date.now()}${organizationId}${thirdPartyId}`;
				const apiKey = await this.tokenProviderService.generateApiKeyAndMappingToUsagePlan(name, UsagePlanKioskId);
				authorizationKiosk.apiKey = apiKey.id;
				authorizationKiosk.apiKeyHash = await bcrypt.hash(apiKey.value, SALT_OR_ROUNDS);
				same = false;
			}

			// sleep to update

			// if other env
			if (same === false) {
				// if env is need key
				if (needKeyEnv) {
					// update list ip of env no key
					const listIp = await this.getAllIpByApiKey(!isApiKey, authorizationKiosk.id);
					// setTimeout(() => {
					await this.tokenProviderService.addIpAndDeployToRestAPI(DeploymentRestApiNoKey.restApiId, DeploymentRestApiNoKey.stage, listIp);
					// }, 6000) 
				} else { // if env is no key
					// updare list ip of need key
					const listIp = await this.getAllIpByApiKey(!isApiKey, authorizationKiosk.id);
					// setTimeout(() => {
					await this.tokenProviderService.addIpAndDeployToRestAPI(DeploymentRestApiNeedKey.restApiId, DeploymentRestApiNeedKey.stage, listIp);
					// }, 6000)
				}
				// save list ip and deploy to api gate way for other env
				await new Promise(r => setTimeout(r, parseInt(process.env.AWS_TIME_WAIT_DEPLOY)));
				const listIp = await this.getAllIpByApiKey(isApiKey);
				listIp.push(ip);
				await this.tokenProviderService.addIpAndDeployToRestAPI(deployEnv.restApiId, deployEnv.stage, listIp);
				authorizationKiosk.ip = ip;
				// if update ip
			} else if (authorizationKiosk.ip !== ip) {
				const listIp = await this.getAllIpByApiKey(isApiKey, authorizationKiosk.id);
				listIp.push(ip);
				await this.tokenProviderService.addIpAndDeployToRestAPI(deployEnv.restApiId, deployEnv.stage, listIp);
				authorizationKiosk.ip = ip;
			}

			// save to DB
			const result = await this.authorizationKioskRepo.save(authorizationKiosk);
			// response data
			resData.appData = result;
			resData.message = `Update authorization for Kiosk success`;
			return resData;
		} catch (error) {
			this.logger.error('[update]: ' + JSON.stringify(error));
			resData.appData = null;
			resData.message = error;
			resData.hasError = true;
			return resData;
		}
	}

	async remove(id: number) {
		let resData = new ResponseData();
		try {
			this.logger.log(`[update]: id ${id}`);
			// check ud
			resData = await this.findOne(id);
			if (resData.hasError) {
				return resData;
			}
			const authorizationKiosk: AuthorizationKiosk = resData.appData;

			this.logger.log(`authorizer: ${JSON.stringify(authorizationKiosk)}`);

			// config env to deploy
			let deployEnv = {
				restApiId: DeploymentRestApiNoKey.restApiId,
				stage: DeploymentRestApiNoKey.stage,
			}
			if (authorizationKiosk.apiKey !== null) {
				await this.tokenProviderService.deleteApiKey(authorizationKiosk.apiKey);
				deployEnv.restApiId = DeploymentRestApiNeedKey.restApiId;
				deployEnv.stage = DeploymentRestApiNeedKey.stage;
			}

			// update list ip and deoploy api gateway
			const listIp = await this.getAllIpByApiKey(authorizationKiosk.apiKey === null ? false : true, authorizationKiosk.id);
			await this.tokenProviderService.addIpAndDeployToRestAPI(deployEnv.restApiId, deployEnv.stage, listIp);

			//set is Delte to tesst enttuty
			authorizationKiosk.setIsDelete(true);

			// save entity
			const result = await this.authorizationKioskRepo.save(authorizationKiosk);
			resData.appData = null;
			resData.message = `Delete authorization for Kiosk success`;
			return resData;
		} catch (error) {
			this.logger.error('[update]: ' + JSON.stringify(error));
			resData.appData = null;
			resData.message = error;
			resData.hasError = true;
			return resData;
		}
	}

	async getApiKey(apiKey: string): Promise<ResponseData> {
		const resData = new ResponseData();
		try {
			this.logger.log(`[getApiKey]: apiKey ${apiKey}`);
			const result = await this.tokenProviderService.getTokenInfo(apiKey);
			resData.appData = result;
			resData.message = 'Get api key success';
			return resData;
		} catch (error) {
			this.logger.error(`[getApiKey]: apiKey ${apiKey} error ${error}`);
			throw error;
		}
	}

	async resetApiKey(id: number): Promise<ResponseData> {
		let resData = new ResponseData();
		this.logger.log('[resetApiKey]: id' + id);
		try {
			resData = await this.findOne(id);
			if (resData.hasError) {
				return resData;
			}

			const authorizationKiosk = resData.appData;

			if (authorizationKiosk.apiKey === null) {
				resData.hasError = true;
				resData.appData = null;
				resData.message = 'Api key not use for this authorization';
				return resData;
			}

			await this.tokenProviderService.deleteApiKey(authorizationKiosk.apiKey);

			const name = `${Date.now()}${authorizationKiosk.organizationId}${authorizationKiosk.thirdPartyId}`;
			const apiKeyNew = await this.tokenProviderService.generateApiKeyAndMappingToUsagePlan(name, UsagePlanKioskId);
			authorizationKiosk.apiKey = apiKeyNew.id;
			authorizationKiosk.apiKeyHash = await bcrypt.hash(apiKeyNew.value, SALT_OR_ROUNDS);

			const result = await this.authorizationKioskRepo.save(authorizationKiosk);
			resData.appData = result;
			resData.message = `Reset api key this authorization for Kiosk success`;
			return resData;
		} catch (error) {
			this.logger.error('[resetApiKey]: ' + JSON.stringify(error));
			resData.appData = null;
			resData.message = error;
			resData.hasError = true;
			return resData;
		}
	}

	async getAllIpByApiKey(apikey: boolean, exceptId?: number): Promise<any> {
		let condition = {
			apiKey: IsNull()
		}
		if (exceptId) {
			condition["id"] = Not(exceptId);
		}

		if (apikey) {
			condition.apiKey = Not(IsNull());
		}

		const result = await this.authorizationKioskRepo.find({
			where: {
				isDeleted: false,
				...condition
			}
		});

		let listIP = new Array<string>();
		result.forEach((item) => {
			listIP.push(item.ip);
		})

		return listIP;
	}
}
