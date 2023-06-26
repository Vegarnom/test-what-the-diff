import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { TokenDeviceService } from '../token-device/token-device.service';
import { TypeBrandDeviceService } from '../type-brand-device/type-brand-device.service';
import { CreateBrandDeviceDto } from './dto/create-brand-device.dto';
import { UpdateBrandDeviceDto } from './dto/update-brand-device.dto';
import { BrandDevice } from './entities/brand-device.entity';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BrandDeviceService {
  private readonly logger = new Logger(BrandDeviceService.name);
  constructor(
    @InjectRepository(BrandDevice)
    private readonly brandDeviceRespo: Repository<BrandDevice>,
    @Inject(forwardRef(() => TypeBrandDeviceService))
    private readonly typeBrandDeviceService: TypeBrandDeviceService,
    @Inject(forwardRef(() => TokenDeviceService))
    private readonly tokenDeviceService: TokenDeviceService,
    private readonly configService: ConfigService,
  ) {}
  async create(
    createBrandDeviceDto: CreateBrandDeviceDto,
  ): Promise<ResponseData> {
    const resData = new ResponseData();
    let createBrand = new BrandDevice();
    try {
      this.logger.log(
        `create brand device name: ${createBrandDeviceDto.name}, canSync: ${createBrandDeviceDto.canSync}, typeToken: ${createBrandDeviceDto.typeToken}`,
      );
      if (createBrandDeviceDto.name.trim() === ``) {
        this.logger.log(
          `brand name ${createBrandDeviceDto.name} is not validate`,
        );
        resData.message = 'Brand name is not validate';
        resData.hasError = true;
        return resData;
      }
      let brandDevice = await this.brandDeviceRespo.findOne({
        where: {
          name: createBrandDeviceDto.name,
          isDeleted: false,
        },
      });
      if (brandDevice === null) {
        const { buffer = null, originalName = '' } =
          createBrandDeviceDto.file || {};

        const uploadResult = await this.uploadImage(buffer, originalName);

        createBrand.name = createBrandDeviceDto.name;
        createBrand.urlApi = createBrandDeviceDto.urlApi;
        createBrand.canSync = createBrandDeviceDto.canSync;
        createBrand.typeToken = createBrandDeviceDto.typeToken;
        if (!uploadResult.hasError) {
          createBrand.url = uploadResult.appData.Location;
          createBrand.key = uploadResult.appData.Key;
        }

        brandDevice = await this.brandDeviceRespo.save(createBrand);

        resData.appData = brandDevice;
        resData.message = 'create brand device success';
        this.logger.log(`create brand device success`);
        return resData;
      }
      resData.hasError = true;
      resData.message = 'Name brand is exist in db';
      this.logger.log(`brand name ${createBrandDeviceDto.name} is exist`);
      return resData;
    } catch (error) {
      this.logger.error(`create have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async findAll(): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      this.logger.log(`find all brand device`);
      const brandDeviceList = await this.brandDeviceRespo.find({
        where: {
          isDeleted: false,
        },
        order: {
          updatedAt: 'DESC',
        },
      });
      for (let index = 0; index < brandDeviceList.length; index++) {
        const element = brandDeviceList[index];
        const dataTokenDevice = await this.tokenDeviceService.findByBrandId(
          element.id,
        );

        let listTypeToken = [];
        listTypeToken = element.typeToken.split('|') || [];

        let countToken = 0;
        for (let index = 0; index < dataTokenDevice.appData.length; index++) {
          const element = dataTokenDevice.appData[index];
          if (element.valueToken && element.typeToken) {
            countToken++;
          } else {
            await this.tokenDeviceService.remove(element.id);
          }
        }

        element['isAvailable'] = listTypeToken.length === countToken;
      }
      resData.appData = brandDeviceList;
      resData.message = 'Get brand device list success';
      this.logger.log(`find all success`);

      return resData;
    } catch (error) {
      this.logger.error(`find all have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async findOne(id: number): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      this.logger.log(`find one by id ${id}`);
      if (id < 1) {
        resData.hasError = true;
        resData.message = 'Brand device id is not validate';
        this.logger.log(`brand device id ${id} is not validate`);
        return resData;
      }

      const brandDevice = await this.brandDeviceRespo.findOne({
        where: {
          isDeleted: false,
          id,
        },
      });

      if (brandDevice === null) {
        resData.hasError = true;
        resData.message = 'Brand device id not found';
        this.logger.log(`brand device id ${id} not found`);
        return resData;
      }

      resData.appData = brandDevice;
      resData.message = 'Get brand device success';
      this.logger.log(`find one by id ${id} success`);

      return resData;
    } catch (error) {
      this.logger.error(`find one by ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async update(
    id: number,
    updateBrandDeviceDto: UpdateBrandDeviceDto,
  ): Promise<ResponseData> {
    let resData = new ResponseData();
    let updateBrand = new BrandDevice();
    try {
      this.logger.log(`update by id ${id}`);
      resData = await this.findOne(id);

      if (resData.hasError) {
        return resData;
      }

      if (updateBrandDeviceDto.name.trim() === ``) {
        resData.message = 'Brand name is not validate';
        this.logger.log(
          `brand name ${updateBrandDeviceDto.name} is not validate`,
        );
        resData.hasError = true;
        resData.appData = null;
        return resData;
      }
      let brandDevice = await this.brandDeviceRespo.findOne({
        where: {
          name: updateBrandDeviceDto.name,
          isDeleted: false,
        },
      });

      if (brandDevice !== null && brandDevice.id != id) {
        resData.appData = null;
        resData.message = 'Brand name is exist';
        this.logger.log(`brand name ${updateBrandDeviceDto.name} is exist`);
        resData.hasError = true;
        return resData;
      }

      const s3 = new S3();
      if (resData.appData.key) {
        await s3
          .deleteObject({
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Key: resData.appData.key,
          })
          .promise();
      }
      const { buffer = null, originalName = '' } =
      updateBrandDeviceDto.file || {};

      const uploadResult = await this.uploadImage(buffer, originalName);

      updateBrand.id = id;
      updateBrand.name = updateBrandDeviceDto.name;
      updateBrand.urlApi = updateBrandDeviceDto.urlApi;
      updateBrand.canSync = updateBrandDeviceDto.canSync;
      updateBrand.typeToken = updateBrandDeviceDto.typeToken;
      updateBrand.url = null;
      updateBrand.key = null;  

      if (!uploadResult.hasError) {
        updateBrand.url = uploadResult.appData.Location;
        updateBrand.key = uploadResult.appData.Key;  
        
      }

      await this.brandDeviceRespo.update({
        id: id
      }, updateBrand);

      resData.message = 'update brand device success';
      this.logger.log(`update by ${id} success`);
      // return `This action updates a #${id} brandDevice`;
      return resData;
    } catch (error) {
      this.logger.error(`update by ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async remove(id: number): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(`remove by ${id}`);
      resData = await this.findOne(id);

      if (resData.hasError) {
        return resData;
      }
      const brandDevice = resData.appData;
      brandDevice.setIsDelete(true);
      await this.brandDeviceRespo.save(brandDevice);
      await this.typeBrandDeviceService.removeAllByBrandId(id);

      if (resData.appData.key) {
        const s3 = new S3();
        await s3
          .deleteObject({
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Key: resData.appData.key,
          })
          .promise();
      }

      resData.appData = null;
      resData.message = 'delete brand device success';
      this.logger.log(`remove by ${id} success`);
      // return `This action updates a #${id} brandDevice`;
      return resData;
    } catch (error) {
      this.logger.error(`remove by ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async uploadImage(
    dataBuffer: Buffer,
    filename: string,
  ): Promise<ResponseData> {
    const resData = new ResponseData();
    const s3 = new S3();
    this.logger.log(`upload image: ${filename} to s3`);

    try {
      if (dataBuffer != null && filename != '') {
        const uploadResult = await s3
          .upload({
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Body: dataBuffer,
            Key: `${uuid()}-${filename}`,
          })
          .promise();
        console.log(
          '🚀 ~ file: brand-device.service.ts:253 ~ BrandDeviceService ~ uploadPublicFile ~ uploadResult:',
          uploadResult,
        );
        resData.appData = uploadResult;
        resData.hasError = false;
        resData.message = 'upload image succes';
        this.logger.log(`upload image: ${filename} to s3 SUCCESS`);

        return resData;
      } else {
        resData.message = 'no image and no upload image';
        resData.appData = null;
        resData.hasError = true;
        this.logger.log(`no image, no upload image to s3`);

        return resData;
      }
    } catch (error) {
      resData.message = 'upload image fail';
      resData.hasError = true;
      resData.appData = null;
      this.logger.error(`upload image: ${filename} to s3 FAIL`);

      return resData;
    }
  }
}
