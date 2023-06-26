import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { TypeBrandDeviceService } from '../type-brand-device/type-brand-device.service';
import { CreateBrandDeviceDto } from './dto/create-brand-device.dto';
import { UpdateBrandDeviceDto } from './dto/update-brand-device.dto';
import { BrandDevice } from './entities/brand-device.entity';
export declare class BrandDeviceService {
    private readonly brandDeviceRespo;
    private readonly typeBrandDeviceService;
    private readonly logger;
    constructor(brandDeviceRespo: Repository<BrandDevice>, typeBrandDeviceService: TypeBrandDeviceService);
    create(createBrandDeviceDto: CreateBrandDeviceDto): Promise<ResponseData>;
    findAll(): Promise<ResponseData>;
    findOne(id: number): Promise<ResponseData>;
    update(id: number, updateBrandDeviceDto: UpdateBrandDeviceDto): Promise<ResponseData>;
    remove(id: number): Promise<ResponseData>;
}
