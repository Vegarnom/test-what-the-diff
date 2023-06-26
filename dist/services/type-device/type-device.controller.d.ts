import { TypeDeviceService } from './type-device.service';
import { CreateTypeDeviceDto } from './dto/create-type-device.dto';
import { UpdateTypeDeviceDto } from './dto/update-type-device.dto';
import { Response } from 'express';
export declare class TypeDeviceController {
    private readonly typeDeviceService;
    constructor(typeDeviceService: TypeDeviceService);
    create(createTypeDeviceDto: CreateTypeDeviceDto, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(res: Response): Promise<Response<any, Record<string, any>>>;
    findOne(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    update(id: number, updateTypeDeviceDto: UpdateTypeDeviceDto, res: Response): Promise<Response<any, Record<string, any>>>;
    remove(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
