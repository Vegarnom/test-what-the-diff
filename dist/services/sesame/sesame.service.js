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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SesameService = void 0;
const common_1 = require("@nestjs/common");
const node_aes_cmac_1 = require("node-aes-cmac");
const constant_1 = require("../../common/helper/constant");
const request_http_service_1 = require("../request-http/request-http.service");
const sesame_lock_code_entity_1 = require("./entities/sesame-lock-code.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
let SesameService = class SesameService {
    constructor(sesameLockCodeRespo, httpService, jwt) {
        this.sesameLockCodeRespo = sesameLockCodeRespo;
        this.httpService = httpService;
        this.jwt = jwt;
    }
    async toggleLock(sesameDto, token) {
        try {
            const user = (token && this.jwt.decode(token)) || {
                email: 'iot@genkisystem.com',
            };
            const key_secret_hex = '3cbcd3df9b59bef6cbf9ab24857ab6aa';
            const base64_history = Buffer.from(user['email']).toString('base64');
            const sign = this.generateRandomTag(key_secret_hex);
            const cmd = constant_1.SESAME_CMD_CODE[sesameDto.cmd];
            const url = `https://app.candyhouse.co/api/sesame2/${sesameDto.uuid}/cmd`;
            console.log(`[lock toggle cmd]: ${cmd}`);
            console.log(`[lock toggle history]: ${base64_history}`);
            console.log(`[lock toggle sign]: ${sign}`);
            const payload = {
                cmd: cmd,
                history: base64_history,
                sign: sign,
            };
            const configHeader = {
                'x-api-key': constant_1.SESAME_API_KEY,
            };
            const result = await this.httpService.postRequest({
                url,
                option: configHeader,
                payload,
            });
            console.log(`[lock toggle]: `, JSON.stringify(result));
            return {
                result: 'success',
                uuid: sesameDto.uuid,
            };
        }
        catch (error) {
            console.log('[toggle-sesame]: ', error);
            throw error;
        }
    }
    async getLockStatus(uuid) {
        try {
            const url = `https://app.candyhouse.co/api/sesame2/${uuid}`;
            const configHeader = {
                'x-api-key': constant_1.SESAME_API_KEY,
            };
            const result = await this.httpService.getRequest({
                url,
                option: configHeader,
            });
            const resFormat = {};
            if (result) {
                resFormat['battery'] = result === null || result === void 0 ? void 0 : result.batteryPercentage;
                resFormat['status'] = result === null || result === void 0 ? void 0 : result.CHSesame2Status;
                resFormat['date'] = new Date(result === null || result === void 0 ? void 0 : result.timestamp);
            }
            console.log(`[lock status]: `, resFormat);
            return resFormat;
        }
        catch (error) {
            throw error;
        }
    }
    async getLockHistory(uuid) {
        try {
            const url = `https://app.candyhouse.co/api/sesame2/${uuid}/history?page=1&lg=10`;
            const configHeader = {
                'x-api-key': constant_1.SESAME_API_KEY,
            };
            const result = await this.httpService.getRequest({
                url,
                option: configHeader,
            });
            const historyLock = [];
            const objLockcode = await this.getLockCode();
            if (result) {
                result.map(async (res) => {
                    var _a;
                    historyLock.push({
                        id: res === null || res === void 0 ? void 0 : res.recordID,
                        date: new Date(res === null || res === void 0 ? void 0 : res.timeStamp),
                        description: (_a = objLockcode[res === null || res === void 0 ? void 0 : res.type.toString()]) === null || _a === void 0 ? void 0 : _a.name,
                    });
                    console.log('[history array]: ', historyLock);
                });
            }
            return historyLock;
        }
        catch (error) {
            throw error;
        }
    }
    async createLockCode(sesameLockCodeDto) {
        try {
            const result = this.sesameLockCodeRespo.save(sesameLockCodeDto);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async getLockCode() {
        try {
            const result = await this.sesameLockCodeRespo.find({
                where: {
                    isDeleted: false,
                },
            });
            const objResult = {};
            result.map((res) => (objResult[res.code] = res));
            return objResult;
        }
        catch (error) {
            throw error;
        }
    }
    async findLockCode(lockCode) {
        try {
            const result = await this.sesameLockCodeRespo.findOne({
                where: { code: lockCode, isDeleted: false },
            });
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async updateLockCode(sesameLockCodeDto) {
        try {
            const result = await this.sesameLockCodeRespo.findOne({
                where: {
                    id: sesameLockCodeDto.id,
                    isDeleted: false,
                },
            });
            if (result) {
                return await this.sesameLockCodeRespo.save(sesameLockCodeDto);
            }
        }
        catch (error) {
            throw error;
        }
    }
    async deleteLockCode(id) {
        try {
            const result = await this.sesameLockCodeRespo.findOne({
                where: {
                    id,
                    isDeleted: false,
                },
            });
            if (result) {
                result.isDeleted = true;
                return await this.sesameLockCodeRespo.save(result);
            }
        }
        catch (error) {
            throw error;
        }
    }
    generateRandomTag(secretValue) {
        const key = Buffer.from(secretValue, 'hex');
        const date = Math.floor(Date.now() / 1000);
        const dateDate = Buffer.allocUnsafe(4);
        dateDate.writeUInt32LE(date);
        const message = Buffer.from(dateDate.slice(1, 4));
        return (0, node_aes_cmac_1.aesCmac)(key, message);
    }
};
SesameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(sesame_lock_code_entity_1.SesameLockCode)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        request_http_service_1.RequestHttpService,
        jwt_1.JwtService])
], SesameService);
exports.SesameService = SesameService;
//# sourceMappingURL=sesame.service.js.map