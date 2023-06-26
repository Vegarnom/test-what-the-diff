import { AbstractEntity } from '../../../common/entities/abstract.entity';
export declare class ThirdPartyApi extends AbstractEntity {
    id: number;
    name: string;
    note: string;
    description: string;
    endpointGetParam: string;
    thirdPartyId: number;
    method: string;
}
