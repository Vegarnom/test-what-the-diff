import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { BrandDeviceService } from '../brand-device/brand-device.service';
import { OrganizationService } from '../organization/organization.service';
import { CreateTokenDeviceDto } from './dto/create-token-device.dto';
import { UpdateTokenDeviceDto } from './dto/update-token-device.dto';
import { TokenDevice } from './entities/token-device.entity';

@Injectable()
export class TokenDeviceService {
  private readonly logger = new Logger(TokenDeviceService.name);
  constructor(
    @InjectRepository(TokenDevice)
    private readonly tokenRepo: Repository<TokenDevice>,
    private readonly organizationService: OrganizationService,
    // private readonly brandDeviceService: BrandDeviceService,
    @Inject(forwardRef(() => BrandDeviceService))
    private readonly brandDeviceService: BrandDeviceService,
  ) {}

  async findByBrandIdAndOrgId(
    brandId: number,
    orgId: number,
  ): Promise<ResponseData> {
    const resData = new ResponseData();
    this.logger.log(`find one by brandId: ${brandId} and OrgId: ${orgId}`);
    try {
      const tokenDevice = await this.tokenRepo.find({
        where: {
          isDeleted: false,
          brandId: brandId,
          organigationId: orgId,
        },
      });

      if (tokenDevice === null) {
        resData.hasError = true;
        resData.message = 'Not found token with brandId and orgId';
        this.logger.log(`brandId: ${brandId} and OrgId: ${orgId} not found`);
        return resData;
      }

      resData.appData = tokenDevice;
      resData.message = 'Get token by brandId and orgId success';
      return resData;
    } catch (error) {
      this.logger.error(
        `brandId: ${brandId} and OrgId: ${orgId} have error: ${error}`,
      );
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something wrong happend';
      return resData;
    }
  }

  async create(
    createTokenDeviceDto: CreateTokenDeviceDto,
  ): Promise<ResponseData> {
    let resData = new ResponseData();
    this.logger.log(
      `create token device ${JSON.stringify(createTokenDeviceDto)}`,
    );
    try {
      resData = await this.brandDeviceService.findOne(
        createTokenDeviceDto.brandId,
      );
      if (resData.hasError) {
        return resData;
      }

      resData = await this.organizationService.findOne(
        createTokenDeviceDto.organigationId,
      );

      if (resData.hasError) {
        return resData;
      }

      const tokenDevice = await this.tokenRepo.save(createTokenDeviceDto);
      resData.appData = tokenDevice;
      resData.message = 'Creat token device success';
      return resData;
    } catch (error) {
      this.logger.error(
        `Create token device have error: ${JSON.stringify(error)}`,
      );
      resData.hasError = true;
      resData.message = 'Something wrong just happend';
      return resData;
    }
  }

  async update(updateTokenDeviceDto: UpdateTokenDeviceDto): Promise<ResponseData> {
    this.logger.log('[input update data]: ' + JSON.stringify(updateTokenDeviceDto));
    let resData = new ResponseData();

    try {
      const findId = await this.tokenRepo.findOne({
        where: {
          isDeleted: false,
          organigationId: updateTokenDeviceDto.organigationId,
          brandId: updateTokenDeviceDto.brandId,
          typeToken: updateTokenDeviceDto.typeToken,
        },
      });
  
      if (!findId) {
        resData.hasError = true;
        resData.message = `Not found token device id by brandId: ${updateTokenDeviceDto.brandId} and typeToken: ${updateTokenDeviceDto.typeToken}`;
        this.logger.log(`token device id is not exist`);
        return resData;
      }

      updateTokenDeviceDto.id = findId.id;

      resData = await this.brandDeviceService.findOne(updateTokenDeviceDto.brandId);
      if (resData.hasError) {
        return resData;
      }

      resData = await this.organizationService.findOne(updateTokenDeviceDto.organigationId);
      if (resData.hasError) {
        return resData;
      }

      const tokenDevice = await this.tokenRepo.save(updateTokenDeviceDto);
      resData.appData = tokenDevice;
      resData.message = 'Update token device success';
      return resData;
    } catch (error) {
      this.logger.error(
        `update token device have error: ${JSON.stringify(error)}`,
      );
      resData.hasError = true;
      resData.message = 'Something wrong just happend';
      return resData;
    }
  }

  async findOneById(id: number): Promise<ResponseData> {
    this.logger.log(`find one tokenDevice by brandID: ${id}`);
    const resData = new ResponseData();
    const tokenDevice = await this.tokenRepo.findOne({
      where: {
        isDeleted: false,
        id,
      },
    });

    if (!tokenDevice) {
      resData.hasError = true;
      resData.message = 'Not found device id';
      this.logger.log(`token device id ${id} is not exist`);
      return resData;
    }

    resData.appData = tokenDevice;
    resData.message = 'Get device success';
    this.logger.log(`find token device id ${id} success`);
    
    return resData;
  }

  async findByBrandId(brandId: number): Promise<ResponseData> {
    this.logger.log(`find one tokenDevice by brandID: ${brandId}`);
    const resData = new ResponseData();
    const tokenDevice = await this.tokenRepo.find({
      where: {
        isDeleted: false,
        brandId: brandId,
      },
    });

    if (!tokenDevice) {
      resData.hasError = true;
      resData.message = 'Not found device id';
      this.logger.log(`type device id ${brandId} is not exist`);
      resData.appData = [];
      return resData;
    }

    resData.appData = tokenDevice;
    resData.message = 'Get device success';
    this.logger.log(`find type device id ${brandId} success`);

    return resData;
  }

  async findAll(): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      const tokenDevice = await this.tokenRepo.find({
        where: {
          isDeleted: false,
        },
      });
      this.logger.log('[list token device data]: ' + JSON.stringify(tokenDevice));

      resData.appData = tokenDevice;
      resData.message = 'Get token device list success';
      return resData;
    } catch (error) {
      this.logger.error('[error]: ' + JSON.stringify(error));
      resData.hasError = true;
      resData.message = 'Somthing wrong just happend';
      return resData;
    }
  }

  async remove(id: number): Promise<ResponseData> {
    this.logger.log(`remove token device id: ${id}`);
    const resData = await this.findOneById(id);
    if (resData.hasError) {
      return resData;
    }

    resData.appData.setIsDelete(true);
    this.tokenRepo.save(resData.appData);

    resData.message = 'Delete token device success';

    return resData;
  }
}
