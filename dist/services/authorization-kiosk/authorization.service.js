"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthorizationKioskService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationKioskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const authorization_kiosk_entity_1 = require("./entities/authorization-kiosk.entity");
const response_data_1 = require("../../common/params/response.data");
const third_party_service_1 = require("../third-party/third-party.service");
const token_provider_service_1 = require("../token-provider/token-provider.service");
const constant_1 = require("../../common/helper/constant");
const firebase_auth_service_1 = require("../firebase-auth/firebase-auth.service");
let AuthorizationKioskService = AuthorizationKioskService_1 = class AuthorizationKioskService {
    constructor(authorizationKioskRepo, thirdPartyService, tokenProviderService, firebaseAuthService) {
        this.authorizationKioskRepo = authorizationKioskRepo;
        this.thirdPartyService = thirdPartyService;
        this.tokenProviderService = tokenProviderService;
        this.firebaseAuthService = firebaseAuthService;
        this.logger = new common_1.Logger(AuthorizationKioskService_1.name);
    }
    async create(authorizationKioskDto) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`[create]: AuthKioskDto ${JSON.stringify(authorizationKioskDto)}`);
            resData = await this.thirdPartyService.findOne(authorizationKioskDto.thirdPartyId);
            if (resData.hasError) {
                return resData;
            }
            const thirdParty = resData.appData;
            const authorizationKiosk = new authorization_kiosk_entity_1.AuthorizationKiosk();
            const { ip, deviceId, organizationId, thirdPartyId, token, isApiKey, username, password } = authorizationKioskDto || {};
            authorizationKiosk.ip = ip;
            authorizationKiosk.deviceId = deviceId;
            authorizationKiosk.organizationId = organizationId;
            authorizationKiosk.thirdPartyId = thirdPartyId;
            switch (thirdParty.authorizationType) {
                case 'token':
                    if (token === null || token === '') {
                        resData.appData = null;
                        resData.hasError = true;
                        resData.message = 'Token must be value';
                        return resData;
                    }
                    authorizationKiosk.username = null;
                    authorizationKiosk.password = null;
                    authorizationKiosk.expireToken = null;
                    authorizationKiosk.token = token;
                    break;
                case 'firebase':
                    if (username === null || username === '' || password === null || password === '') {
                        resData.appData = null;
                        resData.hasError = true;
                        resData.message = 'Username and password must be value';
                        return resData;
                    }
                    resData = await this.firebaseAuthService.getTokenByUsernamePassword(username, password);
                    if (resData.hasError) {
                        return resData;
                    }
                    const { accessToken, refreshToken, expireToken } = resData.appData;
                    authorizationKiosk.username = username;
                    authorizationKiosk.password = password;
                    authorizationKiosk.token = `Bearer ${accessToken}`;
                    authorizationKiosk.refreshToken = refreshToken;
                    authorizationKiosk.expireToken = new Date(expireToken);
                    break;
                default:
                    break;
            }
            let deployEnv = {
                restApiId: constant_1.DeploymentRestApiNoKey.restApiId,
                stage: constant_1.DeploymentRestApiNoKey.stage,
            };
            if (isApiKey) {
                const name = `${Date.now()}${organizationId}${thirdPartyId}`;
                const apiKey = await this.tokenProviderService.generateApiKeyAndMappingToUsagePlan(name, constant_1.UsagePlanKioskId);
                authorizationKiosk.apiKey = apiKey.id;
                authorizationKiosk.apiKeyHash = await bcrypt.hash(apiKey.value, constant_1.SALT_OR_ROUNDS);
                deployEnv.restApiId = constant_1.DeploymentRestApiNeedKey.restApiId;
                deployEnv.stage = constant_1.DeploymentRestApiNeedKey.stage;
            }
            const listIp = await this.getAllIpByApiKey(isApiKey);
            listIp.push(authorizationKiosk.ip);
            await this.tokenProviderService.addIpAndDeployToRestAPI(deployEnv.restApiId, deployEnv.stage, listIp);
            const result = await this.authorizationKioskRepo.save(authorizationKiosk);
            resData.appData = result;
            resData.message = 'Add authorization for Kiosk success';
            return resData;
        }
        catch (error) {
            this.logger.error('[create]: ' + JSON.stringify(error));
            resData.appData = null;
            resData.message = error;
            resData.hasError = true;
            return resData;
        }
    }
    async createFromPMS(authorizationKioskPMSDto) {
        let resData = new response_data_1.ResponseData();
        let resDataPMS = new response_data_1.ResponseData();
        let resDataDA = new response_data_1.ResponseData();
        let resDataSearchAuthPMS = new response_data_1.ResponseData();
        let resDataSearchAuthDA = new response_data_1.ResponseData();
        try {
            const { apiKey, username, password, organizationId } = authorizationKioskPMSDto || {};
            const result = {
                apiKey: '',
                username: '',
                password: ''
            };
            const checkTypeGenAPIKey = apiKey && apiKey != '' ? 'ofPMS' : 'ofDA';
            this.logger.log(`[create]: AuthKioskDto ${JSON.stringify(authorizationKioskPMSDto)}`);
            if (checkTypeGenAPIKey == 'ofDA') {
                resDataDA = await this.thirdPartyService.findOneByAuthorizationType('firebase');
                if (resDataDA.hasError) {
                    return resDataPMS;
                }
                const thirdPartyDA = resDataDA.appData;
                resDataSearchAuthDA = await this.findOneByThirdPartyId(thirdPartyDA.id, organizationId);
                const authorizationKioskDA = new authorization_kiosk_entity_1.AuthorizationKiosk();
                if (username === null || username === '' || password === null || password === '') {
                    resData.appData = null;
                    resData.hasError = true;
                    resData.message = 'Username and password must be value';
                    return resData;
                }
                resData = await this.firebaseAuthService.getTokenByUsernamePassword(username, password);
                if (resData.hasError) {
                    return resData;
                }
                const { accessToken, refreshToken, expireToken } = resData.appData;
                if (!resDataSearchAuthDA.hasError && resDataSearchAuthDA.appData) {
                    authorizationKioskDA.id = resDataSearchAuthDA.appData.id;
                }
                authorizationKioskDA.username = username;
                authorizationKioskDA.password = password;
                authorizationKioskDA.token = `Bearer ${accessToken}`;
                authorizationKioskDA.refreshToken = refreshToken;
                authorizationKioskDA.expireToken = new Date(expireToken);
                authorizationKioskDA.organizationId = organizationId;
                authorizationKioskDA.thirdPartyId = thirdPartyDA.id;
                if (!resDataSearchAuthDA.appData || !resDataSearchAuthDA.appData.apiKey) {
                    const nameAPIDA = `${Date.now()}${authorizationKioskPMSDto.organizationId}${thirdPartyDA.id}`;
                    const apiKeyDA = await this.tokenProviderService.generateApiKeyAndMappingToUsagePlan(nameAPIDA, constant_1.UsagePlanKioskId);
                    authorizationKioskDA.apiKey = apiKeyDA.id;
                    authorizationKioskDA.apiKeyHash = await bcrypt.hash(apiKeyDA.value, constant_1.SALT_OR_ROUNDS);
                }
                const resultAuthDA = await this.authorizationKioskRepo.save(authorizationKioskDA);
                if (!resultAuthDA) {
                    this.logger.error('[create]: Cant add auth for DA');
                    resData.appData = null;
                    resData.message = 'Cant add auth for DA';
                    resData.hasError = true;
                    return resData;
                }
                result.username = username;
                result.password = password;
            }
            else if (checkTypeGenAPIKey == 'ofPMS') {
                resDataPMS = await this.thirdPartyService.findOneByAuthorizationType('token');
                if (resDataPMS.hasError) {
                    return resDataPMS;
                }
                const thirdPartyPMS = resDataPMS.appData;
                resDataSearchAuthPMS = await this.findOneByThirdPartyId(thirdPartyPMS.id, organizationId);
                const authorizationKioskPMS = new authorization_kiosk_entity_1.AuthorizationKiosk();
                if (!resDataSearchAuthPMS.hasError && resDataSearchAuthPMS.appData) {
                    authorizationKioskPMS.id = resDataSearchAuthPMS.appData.id;
                }
                authorizationKioskPMS.token = 'X-API-KEY ' + apiKey;
                const nameAPIPMS = `${Date.now()}${authorizationKioskPMSDto.organizationId}${thirdPartyPMS.id}`;
                const apiKeyPMS = await this.tokenProviderService.generateApiKeyAndMappingToUsagePlan(nameAPIPMS, constant_1.UsagePlanKioskId);
                authorizationKioskPMS.apiKey = apiKeyPMS.id;
                authorizationKioskPMS.apiKeyHash = await bcrypt.hash(apiKeyPMS.value, constant_1.SALT_OR_ROUNDS);
                authorizationKioskPMS.organizationId = organizationId;
                authorizationKioskPMS.thirdPartyId = thirdPartyPMS.id;
                result.apiKey = apiKeyPMS.value;
                const resultAuthPMS = await this.authorizationKioskRepo.save(authorizationKioskPMS);
                if (!resultAuthPMS) {
                    this.logger.error('[create]: Cant add auth for PMS');
                    resData.appData = null;
                    resData.message = 'Cant add auth for PMS';
                    resData.hasError = true;
                    return resData;
                }
            }
            resData.appData = result;
            resData.message = `Add authorization ${checkTypeGenAPIKey} success`;
            return resData;
        }
        catch (error) {
            this.logger.error('[create]: ' + JSON.stringify(error));
            this.logger.error('[create]: ' + error.message);
            resData.appData = null;
            resData.message = error;
            resData.hasError = true;
            return resData;
        }
    }
    async findOne(id) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`[find one]: id ${id}`);
            if (!id || id < 1) {
                resData.hasError = true;
                resData.message = 'Please fill Id valid please';
                return resData;
            }
            const result = await this.authorizationKioskRepo.findOne({
                where: {
                    isDeleted: false,
                    id,
                },
            });
            if (result === null) {
                resData.hasError = true;
                resData.message = 'authorization kiosk not found';
                return resData;
            }
            resData.appData = result;
            resData.message = "Get authorization for Kiosk success";
            return resData;
        }
        catch (error) {
            this.logger.error('[find one]: ' + JSON.stringify(error));
            resData.appData = null;
            resData.message = error;
            resData.hasError = true;
            return resData;
        }
    }
    async findOneByApiKey(apiKey) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`[find one by api key]: id ${apiKey}`);
            if (!apiKey) {
                resData.hasError = true;
                resData.message = 'Please fill api key valid please';
                return resData;
            }
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
            if (result === null) {
                resData.hasError = true;
                resData.appData = null;
                resData.message = 'authorization kiosk not found';
                return resData;
            }
            resData.appData = result;
            resData.message = "Get authorization for Kiosk success";
            return resData;
        }
        catch (error) {
            this.logger.error('[find one by api key]: ' + JSON.stringify(error));
            resData.appData = null;
            resData.message = error;
            resData.hasError = true;
            return resData;
        }
    }
    async findAll() {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`[find all]`);
            const result = await this.authorizationKioskRepo.find({
                where: {
                    isDeleted: false,
                },
                order: {
                    id: 'ASC',
                }
            });
            resData.appData = result;
            resData.message = "Get all authorization for Kiosk success";
            return resData;
        }
        catch (error) {
            this.logger.error('[find all]: ' + JSON.stringify(error));
            resData.appData = null;
            resData.message = error;
            resData.hasError = true;
            return resData;
        }
    }
    async findAllByThirdPartyId(thirdPartyId) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`[find all by third party id] third party id: ${thirdPartyId}`);
            const result = await this.authorizationKioskRepo.find({
                where: {
                    thirdPartyId,
                    isDeleted: false,
                },
                order: {
                    id: 'ASC',
                }
            });
            resData.appData = result;
            resData.message = "Get all authorization for Kiosk by third party id success";
            return resData;
        }
        catch (error) {
            this.logger.error('[find all]: ' + JSON.stringify(error));
            resData.appData = null;
            resData.message = error;
            resData.hasError = true;
            return resData;
        }
    }
    async findOneByThirdPartyId(thirdPartyId, organizationId) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`[find all by third party id] third party id: ${thirdPartyId}`);
            const result = await this.authorizationKioskRepo.findOne({
                where: {
                    thirdPartyId,
                    organizationId,
                    isDeleted: false,
                }
            });
            console.log("🚀 ~ file: authorization.service.ts:368 ~ AuthorizationKioskService ~ findOneByThirdPartyId ~ result:", result);
            if (!result) {
                resData.hasError = true;
                resData.appData = null;
                return resData;
            }
            resData.appData = result;
            resData.message = "Get authorization for Kiosk by third party id success";
            return resData;
        }
        catch (error) {
            this.logger.error('[find all]: ' + JSON.stringify(error));
            resData.appData = null;
            resData.message = error;
            resData.hasError = true;
            return resData;
        }
    }
    async update(authorizationKioskDto) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`[update]: AuthKioskDto ${JSON.stringify(authorizationKioskDto)}`);
            let same = true;
            let needKeyEnv = true;
            resData = await this.findOne(authorizationKioskDto.id);
            if (resData.hasError) {
                return resData;
            }
            const authorizationKiosk = resData.appData;
            this.logger.log(`authorizer: ${JSON.stringify(authorizationKiosk)}`);
            resData = await this.thirdPartyService.findOne(authorizationKioskDto.thirdPartyId);
            if (resData.hasError) {
                return resData;
            }
            const thirdParty = resData.appData;
            const { id, deviceId, organizationId, thirdPartyId, token, ip, isApiKey, username, password } = authorizationKioskDto || {};
            authorizationKiosk.id = id;
            authorizationKiosk.deviceId = deviceId;
            authorizationKiosk.organizationId = organizationId;
            authorizationKiosk.thirdPartyId = thirdPartyId;
            switch (thirdParty.authorizationType) {
                case 'token':
                    if (token === null || token === '') {
                        resData.appData = null;
                        resData.hasError = true;
                        resData.message = 'Token must be value';
                        return resData;
                    }
                    authorizationKiosk.username = null;
                    authorizationKiosk.password = null;
                    authorizationKiosk.expireToken = null;
                    authorizationKiosk.token = token;
                    break;
                case 'firebase':
                    if (username === null || username === '' || password === null || password === '') {
                        resData.appData = null;
                        resData.hasError = true;
                        resData.message = 'Username and password must be value';
                        return resData;
                    }
                    if (authorizationKiosk.username === username && authorizationKiosk.password === password) {
                        break;
                    }
                    resData = await this.firebaseAuthService.getTokenByUsernamePassword(username, password);
                    if (resData.hasError) {
                        return resData;
                    }
                    const { accessToken, refreshToken, expireToken } = resData.appData;
                    authorizationKiosk.username = username;
                    authorizationKiosk.password = password;
                    authorizationKiosk.token = `Bearer ${accessToken}`;
                    authorizationKiosk.refreshToken = refreshToken;
                    authorizationKiosk.expireToken = new Date(expireToken);
                    break;
                default:
                    break;
            }
            let deployEnv = {
                restApiId: constant_1.DeploymentRestApiNeedKey.restApiId,
                stage: constant_1.DeploymentRestApiNeedKey.stage,
            };
            if (!isApiKey && authorizationKiosk.apiKey !== null) {
                await this.tokenProviderService.deleteApiKey(authorizationKiosk.apiKey);
                authorizationKiosk.apiKey = null;
                authorizationKiosk.apiKeyHash = null;
                deployEnv.restApiId = constant_1.DeploymentRestApiNoKey.restApiId;
                deployEnv.stage = constant_1.DeploymentRestApiNoKey.stage;
                same = false;
                needKeyEnv = false;
            }
            else if (isApiKey && authorizationKiosk.apiKey === null) {
                const name = `${Date.now()}${organizationId}${thirdPartyId}`;
                const apiKey = await this.tokenProviderService.generateApiKeyAndMappingToUsagePlan(name, constant_1.UsagePlanKioskId);
                authorizationKiosk.apiKey = apiKey.id;
                authorizationKiosk.apiKeyHash = await bcrypt.hash(apiKey.value, constant_1.SALT_OR_ROUNDS);
                same = false;
            }
            if (same === false) {
                if (needKeyEnv) {
                    const listIp = await this.getAllIpByApiKey(!isApiKey, authorizationKiosk.id);
                    await this.tokenProviderService.addIpAndDeployToRestAPI(constant_1.DeploymentRestApiNoKey.restApiId, constant_1.DeploymentRestApiNoKey.stage, listIp);
                }
                else {
                    const listIp = await this.getAllIpByApiKey(!isApiKey, authorizationKiosk.id);
                    await this.tokenProviderService.addIpAndDeployToRestAPI(constant_1.DeploymentRestApiNeedKey.restApiId, constant_1.DeploymentRestApiNeedKey.stage, listIp);
                }
                await new Promise(r => setTimeout(r, parseInt(process.env.AWS_TIME_WAIT_DEPLOY)));
                const listIp = await this.getAllIpByApiKey(isApiKey);
                listIp.push(ip);
                await this.tokenProviderService.addIpAndDeployToRestAPI(deployEnv.restApiId, deployEnv.stage, listIp);
                authorizationKiosk.ip = ip;
            }
            else if (authorizationKiosk.ip !== ip) {
                const listIp = await this.getAllIpByApiKey(isApiKey, authorizationKiosk.id);
                listIp.push(ip);
                await this.tokenProviderService.addIpAndDeployToRestAPI(deployEnv.restApiId, deployEnv.stage, listIp);
                authorizationKiosk.ip = ip;
            }
            const result = await this.authorizationKioskRepo.save(authorizationKiosk);
            resData.appData = result;
            resData.message = `Update authorization for Kiosk success`;
            return resData;
        }
        catch (error) {
            this.logger.error('[update]: ' + JSON.stringify(error));
            resData.appData = null;
            resData.message = error;
            resData.hasError = true;
            return resData;
        }
    }
    async remove(id) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`[update]: id ${id}`);
            resData = await this.findOne(id);
            if (resData.hasError) {
                return resData;
            }
            const authorizationKiosk = resData.appData;
            this.logger.log(`authorizer: ${JSON.stringify(authorizationKiosk)}`);
            let deployEnv = {
                restApiId: constant_1.DeploymentRestApiNoKey.restApiId,
                stage: constant_1.DeploymentRestApiNoKey.stage,
            };
            if (authorizationKiosk.apiKey !== null) {
                await this.tokenProviderService.deleteApiKey(authorizationKiosk.apiKey);
                deployEnv.restApiId = constant_1.DeploymentRestApiNeedKey.restApiId;
                deployEnv.stage = constant_1.DeploymentRestApiNeedKey.stage;
            }
            const listIp = await this.getAllIpByApiKey(authorizationKiosk.apiKey === null ? false : true, authorizationKiosk.id);
            await this.tokenProviderService.addIpAndDeployToRestAPI(deployEnv.restApiId, deployEnv.stage, listIp);
            authorizationKiosk.setIsDelete(true);
            const result = await this.authorizationKioskRepo.save(authorizationKiosk);
            resData.appData = null;
            resData.message = `Delete authorization for Kiosk success`;
            return resData;
        }
        catch (error) {
            this.logger.error('[update]: ' + JSON.stringify(error));
            resData.appData = null;
            resData.message = error;
            resData.hasError = true;
            return resData;
        }
    }
    async getApiKey(apiKey) {
        const resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`[getApiKey]: apiKey ${apiKey}`);
            const result = await this.tokenProviderService.getTokenInfo(apiKey);
            resData.appData = result;
            resData.message = 'Get api key success';
            return resData;
        }
        catch (error) {
            this.logger.error(`[getApiKey]: apiKey ${apiKey} error ${error}`);
            throw error;
        }
    }
    async getAuthByOrgId(getAuthorizationKioskPMSDto) {
        const resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`[getAuthByOrgId]: orgId ${getAuthorizationKioskPMSDto.organizationId}`);
            const organizationId = Number(getAuthorizationKioskPMSDto.organizationId);
            const AuthData = {
                username: '',
                password: '',
                apiKey: ''
            };
            const result = await this.authorizationKioskRepo.find({
                where: {
                    organizationId,
                    isDeleted: false,
                }
            });
            if (result.length > 0) {
                for (let step = 0; step < result.length; step++) {
                    AuthData.username = !!result[step].username && result[step].username.length > 0 ? result[step].username : AuthData.username;
                    AuthData.password = !!result[step].password && result[step].password.length > 0 ? result[step].password : AuthData.password;
                    const apiKeyId = !result[step].username && !!result[step].apiKey && result[step].apiKey.length > 0 ? result[step].apiKey : '';
                    if (apiKeyId != '') {
                        const getApiKey = await this.tokenProviderService.getTokenInfo(apiKeyId);
                        AuthData.apiKey = getApiKey.value;
                    }
                }
            }
            else {
                resData.hasError = true;
                resData.message = "Cant find auth of KIOSK";
                return resData;
            }
            resData.appData = AuthData;
            resData.message = 'Get auth success';
            return resData;
        }
        catch (error) {
            this.logger.error(`[getAuthByOrgId]: organizationId ${getAuthorizationKioskPMSDto.organizationId} error ${error}`);
            throw error;
        }
    }
    async resetApiKey(id) {
        let resData = new response_data_1.ResponseData();
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
            const apiKeyNew = await this.tokenProviderService.generateApiKeyAndMappingToUsagePlan(name, constant_1.UsagePlanKioskId);
            authorizationKiosk.apiKey = apiKeyNew.id;
            authorizationKiosk.apiKeyHash = await bcrypt.hash(apiKeyNew.value, constant_1.SALT_OR_ROUNDS);
            const result = await this.authorizationKioskRepo.save(authorizationKiosk);
            resData.appData = result;
            resData.message = `Reset api key this authorization for Kiosk success`;
            return resData;
        }
        catch (error) {
            this.logger.error('[resetApiKey]: ' + JSON.stringify(error));
            resData.appData = null;
            resData.message = error;
            resData.hasError = true;
            return resData;
        }
    }
    async resetAccessToken(authorizationKiosk) {
        let resData = new response_data_1.ResponseData();
        this.logger.log('[resetAccessToken]: ' + authorizationKiosk.id);
        try {
            if (authorizationKiosk === null || authorizationKiosk.refreshToken === null) {
                resData.appData = null;
                resData.hasError = true;
                resData.message = 'authorization not found or refresh token is null, so cant provide new access token';
                return resData;
            }
            resData = await this.firebaseAuthService.getAccessTokenByRefeshToken(authorizationKiosk.refreshToken);
            if (resData.hasError) {
                return resData;
            }
            const { accessToken, refreshToken, expireToken } = resData.appData;
            authorizationKiosk.token = `Bearer ${accessToken}`;
            authorizationKiosk.refreshToken = refreshToken;
            authorizationKiosk.expireToken = new Date(expireToken);
            await this.authorizationKioskRepo.save(authorizationKiosk);
            resData.appData = authorizationKiosk;
            resData.message = 'Reset access token success';
            return resData;
        }
        catch (error) {
            this.logger.error('[resetApiKey]: ' + JSON.stringify(error));
            resData.appData = null;
            resData.message = error;
            resData.hasError = true;
            return resData;
        }
    }
    async getAllIpByApiKey(apikey, exceptId) {
        let condition = {
            apiKey: (0, typeorm_2.IsNull)()
        };
        if (exceptId) {
            condition["id"] = (0, typeorm_2.Not)(exceptId);
        }
        if (apikey) {
            condition.apiKey = (0, typeorm_2.Not)((0, typeorm_2.IsNull)());
        }
        const result = await this.authorizationKioskRepo.find({
            where: Object.assign({ isDeleted: false }, condition)
        });
        let listIP = new Array();
        result.forEach((item) => {
            listIP.push(item.ip);
        });
        return listIP;
    }
};
AuthorizationKioskService = AuthorizationKioskService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(authorization_kiosk_entity_1.AuthorizationKiosk)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => third_party_service_1.ThirdPartyService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        third_party_service_1.ThirdPartyService,
        token_provider_service_1.TokenProviderService,
        firebase_auth_service_1.FirebaseAuthService])
], AuthorizationKioskService);
exports.AuthorizationKioskService = AuthorizationKioskService;
//# sourceMappingURL=authorization.service.js.map