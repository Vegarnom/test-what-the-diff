import { DevicesService } from './devices.service';
import { DevicesDto } from './dto/devices.dto';
import { Request, Response } from 'express';
export declare class DevicesController {
    private readonly devicesService;
    private readonly logger;
    constructor(devicesService: DevicesService);
    createDevice(req: Request, devicesDto: DevicesDto, res: Response): Promise<void>;
    updateDevice(devicesDto: DevicesDto, res: Response): Promise<void>;
    getAllDevicesByUser(req: Request, res: Response): Promise<void>;
    getAllDevices(res: Response): Promise<void>;
}
