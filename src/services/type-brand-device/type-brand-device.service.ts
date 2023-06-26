import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from 'src/common/params/response.data';
import { In, Repository } from 'typeorm';
import { BrandDeviceService } from '../brand-device/brand-device.service';
import { TypeDeviceService } from '../type-device/type-device.service';
import { CreateTypeBrandDeviceDto } from './dto/create-type-brand-device.dto';
import { UpdateTypeBrandDeviceDto } from './dto/update-type-brand-device.dto';
import { TypeBrandDevice } from './entities/type-brand-device.entity';
import { MappingApiService } from '../mapping-api/mapping-api.service';
import { UpdateMultiTypeBrandDeviceDto } from './dto/update-multi-type-brand-deivce.dto';

@Injectable()
export class TypeBrandDeviceService {
  private readonly logger = new Logger(TypeBrandDeviceService.name);
  constructor(
    @InjectRepository(TypeBrandDevice)
    private readonly typeBrandDeviceRepo: Repository<TypeBrandDevice>,
    @Inject(forwardRef(() => TypeDeviceService))
    private readonly typeDeviceService: TypeDeviceService,
    @Inject(forwardRef(() => BrandDeviceService))
    private readonly brandDeviceService: BrandDeviceService,
    @Inject(forwardRef(() => MappingApiService))
    private readonly mappingApiService: MappingApiService,
  ) {}

  async create(
    createTypeBrandDeviceDto: CreateTypeBrandDeviceDto,
  ): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log('Create type brand device');

      this.logger.log(
        `Check type device id ${createTypeBrandDeviceDto.typeDeviceId}`,
      );
      resData = await this.typeDeviceService.findOne(
        createTypeBrandDeviceDto.typeDeviceId,
      );
      if (resData.hasError) {
        return resData;
      }

      this.logger.log(
        `Check brand device id ${createTypeBrandDeviceDto.brandDeviceId}`,
      );
      resData = await this.brandDeviceService.findOne(
        createTypeBrandDeviceDto.brandDeviceId,
      );
      if (resData.hasError) {
        return resData;
      }

      this.logger.log(
        `Check have key in type brand device key: ${createTypeBrandDeviceDto.key}`,
      );
      if (createTypeBrandDeviceDto.key) {
        resData = await this.findOneByKey(createTypeBrandDeviceDto.key);
        if (!resData.hasError) {
          resData.hasError = true;
          resData.appData = null;
          resData.message = 'Key is exist in DB, please input another key!';
          return resData;
        }
      }

      this.logger.log(`Check type brand device have exist`);
      let typeBrandDevice = await this.typeBrandDeviceRepo.findOne({
        where: {
          typeDeviceId: createTypeBrandDeviceDto.typeDeviceId,
          brandDeviceId: createTypeBrandDeviceDto.brandDeviceId,
          isDeleted: false,
        },
      });

      if (typeBrandDevice === null) {
        typeBrandDevice = await this.typeBrandDeviceRepo.save(
          createTypeBrandDeviceDto,
        );
        resData.hasError = false;
        resData.appData = typeBrandDevice;
        resData.message = 'Create type brand device success';
        this.logger.log(`Create type brand device success`);
        // return 'This action adds a new typeBrandDevice';
        return resData;
      }
      resData.appData = null;
      resData.message = 'Type brand is exist, please check again!';
      resData.hasError = true;
      this.logger.log(`Type brand is exist, please check again!`);
      return resData;
    } catch (error) {
      this.logger.error(`create have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  // search list type by each brand
  async findAllTypeByBrand(): Promise<ResponseData> {
    this.logger.log('list type by each brand');
    let resData = new ResponseData();
    try {
      // get list brand
      resData = await this.brandDeviceService.findAll();
      const listBrand = resData.appData;

      //for list brand to find list typeBrand by each brandId
      for (let index = 0; index < listBrand.length; index++) {
        // find list typeBrand by brandId
        const typeBrandList = await this.typeBrandDeviceRepo.find({
          where: {
            isDeleted: false,
            brandDeviceId: listBrand[index].id,
          },
        });
        // for list typeBrand by brandId[index]
        for (let jndex = 0; jndex < typeBrandList.length; jndex++) {
          //search each name type
          const typeDevice = await this.typeDeviceService.findOne(
            typeBrandList[jndex].typeDeviceId,
          );

          // add name type to list typeBrand
          typeBrandList[jndex]['name'] = typeDevice.appData.name;
        }
        // add list typeBrand to list Brand
        listBrand[index]['typeList'] = typeBrandList;
      }
      resData.appData = listBrand;
      this.logger.log('Get list type by list brand success');
      resData.message = 'Get list type by list brand success';
      return resData;
    } catch (error) {
      this.logger.error(`find all type by brand have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Something wrong just happned';
      return resData;
    }
  }
  async findAll(): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(`find all type brand`);

      this.logger.log(`find all type device`);
      resData = await this.typeDeviceService.findAll();

      const typeDeviceList = resData.appData;

      this.logger.log(`find all brand device with type device id`);
      for (let i = 0; i < typeDeviceList.length; i++) {
        const typeBrandDeviceList = await this.typeBrandDeviceRepo.find({
          where: {
            isDeleted: false,
            typeDeviceId: typeDeviceList[i].id,
          },
        });
        for (let j = 0; j < typeBrandDeviceList.length; j++) {
          const brandDevice = await this.brandDeviceService.findOne(
            typeBrandDeviceList[j].brandDeviceId,
          );
          typeBrandDeviceList[j]['name'] = brandDevice.appData.name;
        }
        typeDeviceList[i]['brandDevice'] = typeBrandDeviceList;
      }
      resData.appData = typeDeviceList;
      resData.message = 'Get type brand device list success';
      this.logger.log(`Get type brand device list success`);
      // return `This action returns all typeBrandDevice`;
      return resData;
    } catch (error) {
      this.logger.error(`find all have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async findOneByTypeIdAndBrandId(
    typeId: number,
    brandId: number,
  ): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      const params = {
        where: {
          isDeleted: false,
        },
      };

      if (typeId > 0) params.where['typeDeviceId'] = typeId;
      if (brandId > 0) params.where['brandDeviceId'] = brandId;

      const typeBrandDevice = await this.typeBrandDeviceRepo.find(params);

      if (!typeBrandDevice) {
        resData.hasError = true;
        this.logger.log(
          `NOT FOUND typeBrand by typeId: ${typeId} & brandId: ${brandId}`,
        );
        resData.message = 'id type and id brand not found';
        resData.appData = [];
        return resData;
      }
      this.logger.log(
        `found SUCCESS typeBrand by typeId: ${typeId} & brandId: ${brandId}`,
      );
      resData.appData = typeBrandDevice;
      resData.message = 'find typebBrand by typeId & brandId success';
      return resData;
    } catch (error) {
      this.logger.error(
        `found typeBrand by brandId: ${brandId} & typeId: ${typeId} have error: ${error}`,
      );
      resData.hasError = true;
      resData.message = 'Something wrong just happend';
      return resData;
    }
  }

  async findByBrandIdAndCanSync(brandId: number): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      const typeBrandDevice = await this.typeBrandDeviceRepo.find({
        where: {
          isDeleted: false,
          brandDeviceId: brandId,
          canSync: true,
        },
      });
      if(!typeBrandDevice) {
        resData.hasError = true;
        this.logger.log(`found Fail typeBrand canSync by brandId: ${brandId}`);
        resData.message = 'not found typeBrand canSync by brandId';
        resData.appData = [];
        return resData;
      }

      this.logger.log(`found Success typeBrand canSync by brandId: ${brandId}`);
      resData.appData = typeBrandDevice;
      resData.message = 'find Success typeBrand canSync by brandId';
      return resData;
    } catch (error) {
      this.logger.error(`found Fail typeBrand canSync by brandId: ${brandId} have error: ${error}`);
      resData.hasError = true;
      resData.message = 'Something wrong kust happend';
      return resData;
    }
  }

  async findOne(id: number): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      this.logger.log(`Get type brand by id ${id}`);

      if (id < 1) {
        resData.hasError = true;
        resData.message = 'type brand device id is not validate';
        this.logger.log(`Type brand id ${id} not validate`);
        return resData;
      }

      const typeBrandDevice = await this.typeBrandDeviceRepo.findOne({
        where: {
          id,
          isDeleted: false,
        },
      });

      if (typeBrandDevice === null) {
        resData.hasError = true;
        resData.message = 'Id type brand device not found';
        this.logger.log(`Type brand id ${id} not found`);
        return resData;
      }

      resData.appData = typeBrandDevice;
      resData.message = 'Get type brand device success';
      this.logger.log(`Get type brand device success`);
      // return `This action returns a #${id} typeBrandDevice`;
      return resData;
    } catch (error) {
      this.logger.error(`find one by ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async findOneByKey(key: string): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      this.logger.log(`Get type brand by key ${key}`);

      const typeBrandDevice = await this.typeBrandDeviceRepo.findOne({
        where: {
          isDeleted: false,
          key,
        },
      });

      if (typeBrandDevice === null) {
        resData.hasError = true;
        resData.message = 'Type brand device not found key';
        this.logger.log(`Type brand device not found key ${key}`);
        return resData;
      }

      resData.appData = typeBrandDevice;
      resData.message = 'Get type brand device success';
      this.logger.log('Get type brand device success by key');
      // return `This action returns a #${id} typeBrandDevice`;
      return resData;
    } catch (error) {
      this.logger.error(`find one by key ${key} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async update(
    id: number,
    updateTypeBrandDeviceDto: UpdateTypeBrandDeviceDto,
  ): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(`Update type brand by id ${id}`);
      this.logger.log(
        `Update dto: ${JSON.stringify(updateTypeBrandDeviceDto)}`,
      );
      this.logger.log(`Check have type brand id ${id}`);
      resData = await this.findOne(id);
      if (resData.hasError) {
        return resData;
      }

      this.logger.log(`Check type brand is validate`);
      const typeBrandDevice = resData.appData;

      this.logger.log(
        `Check have key in type brand device key: ${updateTypeBrandDeviceDto.key}`,
      );
      if (
        updateTypeBrandDeviceDto.key &&
        typeBrandDevice.key !== updateTypeBrandDeviceDto.key
      ) {
        resData = await this.findOneByKey(updateTypeBrandDeviceDto.key);
        if (!resData.hasError) {
          resData.hasError = true;
          resData.appData = null;
          resData.message = 'Key is exist in DB, please input another key!';
          return resData;
        }
      }

      if (
        typeBrandDevice.typeDeviceId ===
          updateTypeBrandDeviceDto.typeDeviceId &&
        typeBrandDevice.brandDeviceId === updateTypeBrandDeviceDto.brandDeviceId
      ) {
        const typeBrandDeviceNew = await this.typeBrandDeviceRepo.save(
          updateTypeBrandDeviceDto,
        );
        resData.hasError = false;
        resData.appData = typeBrandDeviceNew;
        resData.message = 'Update type brand device success';
        this.logger.log(`Update type brand device success`);
        // return `This action updates a #${id} typeBrandDevice`;
        return resData;
      } else {
        this.logger.log(
          `Check type device id ${updateTypeBrandDeviceDto.typeDeviceId}`,
        );
        resData = await this.typeDeviceService.findOne(
          updateTypeBrandDeviceDto.typeDeviceId,
        );
        if (resData.hasError) {
          return resData;
        }

        this.logger.log(
          `Check brand device id ${updateTypeBrandDeviceDto.brandDeviceId}`,
        );
        resData = await this.brandDeviceService.findOne(
          updateTypeBrandDeviceDto.brandDeviceId,
        );
        if (resData.hasError) {
          return resData;
        }

        this.logger.log(`Check type brand device have exist`);
        let typeBrandDevice = await this.typeBrandDeviceRepo.findOne({
          where: {
            typeDeviceId: updateTypeBrandDeviceDto.typeDeviceId,
            brandDeviceId: updateTypeBrandDeviceDto.brandDeviceId,
            isDeleted: false,
          },
        });

        if (typeBrandDevice === null) {
          delete updateTypeBrandDeviceDto['name'];
          await this.typeBrandDeviceRepo.update(
            {
              id: id,
            },
            updateTypeBrandDeviceDto,
          );
          console.log(typeBrandDevice);
          resData.hasError = false;
          resData.appData = typeBrandDevice;
          resData.message = 'Update type brand device success';
          this.logger.log(`Update type brand device success`);
          // return 'This action adds a new typeBrandDevice';
          return resData;
        }
        resData.appData = null;
        resData.message = 'Type brand is exist, please check again!';
        resData.hasError = true;
        this.logger.log(`Type brand is exist, please check again!`);
        return resData;
      }
    } catch (error) {
      this.logger.error(`update by id ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async remove(id: number): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      resData = await this.findOne(id);
      this.logger.log(`remove type brand device by id ${id}`);

      this.logger.log(`Check type brand device id ${id}`);
      if (resData.hasError) {
        return resData;
      }

      const typeBrandDevice = resData.appData;
      await this.mappingApiService.removeAllByTypeBrandId(id);
      typeBrandDevice.setIsDelete(true);
      await this.typeBrandDeviceRepo.save(typeBrandDevice);
      resData.message = 'Delete type brand device success';
      this.logger.log(`Delete type brand device success`);
      // return `This action removes a #${id} typeBrandDevice`;
      return resData;
    } catch (error) {
      this.logger.error(`remove by id ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async removeAllByTypeId(typeDeviceId: number) {
    try {
      this.logger.log(`remove all by type device id ${typeDeviceId}`);
      const typeBrandDeviceList = await this.typeBrandDeviceRepo.find({
        where: {
          typeDeviceId,
          isDeleted: false,
        },
      });
      if (typeBrandDeviceList.length > 0) {
        for (let i = 0; i < typeBrandDeviceList.length; i++) {
          typeBrandDeviceList[i].setIsDelete(true);
          await this.mappingApiService.removeAllByTypeBrandId(
            typeBrandDeviceList[i].id,
          );
        }
        await this.typeBrandDeviceRepo.save(typeBrandDeviceList);
      }
    } catch (error) {
      this.logger.error(
        `remove by all by type id ${typeDeviceId} have error: ${error}`,
      );
    }
  }

  async removeAllByBrandId(brandDeviceId: number) {
    try {
      this.logger.log(`remove all by brand device id ${brandDeviceId}`);
      const typeBrandDeviceList = await this.typeBrandDeviceRepo.find({
        where: {
          brandDeviceId,
          isDeleted: false,
        },
      });
      if (typeBrandDeviceList.length > 0) {
        for (let i = 0; i < typeBrandDeviceList.length; i++) {
          typeBrandDeviceList[i].setIsDelete(true);
          await this.mappingApiService.removeAllByTypeBrandId(
            typeBrandDeviceList[i].id,
          );
        }
        await this.typeBrandDeviceRepo.save(typeBrandDeviceList);
      }
    } catch (error) {
      this.logger.error(
        `remove by all by brand id ${brandDeviceId} have error: ${error}`,
      );
    }
  }

  // update all typeBrand by brandId
  async updateMultiByBrandId(
    typeDeviceId: UpdateMultiTypeBrandDeviceDto,
  ): Promise<ResponseData> {
    let resData = new ResponseData();
    let updateTypeBrandDeviceDto = new UpdateTypeBrandDeviceDto();
    try {
      // get list typeBrand by brandId
      const resListTypeBrandByBrandid = await this.typeBrandDeviceRepo.find({
        where: {
          isDeleted: false,
          brandDeviceId: typeDeviceId.brandDeviceId,
        },
      });

      // case all type can Sync -> false
      if (typeDeviceId.typeDeviceId.length == 0) {
        for (let index = 0; index < resListTypeBrandByBrandid.length; index++) {
          const element = resListTypeBrandByBrandid[index];

          updateTypeBrandDeviceDto = new UpdateTypeBrandDeviceDto();
          updateTypeBrandDeviceDto.id = element.id;
          updateTypeBrandDeviceDto.brandDeviceId = typeDeviceId.brandDeviceId;
          updateTypeBrandDeviceDto.typeDeviceId = element.typeDeviceId;
          updateTypeBrandDeviceDto.canSync = false;
          await this.update(element.id, updateTypeBrandDeviceDto);
        } 
      } else {
        // for list typeBrand 
        for (let index = 0; index < resListTypeBrandByBrandid.length; index++) {
          const element = resListTypeBrandByBrandid[index];
          // check typeId in list typeBrand is in typeBrandId[] or not
          // if in, so edit canSync -> true
          if (typeDeviceId.typeDeviceId.includes(element.typeDeviceId)) {
            updateTypeBrandDeviceDto = new UpdateTypeBrandDeviceDto();
            updateTypeBrandDeviceDto.id = element.id;
            updateTypeBrandDeviceDto.brandDeviceId =  typeDeviceId.brandDeviceId;
            updateTypeBrandDeviceDto.typeDeviceId = element.typeDeviceId;
            updateTypeBrandDeviceDto.canSync = true;
          } else {// if not edit canSync -> false
            updateTypeBrandDeviceDto = new UpdateTypeBrandDeviceDto();
            updateTypeBrandDeviceDto.id = element.id;
            updateTypeBrandDeviceDto.brandDeviceId = typeDeviceId.brandDeviceId;
            updateTypeBrandDeviceDto.typeDeviceId = element.typeDeviceId;
            updateTypeBrandDeviceDto.canSync = false;
          }
          await this.update(element.id, updateTypeBrandDeviceDto);
        }
  
      }
      resData.hasError = false;
      resData.message = 'update multi success';
      resData.appData = [];
      return resData;
    } catch (error) {
      resData.hasError = true;
      resData.message = `update multi have errror: ${error}`;
      resData.appData = [];
      return resData;
    }
  }
}
