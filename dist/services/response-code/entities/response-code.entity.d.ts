import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { ResponseCodeDto } from '../dto/response-code.dto';
export declare class ResponseCode extends AbstractEntity {
    id: number;
    codeDefault: string;
    codeChange: string;
    default: boolean;
    mappingApiId: number;
    fromResponseCodeDto(responseCodeDto: ResponseCodeDto): ResponseCode;
}
