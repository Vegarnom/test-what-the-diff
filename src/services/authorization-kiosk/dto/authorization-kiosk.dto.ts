import { IsNotEmpty } from "class-validator";

export class AuthorizationKioskDto {
    id: number;

    @IsNotEmpty()
    organizationId: number;

    @IsNotEmpty()
    isApiKey: boolean;

    @IsNotEmpty()
    thirdPartyId: number;

    @IsNotEmpty()
    ip: string;

    @IsNotEmpty()
    token: string;

    deviceId: string;   
}