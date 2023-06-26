import { Repository } from 'typeorm';
import { Devices } from './entities/devices.entity';
import { JwtService } from '@nestjs/jwt';
import { DevicesDto } from './dto/devices.dto';
export declare class DevicesService {
    private readonly devicesRepo;
    private readonly jwt;
    private readonly logger;
    constructor(devicesRepo: Repository<Devices>, jwt: JwtService);
    createDevice(devicesDto: DevicesDto, token: string): Promise<DevicesDto & Devices>;
    updateDevice(devicesDto: DevicesDto): Promise<DevicesDto & Devices>;
    getAllDevicesByUser(token: string): Promise<Devices[]>;
    getAllDevices(): Promise<Devices[]>;
}
