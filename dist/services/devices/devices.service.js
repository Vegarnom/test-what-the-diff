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
var DevicesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const devices_entity_1 = require("./entities/devices.entity");
const jwt_1 = require("@nestjs/jwt");
let DevicesService = DevicesService_1 = class DevicesService {
    constructor(devicesRepo, jwt) {
        this.devicesRepo = devicesRepo;
        this.jwt = jwt;
        this.logger = new common_1.Logger(DevicesService_1.name);
    }
    async createDevice(devicesDto, token) {
        try {
            this.logger.log('[createDevice]: ' + devicesDto.deviceId);
            const user = (token && this.jwt.decode(token)) || {
                email: 'iot@genkisystem.com',
            };
            devicesDto.user = user['email'];
            const result = await this.devicesRepo.save(devicesDto);
            this.logger.log(`[createDevice]: success - ` + JSON.stringify(result));
            delete result.isDeleted;
            delete result.createdAt;
            delete result.updatedAt;
            return result;
        }
        catch (error) {
            this.logger.error('[createDevice] : ' + JSON.stringify(error));
            throw error;
        }
    }
    async updateDevice(devicesDto) {
        try {
            this.logger.log('[updateDevice]: ', devicesDto);
            const check = await this.devicesRepo.findOne({
                where: { deviceId: devicesDto.deviceId },
            });
            if (check) {
                this.logger.log(`[updateDevice]: success`);
                const result = await this.devicesRepo.save(devicesDto);
                return result;
            }
            else {
                return null;
            }
        }
        catch (error) {
            this.logger.log('[updateDevice] : ' + JSON.stringify(error));
            throw error;
        }
    }
    async getAllDevicesByUser(token) {
        try {
            const user = (token && this.jwt.decode(token)) || {
                email: 'iot@genkisystem.com',
            };
            this.logger.log('[getAllDevicesByUser]: ', user['email']);
            const result = await this.devicesRepo.find({
                where: { user: user['email'], isDeleted: false },
            });
            this.logger.log('[getAllDevicesByUser]: success - ' + JSON.stringify(result));
            return result;
        }
        catch (error) {
            this.logger.error('[getAllDevicesByUser]: ' + JSON.stringify(error));
            throw error;
        }
    }
    async getAllDevices() {
        try {
            this.logger.log('[getAllDevices]');
            const result = await this.devicesRepo.find({
                where: { isDeleted: false },
            });
            this.logger.log('[getAllDevices]: success - ', JSON.stringify(result));
            return result;
        }
        catch (error) {
            this.logger.error('[getAllDevices]: ' + JSON.stringify(error));
            throw error;
        }
    }
};
DevicesService = DevicesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(devices_entity_1.Devices)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], DevicesService);
exports.DevicesService = DevicesService;
//# sourceMappingURL=devices.service.js.map