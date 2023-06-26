import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { TypeBrandDeviceService } from '../type-brand-device/type-brand-device.service';
import { CreateTypeDeviceDto } from './dto/create-type-device.dto';
import { UpdateTypeDeviceDto } from './dto/update-type-device.dto';
import { TypeDevice } from './entities/type-device.entity';
export declare class TypeDeviceService {
    private readonly typeDeviceRespo;
    private readonly typeBrandDeviceService;
    private readonly logger;
    constructor(typeDeviceRespo: Repository<TypeDevice>, typeBrandDeviceService: TypeBrandDeviceService);
    create(createTypeDeviceDto: CreateTypeDeviceDto): Promise<ResponseData>;
    findAll(): Promise<ResponseData>;
    findOne(id: number): Promise<ResponseData>;
    update(id: number, updateTypeDeviceDto: UpdateTypeDeviceDto): Promise<ResponseData>;
    remove(id: number): Promise<ResponseData>;
}
