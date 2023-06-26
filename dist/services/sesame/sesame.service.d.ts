import { SesameDto, SesameLockCodeDto } from './dto/sesame.dto';
import { RequestHttpService } from '../request-http/request-http.service';
import { SesameLockCode } from './entities/sesame-lock-code.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
export declare class SesameService {
    private readonly sesameLockCodeRespo;
    private readonly httpService;
    private readonly jwt;
    constructor(sesameLockCodeRespo: Repository<SesameLockCode>, httpService: RequestHttpService, jwt: JwtService);
    toggleLock(sesameDto: SesameDto, token: string): Promise<{
        result: string;
        uuid: string;
    }>;
    getLockStatus(uuid: string): Promise<{}>;
    getLockHistory(uuid: string): Promise<any[]>;
    createLockCode(sesameLockCodeDto: SesameLockCodeDto): Promise<SesameLockCodeDto & SesameLockCode>;
    getLockCode(): Promise<{}>;
    findLockCode(lockCode: number): Promise<SesameLockCode>;
    updateLockCode(sesameLockCodeDto: SesameLockCodeDto): Promise<SesameLockCodeDto & SesameLockCode>;
    deleteLockCode(id: number): Promise<SesameLockCode>;
    generateRandomTag(secretValue: string): any;
}
