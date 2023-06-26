import { TypeBrandDeviceService } from './type-brand-device.service';
import { CreateTypeBrandDeviceDto } from './dto/create-type-brand-device.dto';
import { UpdateTypeBrandDeviceDto } from './dto/update-type-brand-device.dto';
import { Response } from 'express';
export declare class TypeBrandDeviceController {
    private readonly typeBrandDeviceService;
    constructor(typeBrandDeviceService: TypeBrandDeviceService);
    create(createTypeBrandDeviceDto: CreateTypeBrandDeviceDto, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(res: Response): Promise<Response<any, Record<string, any>>>;
    findOne(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    update(id: number, updateTypeBrandDeviceDto: UpdateTypeBrandDeviceDto, res: Response): Promise<Response<any, Record<string, any>>>;
    remove(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
