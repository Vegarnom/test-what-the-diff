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
var RequestHttpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestHttpService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
let RequestHttpService = RequestHttpService_1 = class RequestHttpService {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(RequestHttpService_1.name);
    }
    async getRequest(getReq) {
        try {
            this.logger.log(`[get request full path]: ${getReq.url}`);
            const config = {
                headers: Object.assign({}, getReq === null || getReq === void 0 ? void 0 : getReq.option),
                params: Object.assign({}, getReq === null || getReq === void 0 ? void 0 : getReq.param)
            };
            if (Object.keys(getReq === null || getReq === void 0 ? void 0 : getReq.payload).length > 0 && getReq.payload.constructor === Object) {
                config['data'] = Object.assign({}, getReq === null || getReq === void 0 ? void 0 : getReq.payload);
            }
            const result = await this.httpService.axiosRef.get(getReq.url, config);
            this.logger.log('[get response]: ', result.data);
            if (result.status === common_1.HttpStatus.OK) {
                return result.data;
            }
            return null;
        }
        catch (error) {
            this.logger.error(`[get request error]: ${error}`);
            return {
                catch: true,
                status: error.response && error.response.status || '',
                data: error.response && error.response.data || {
                    hasError: true,
                    message: error.message
                }
            };
        }
    }
    async postRequest(postReq) {
        try {
            this.logger.log(`[post request full path]: ${postReq.url}`);
            const result = await this.httpService.axiosRef.post(postReq.url, postReq === null || postReq === void 0 ? void 0 : postReq.payload, {
                headers: Object.assign({}, postReq === null || postReq === void 0 ? void 0 : postReq.option),
                params: Object.assign({}, postReq === null || postReq === void 0 ? void 0 : postReq.param)
            });
            this.logger.log('[post response]: ', JSON.stringify(result.data));
            if (result.status === common_1.HttpStatus.OK) {
                return result.data;
            }
            return null;
        }
        catch (error) {
            this.logger.error(`[post request error]: ${error}`);
            return {
                catch: true,
                status: error.response && error.response.status || '',
                data: error.response.data.error || error.response && error.response.data || {
                    hasError: true,
                    message: error.message
                }
            };
        }
    }
    async putRequest(postReq) {
        try {
            this.logger.log(`[put request full path]: ${postReq.url}`);
            const result = await this.httpService.axiosRef.put(postReq.url, postReq === null || postReq === void 0 ? void 0 : postReq.payload, {
                headers: Object.assign({}, postReq === null || postReq === void 0 ? void 0 : postReq.option),
                params: Object.assign({}, postReq === null || postReq === void 0 ? void 0 : postReq.param)
            });
            this.logger.log('[put response]: ', result.data);
            if (result.status === common_1.HttpStatus.OK) {
                return result.data;
            }
            return null;
        }
        catch (error) {
            this.logger.error(`[put request error]: ${error}`);
            return {
                catch: true,
                status: error.response && error.response.status || '',
                data: error.response && error.response.data || {
                    hasError: true,
                    message: error.message
                }
            };
        }
    }
    async deleteRequest(postReq) {
        try {
            this.logger.log(`[delete request full path]: ${postReq.url}`);
            const result = await this.httpService.axiosRef.delete(postReq.url, {
                data: Object.assign({}, postReq.payload),
                headers: Object.assign({}, postReq === null || postReq === void 0 ? void 0 : postReq.option),
                params: Object.assign({}, postReq === null || postReq === void 0 ? void 0 : postReq.param)
            });
            this.logger.log('[delete response]: ', result.data);
            if (result.status === common_1.HttpStatus.OK) {
                return result.data;
            }
            return null;
        }
        catch (error) {
            this.logger.error(`[delete request error]: ${error}`);
            return {
                catch: true,
                status: error.response && error.response.status || '',
                data: error.response && error.response.data || {
                    hasError: true,
                    message: error.message
                }
            };
        }
    }
};
RequestHttpService = RequestHttpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], RequestHttpService);
exports.RequestHttpService = RequestHttpService;
//# sourceMappingURL=request-http.service.js.map