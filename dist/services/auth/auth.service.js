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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_entity_1 = require("./entities/auth.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const constant_1 = require("../../common/helper/constant");
const jwt_1 = require("@nestjs/jwt");
let AuthService = AuthService_1 = class AuthService {
    constructor(authRepo, jwtService) {
        this.authRepo = authRepo;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async signUp(authDto) {
        try {
            this.logger.log(`[signUp]: email=${authDto.email}`);
            const userExisted = await this.authRepo.find({
                where: { email: authDto.email },
            });
            if (userExisted.length > 0) {
                throw new common_1.HttpException('Email is existed.', common_1.HttpStatus.CONFLICT);
            }
            this.logger.log(`[signUp]: check data - ` + JSON.stringify(userExisted));
            const hash = await bcrypt.hash(authDto.password, constant_1.SALT_OR_ROUNDS);
            authDto.isActive = true;
            authDto.password = hash;
            this.logger.log(`[signUp]: isActive=${authDto.isActive}`);
            const auth = await this.authRepo.save(authDto);
            delete auth.password;
            this.logger.log(`[signUp]: ${auth.email}`);
            return auth;
        }
        catch (error) {
            this.logger.error('[sign-up error]: ' + JSON.stringify(error));
            throw error;
        }
    }
    async signIn(authDto) {
        try {
            this.logger.log(`[signIn]: email - ${authDto.email}`);
            const auth = await this.authRepo.findOne({
                where: { email: authDto.email, isActive: true },
            });
            this.logger.log(`[signIn]: query - ` + JSON.stringify(auth));
            if (!auth)
                throw new common_1.HttpException('User not found.', common_1.HttpStatus.UNAUTHORIZED);
            const pwdMatches = await bcrypt.compare(authDto.password, auth === null || auth === void 0 ? void 0 : auth.password);
            if (!pwdMatches)
                throw new common_1.HttpException('User not found.', common_1.HttpStatus.UNAUTHORIZED);
            delete auth.password;
            this.logger.log(`[signIn]: success - atuhId=${auth === null || auth === void 0 ? void 0 : auth.id}`);
            const result = this.jwtService.sign({ email: auth === null || auth === void 0 ? void 0 : auth.email, id: auth === null || auth === void 0 ? void 0 : auth.id, is_active: auth === null || auth === void 0 ? void 0 : auth.isActive }, {
                expiresIn: '7d',
            });
            return {
                email: auth.email,
                access_token: result,
            };
        }
        catch (error) {
            this.logger.error('[signIn]: ' + JSON.stringify(error));
            throw error;
        }
    }
};
AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auth_entity_1.Auth)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map