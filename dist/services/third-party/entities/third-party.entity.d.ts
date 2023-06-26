import { AbstractEntity } from '../../../common/entities/abstract.entity';
export declare class ThirdParty extends AbstractEntity {
    id: number;
    name: string;
    url: string;
    authorizationType: string;
    note: string;
    description: string;
}
