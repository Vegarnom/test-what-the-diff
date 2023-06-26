import { SesameDto, SesameLockCodeDto } from './dto/sesame.dto';
import { SesameService } from './sesame.service';
import { Response, Request } from 'express';
export declare class SesameController {
    private readonly sesameService;
    private readonly logger;
    constructor(sesameService: SesameService);
    activeLock(req: Request, sesameDto: SesameDto, res: Response): Promise<void>;
    getLockHistory(id: string, res: Response): Promise<void>;
    getLockStatus(id: string, res: Response): Promise<void>;
    createLockCode(sesameLockCodeDto: SesameLockCodeDto, res: Response): Promise<void>;
    updateLockCode(sesameLockCodeDto: SesameLockCodeDto, res: Response): Promise<void>;
    deleteLockCode(id: number, res: Response): Promise<void>;
    getAllLockCodes(res: Response): Promise<void>;
}
