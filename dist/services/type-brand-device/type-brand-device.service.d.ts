import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { BrandDeviceService } from '../brand-device/brand-device.service';
import { TypeDeviceService } from '../type-device/type-device.service';
import { CreateTypeBrandDeviceDto } from './dto/create-type-brand-device.dto';
import { UpdateTypeBrandDeviceDto } from './dto/update-type-brand-device.dto';
import { TypeBrandDevice } from './entities/type-brand-device.entity';
import { MappingApiService } from '../mapping-api/mapping-api.service';
export declare class TypeBrandDeviceService {
    private readonly typeBrandDeviceRepo;
    private readonly typeDeviceService;
    private readonly brandDeviceService;
    private readonly mappingApiService;
    private readonly logger;
    constructor(typeBrandDeviceRepo: Repository<TypeBrandDevice>, typeDeviceService: TypeDeviceService, brandDeviceService: BrandDeviceService, mappingApiService: MappingApiService);
    create(createTypeBrandDeviceDto: CreateTypeBrandDeviceDto): Promise<ResponseData>;
    findAll(): Promise<ResponseData>;
    findOne(id: number): Promise<ResponseData>;
    findOneByKey(key: string): Promise<ResponseData>;
    update(id: number, updateTypeBrandDeviceDto: UpdateTypeBrandDeviceDto): Promise<ResponseData>;
    remove(id: number): Promise<ResponseData>;
    removeAllByTypeId(typeDeviceId: number): Promise<void>;
    removeAllByBrandId(brandDeviceId: number): Promise<void>;
}
