import { BrandDeviceService } from './brand-device.service';
import { CreateBrandDeviceDto } from './dto/create-brand-device.dto';
import { UpdateBrandDeviceDto } from './dto/update-brand-device.dto';
import { Response } from 'express';
export declare class BrandDeviceController {
    private readonly brandDeviceService;
    constructor(brandDeviceService: BrandDeviceService);
    create(createBrandDeviceDto: CreateBrandDeviceDto, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(res: Response): Promise<Response<any, Record<string, any>>>;
    findOne(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    update(id: number, updateBrandDeviceDto: UpdateBrandDeviceDto, res: Response): Promise<Response<any, Record<string, any>>>;
    remove(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
