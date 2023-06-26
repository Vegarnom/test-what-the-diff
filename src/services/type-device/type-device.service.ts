import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { TypeBrandDeviceService } from '../type-brand-device/type-brand-device.service';
import { CreateTypeDeviceDto } from './dto/create-type-device.dto';
import { UpdateTypeDeviceDto } from './dto/update-type-device.dto';
import { TypeDevice } from './entities/type-device.entity';

@Injectable()
export class TypeDeviceService {
  private readonly logger = new Logger(TypeDeviceService.name);
  constructor(
    @InjectRepository(TypeDevice)
    private readonly typeDeviceRespo: Repository<TypeDevice>,
    @Inject(forwardRef(() => TypeBrandDeviceService))
    private readonly typeBrandDeviceService: TypeBrandDeviceService,
  ) {}

  async create(
    createTypeDeviceDto: CreateTypeDeviceDto,
  ): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      this.logger.log(
        `create type device ${JSON.stringify(createTypeDeviceDto)}`,
      );
      if (createTypeDeviceDto.name.trim() === ``) {
        resData.message = 'Type name is not validate';
        this.logger.log(
          `Type name ${createTypeDeviceDto.name} is not validate`,
        );
        resData.hasError = true;
        return resData;
      }
      let typeDevice = await this.typeDeviceRespo.findOne({
        where: {
          name: createTypeDeviceDto.name,
          isDeleted: false,
        },
      });
      if (typeDevice === null) {
        typeDevice = await this.typeDeviceRespo.save(createTypeDeviceDto);
        resData.appData = typeDevice;
        resData.message = 'Create type device success';
        this.logger.log(`create type device success`);
        // return 'This action adds a new typeDevice';
        return resData;
      }
      resData.message = 'Type name is exist';
      this.logger.log(`type name ${createTypeDeviceDto.name} is exist`);
      resData.hasError = true;
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
      this.logger.log(`find all type device`);
      const typeDeviceList = await this.typeDeviceRespo.find({
        where: {
          isDeleted: false,
        },
      });
      resData.appData = typeDeviceList;
      resData.message = 'Get type device list success';
      this.logger.log(`find all type device success`);
      // return `This action returns all typeDevice`;
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
        resData.message = 'Type device id is not validate';
        this.logger.log(`type device id ${id} is not validate`);
        return resData;
      }
      const typeDevice = await this.typeDeviceRespo.findOne({
        where: {
          isDeleted: false,
          id,
        },
      });

      if (typeDevice === null) {
        resData.hasError = true;
        resData.message = 'type device is not exist';
        this.logger.log(`type device id ${id} is not exist`);
        return resData;
      }

      resData.appData = typeDevice;
      resData.message = 'Get type device success';
      this.logger.log(`find one by id ${id} success`);
      // return `This action returns a #${id} typeDevice`;
      return resData;
    } catch (error) {
      this.logger.error(`find one by id ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async update(
    id: number,
    updateTypeDeviceDto: UpdateTypeDeviceDto,
  ): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(`update by id ${id}`);
      resData = await this.findOne(id);

      if (resData.hasError) {
        return resData;
      }

      if (updateTypeDeviceDto.name.trim() === ``) {
        resData.message = 'Type name is not validate';
        this.logger.log(
          `type name ${updateTypeDeviceDto.name} is not validate`,
        );
        resData.hasError = true;
        resData.appData = null;
        return resData;
      }
      let typeDevice = resData.appData;
      if (typeDevice.name === updateTypeDeviceDto.name) {
        typeDevice = await this.typeDeviceRespo.save(updateTypeDeviceDto);
        resData.appData = typeDevice;
        resData.message = 'Update type device success';
        this.logger.log(`update by id ${id} success`);
        // return `This action updates a #${id} typeDevice`;
        return resData;
      } else {
        typeDevice = await this.typeDeviceRespo.findOne({
          where: {
            name: updateTypeDeviceDto.name,
            isDeleted: false,
          },
        });
        if (typeDevice === null) {
          typeDevice = await this.typeDeviceRespo.save(updateTypeDeviceDto);
          resData.appData = typeDevice;
          resData.message = 'Update type device success';
          this.logger.log(`update by id ${id} success`);
          // return `This action updates a #${id} typeDevice`;
          return resData;
        } else {
          resData.appData = null;
          resData.message = 'Type name is exist';
          this.logger.log(`type name ${updateTypeDeviceDto.name} is exist`);
          resData.hasError = true;
          return resData;
        }
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
      this.logger.log(`remove by id ${id}`);
      resData = await this.findOne(id);

      if (resData.hasError) {
        return resData;
      }

      const typeDevice = resData.appData;
      typeDevice.setIsDelete(true);
      await this.typeDeviceRespo.save(typeDevice);

      await this.typeBrandDeviceService.removeAllByTypeId(id);

      resData.appData = null;
      resData.message = 'Delete type device success';
      this.logger.log(`remove by id ${id} success`);
      // return `This action removes a #${id} typeDevice`;
      return resData;
    } catch (error) {
      this.logger.error(`remove by id ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }
}
