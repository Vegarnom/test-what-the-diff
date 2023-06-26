import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { checkAndRemoveSpaceInput } from 'src/common/helper/functions';
import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { ThirdPartyApiService } from '../third-party-api/third-party-api.service';
import { CreateThirdPartyDto } from './dto/create-third-party.dto';
import { UpdateThirdPartyDto } from './dto/update-third-party.dto';
import { ThirdParty } from './entities/third-party.entity';
import { AuthorizationKioskService } from '../authorization-kiosk/authorization.service';

@Injectable()
export class ThirdPartyService {
  private readonly logger = new Logger(ThirdPartyService.name);
  constructor(
    @InjectRepository(ThirdParty)
    private readonly thirdPartyRepo: Repository<ThirdParty>,
    @Inject(forwardRef(() => ThirdPartyApiService))
    private readonly thirdPartyApiService: ThirdPartyApiService,
    @Inject(forwardRef(() => AuthorizationKioskService))
    private readonly authorizationKioksService: AuthorizationKioskService,
  ) {}

  async create(
    createThirdPartyDto: CreateThirdPartyDto,
  ): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(
        `Create third party ${JSON.stringify(createThirdPartyDto)}`,
      );

      this.logger.log(`Check data third party`);
      resData = await this.checkDataBeforeCreateAndUpdate(createThirdPartyDto);
      if (resData.hasError) {
        this.logger.log(`${resData.message}`);
        return resData;
      }

      const thirdParty = await this.thirdPartyRepo.save(createThirdPartyDto);
      resData.appData = thirdParty;
      resData.message = 'Create third party success';
      this.logger.log(`Create third party success`);
      // return 'This action adds a new thirdParty';
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
    let resData = new ResponseData();
    try {
      this.logger.log('find all third party');
      const thirdPartyList = await this.thirdPartyRepo.find({
        where: {
          isDeleted: false,
        },
      });

      for (let i = 0; i < thirdPartyList.length; i++) {
        resData = await this.thirdPartyApiService.findAllByThirdPartyId(
          thirdPartyList[i].id,
        );

        thirdPartyList[i]['thirdPartyApiList'] = resData.appData;
      }
      resData.appData = thirdPartyList;
      resData.message = 'Get third party list success';
      this.logger.log('find all third party success');
      // return `This action returns all thirdParty`;
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
      this.logger.log(`find one by third party id ${id}`);
      if (id < 1) {
        resData.hasError = true;
        resData.message = 'Third party id is not validate';
        this.logger.log(`third party id ${id} is not validate`);
        return resData;
      }

      const thirdParty = await this.thirdPartyRepo.findOne({
        where: {
          isDeleted: false,
          id,
        },
      });

      if (thirdParty === null) {
        resData.hasError = true;
        resData.message = 'Third party id not found';
        this.logger.log(`third party id ${id} not found`);
        return resData;
      }

      resData.appData = thirdParty;
      resData.message = 'Get third party success';
      this.logger.log(`find one by third party id ${id} success`);
      // return `This action returns a #${id} thirdParty`;
      return resData;
    } catch (error) {
      this.logger.error(`find one have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async update(
    id: number,
    updateThirdPartyDto: UpdateThirdPartyDto,
  ): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(`Update third party id ${updateThirdPartyDto.id}`);
      resData = await this.findOne(id);
      if (resData.hasError) {
        return resData;
      }

      this.logger.log(`Check data third party`);
      resData = await this.checkDataBeforeCreateAndUpdate(
        updateThirdPartyDto,
        resData.appData,
        true,
      );
      if (resData.hasError) {
        this.logger.log(`${resData.message}`);
        return resData;
      }

      const thirdParty = await this.thirdPartyRepo.save(updateThirdPartyDto);
      resData.appData = thirdParty;
      resData.message = 'Update third party success';
      this.logger.log('Update third party success');
      // return `This action updates a #${id} thirdParty`;
      return resData;
    } catch (error) {
      this.logger.error(`update third party have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async remove(id: number): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(`remove third party id ${id}`);
      resData = await this.findOne(id);
      if (resData.hasError) {
        return resData;
      }
      const thirdParty = resData.appData;

      resData = await this.authorizationKioksService.findAllByThirdPartyId(id);
      if (resData.appData.length > 0) {
        resData.appData = null;
        resData.hasError = true;
        resData.message = 'Please remove authorization kiosk relate to this third party';
        return resData;
      }

      await this.thirdPartyApiService.removeAllByThirdPartyId(id);

      thirdParty.setIsDelete(true);
      await this.thirdPartyRepo.save(thirdParty);
      
      resData.appData = null;
      resData.message = 'Delete third party success';
      this.logger.log(`remove third party id ${id} success`);
      // return `This action removes a #${id} thirdParty`;
      return resData;
    } catch (error) {
      this.logger.error(`remove third party have error: ${error}`);
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
    const resData = new ResponseData();
    let check = checkAndRemoveSpaceInput(data['name']);
    if (!check) {
      resData.hasError = true;
      resData.message = 'Third party name is not validate.';
      return resData;
    }
    check = checkAndRemoveSpaceInput(data['url']);
    if (!check) {
      resData.hasError = true;
      resData.message = 'Third party url is not validate.';
      return resData;
    }

    if (update) {
      if (data['name'] === dataInDB['name']) {
        return resData;
      }
    }
    const thirdParty = await this.thirdPartyRepo.findOne({
      where: {
        name: data['name'],
        isDeleted: false,
      },
    });
    if (thirdParty === null) {
      return resData;
    }
    resData.hasError = true;
    resData.message = 'Third party name is exist';
    return resData;
  }
}
