import { ResponseCode } from '../entities/response-code.entity';
export class ResponseCodeDto {
  id: number;
  codeDefault: string;
  codeChange: string;
  default: boolean;
  mappingApiId: number;
  delete: boolean;
}
