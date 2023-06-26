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
var FirebaseAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseAuthService = void 0;
const common_1 = require("@nestjs/common");
const response_data_1 = require("../../common/params/response.data");
const request_http_service_1 = require("../request-http/request-http.service");
let FirebaseAuthService = FirebaseAuthService_1 = class FirebaseAuthService {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(FirebaseAuthService_1.name);
    }
    async getTokenByUsernamePassword(username, password) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`get token by username: ${username}`);
            const url = process.env.FIREBASE_GET_TOKEN_BY_ACCOUNT_URL;
            const param = {
                'key': process.env.FIREBASE_API_KEY_DMS,
            };
            const payload = {
                'email': username,
                'password': password,
                'returnSecureToken': true,
            };
            const response = await this.httpService.postRequest({
                url: url,
                payload: payload,
                param: param,
            });
            if (response.catch) {
                resData.appData = null;
                resData.hasError = true;
                resData.message = response.data.message;
                return resData;
            }
            const { idToken, refreshToken, expiresIn } = response;
            resData.appData = {
                accessToken: idToken,
                refreshToken,
                expireToken: Date.now() + parseInt(expiresIn) * 1000,
            };
            resData.message = 'Get token by username and password success';
            return resData;
        }
        catch (error) {
            this.logger.error(`get token by username error: ${JSON.stringify(error)}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = error.data.message;
            return resData;
        }
    }
    async getAccessTokenByRefeshToken(refreshToken) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`get access token by refresh token`);
            const url = process.env.FIREBASE_GET_TOKEN_BY_REFRESH_TOKEN;
            const param = {
                'key': process.env.FIREBASE_API_KEY_DMS,
            };
            const payload = {
                'grant_type': 'refresh_token',
                'refresh_token': refreshToken,
            };
            const response = await this.httpService.postRequest({
                url,
                payload,
                param,
            });
            if (response.catch) {
                resData.appData = null;
                resData.hasError = true;
                resData.message = response.data.message;
                return resData;
            }
            const { access_token, refresh_token, expires_in } = response;
            resData.appData = {
                accessToken: access_token,
                refreshToken: refresh_token,
                expireToken: Date.now() + parseInt(expires_in) * 1000,
            };
            resData.message = 'Get access token by refresh token success';
            return resData;
        }
        catch (error) {
            this.logger.error(`get access token by refresh token error: ${JSON.stringify(error)}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = error.data.message;
            return resData;
        }
    }
};
FirebaseAuthService = FirebaseAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_http_service_1.RequestHttpService])
], FirebaseAuthService);
exports.FirebaseAuthService = FirebaseAuthService;
//# sourceMappingURL=firebase-auth.service.js.map