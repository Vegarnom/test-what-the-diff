import { AbstractEntity } from '../../../common/entities/abstract.entity';
export declare class AuthorizationKiosk extends AbstractEntity {
    id: number;
    organizationId: number;
    apiKey: string;
    apiKeyHash: string;
    thirdPartyId: number;
    username: string;
    password: string;
    token: string;
    refreshToken: string;
    expireToken: Date;
    ip: string;
    deviceId: string;
}
