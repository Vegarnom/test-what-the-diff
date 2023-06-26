import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { METHOD } from 'src/common/helper/constant';
import { checkAndRemoveSpaceInput } from 'src/common/helper/functions';
import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { ThirdPartyService } from '../third-party/third-party.service';
import { CreateThirdPartyApiDto } from './dto/create-third-party-api.dto';
import { UpdateThirdPartyApiDto } from './dto/update-third-party-api.dto';
import { ThirdPartyApi } from './entities/third-party-api.entity';
import { MappingApiService } from '../mapping-api/mapping-api.service';

@Injectable()
export class ThirdPartyApiService {
  private readonly logger = new Logger(ThirdPartyApiService.name);
  constructor(
    @InjectRepository(ThirdPartyApi)
    private readonly thirdPartyApiRepo: Repository<ThirdPartyApi>,
    @Inject(forwardRef(() => ThirdPartyService))
    private readonly thirdPartyService: ThirdPartyService,
    @Inject(forwardRef(() => MappingApiService))
    private readonly mappingApiService: MappingApiService,
  ) {}

  async create(
    createThirdPartyApiDto: CreateThirdPartyApiDto,
  ): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(
        `Create third party api ${JSON.stringify(createThirdPartyApiDto)}`,
      );
      this.logger.log(`Check data third party api`);
      resData = await this.checkDataBeforeCreateAndUpdate(
        createThirdPartyApiDto,
      );
      if (resData.hasError) {
        this.logger.log(`${resData.message}`);
        return resData;
      }

      const thirdPartyApi = await this.thirdPartyApiRepo.save(
        createThirdPartyApiDto,
      );
      resData.appData = thirdPartyApi;
      resData.message = 'Create third party api success';
      this.logger.log('Create third party api success');
      // return 'This action adds a new thirdPartyApi';
      return resData;
    } catch (error) {
      this.logger.error(`create have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async findAllByThirdPartyId(thirdPartyId: number): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(`find all by third party id ${thirdPartyId}`);
      const thirdPartyApiList = await this.thirdPartyApiRepo.find({
        where: {
          isDeleted: false,
          thirdPartyId,
        },
      });

      for (let i = 0; i < thirdPartyApiList.length; i++) {
        resData = await this.thirdPartyService.findOne(
          thirdPartyApiList[i].thirdPartyId,
        );

        thirdPartyApiList[i]['url'] = resData.appData.url;
      }

      resData.appData = thirdPartyApiList;
      resData.message = 'Get third party api list by third party id success';
      this.logger.log(`find all by third party id ${thirdPartyId} success`);
      // return `This action returns all thirdPartyApi`;
      return resData;
    } catch (error) {
      this.logger.error(
        `find all by third party id ${thirdPartyId} have error: ${error}`,
      );
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async findOne(id: number): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(`find one by id ${id}`);
      if (id < 1) {
        resData.hasError = true;
        resData.message = 'Third party api id is not validate';
        return resData;
      }

      const thirdPartyApi = await this.thirdPartyApiRepo.findOne({
        where: {
          isDeleted: false,
          id,
        },
      });

      if (thirdPartyApi === null) {
        resData.hasError = true;
        resData.message = 'Id third party api not found';
        this.logger.log(`id ${id} third party api not found`);
        return resData;
      }

      resData = await this.thirdPartyService.findOne(
        thirdPartyApi.thirdPartyId,
      );
      thirdPartyApi['url'] = resData.appData.url;

      resData.appData = thirdPartyApi;
      resData.message = 'Get third party api success';
      this.logger.log(`Get third party by id ${id} success`);
      // return `This action returns a #${id} thirdPartyApi`;
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
    updateThirdPartyApiDto: UpdateThirdPartyApiDto,
  ): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(`update by id ${id}`);
      resData = await this.findOne(id);
      if (resData.hasError) {
        return resData;
      }

      this.logger.log(`Check data third party api`);
      resData = await this.checkDataBeforeCreateAndUpdate(
        updateThirdPartyApiDto,
        resData.appData,
        true,
      );
      if (resData.hasError) {
        this.logger.log(`${resData.message}`);
        return resData;
      }

      const thirdPartyApi = await this.thirdPartyApiRepo.save(
        updateThirdPartyApiDto,
      );
      resData.appData = thirdPartyApi;
      resData.message = 'Update third party api success';
      this.logger.log(`update by id ${id} success`);
      // return `This action updates a #${id} thirdPartyApi`;
      return resData;
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

      const thirdPartyApi = resData.appData;
      thirdPartyApi.setIsDelete(true);
      await this.thirdPartyApiRepo.save(thirdPartyApi);
      await this.mappingApiService.removeAllByThirdPartyApiId(thirdPartyApi.id);

      resData.appData = null;
      resData.message = 'Delete third party api success';
      this.logger.log(`remove by id ${id} success`);
      // return `This action removes a #${id} thirdPartyApi`;
      return resData;
    } catch (error) {
      this.logger.error(`remove by id ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async removeAllByThirdPartyId(thirdPartyId: number): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(`remove all by third party id ${thirdPartyId}`);
      resData = await this.findAllByThirdPartyId(thirdPartyId);
      if (resData.hasError) {
        return resData;
      }

      const thirdPartyApiList = resData.appData;
      if (thirdPartyApiList.length > 0) {
        for (let i = 0; i < thirdPartyApiList.length; i++) {
          await this.mappingApiService.removeAllByThirdPartyApiId(thirdPartyApiList[i].id);
          thirdPartyApiList[i].setIsDelete(true);
        }
        await this.thirdPartyApiRepo.save(thirdPartyApiList);
      }

      resData.appData = null;
      resData.message = 'Delete all by third party id success';
      this.logger.log(`remove all by third party id ${thirdPartyId} success`);
      // return `This action removes a #${id} thirdPartyApi`;
      return resData;
    } catch (error) {
      this.logger.error(
        `remove all by third party id ${thirdPartyId} have error: ${error}`,
      );
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async checkDataBeforeCreateAndUpdate(
    data: any,
    dataInDB?: any,
    update?: boolean,
  ): Promise<ResponseData> {
    let resData = new ResponseData();
    let check = checkAndRemoveSpaceInput(data['name']);
    if (!check) {
      resData.hasError = true;
      resData.message = 'Third party api name is not validate.';
      return resData;
    }
    check = checkAndRemoveSpaceInput(data['endpointGetParam']);
    if (!check) {
      resData.hasError = true;
      resData.message = 'Third party api endpoint get param is not validate.';
      return resData;
    }

    if (!METHOD.includes(data['method'])) {
      resData.hasError = true;
      resData.message = 'Third party api method is not validate.';
      return resData;
    }

    resData = await this.thirdPartyService.findOne(data['thirdPartyId']);
    if (resData.hasError) {
      return resData;
    }

    if (update) {
      if (data['name'] === dataInDB['name'] && data['method'] === dataInDB['method']) {
        return resData;
      }
    }
    const thirdParty = await this.thirdPartyApiRepo.findOne({
      where: {
        name: data['name'],
        thirdPartyId: data['thirdPartyId'],
        method: data['method'],
        isDeleted: false,
      },
    });
    if (thirdParty === null) {
      return resData;
    }
    resData.hasError = true;
    resData.message = 'Third party api name is exist';
    resData.appData = null;
    return resData;
  }
}
