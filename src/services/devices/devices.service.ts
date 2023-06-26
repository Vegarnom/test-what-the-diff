import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Devices } from './entities/devices.entity';
import { JwtService } from '@nestjs/jwt';
import { DevicesDto } from './dto/devices.dto';

@Injectable()
export class DevicesService {
  private readonly logger = new Logger(DevicesService.name);

  constructor(
    @InjectRepository(Devices)
    private readonly devicesRepo: Repository<Devices>,
    private readonly jwt: JwtService,
  ) {}

  async createDevice(devicesDto: DevicesDto, token: string) {
    try {
      this.logger.log('[createDevice]: ' + devicesDto.deviceId);
      const user = (token && this.jwt.decode(token)) || {
        email: 'iot@genkisystem.com',
      };

      devicesDto.user = user['email'];

      const result = await this.devicesRepo.save(devicesDto);
      this.logger.log(`[createDevice]: success - ` + JSON.stringify(result));

      delete result.isDeleted;
      delete result.createdAt;
      delete result.updatedAt;

      return result;
    } catch (error) {
      this.logger.error('[createDevice] : ' + JSON.stringify(error));
      throw error;
    }
  }

  async updateDevice(devicesDto: DevicesDto) {
    try {
      this.logger.log('[updateDevice]: ', devicesDto);
      const check = await this.devicesRepo.findOne({
        where: { deviceId: devicesDto.deviceId },
      });
      if (check) {
        this.logger.log(`[updateDevice]: success`);
        const result = await this.devicesRepo.save(devicesDto);
        return result;
      } else {
        return null;
      }
    } catch (error) {
      this.logger.log('[updateDevice] : ' + JSON.stringify(error));
      throw error;
    }
  }

  async getAllDevicesByUser(token: string) {
    try {
      const user = (token && this.jwt.decode(token)) || {
        email: 'iot@genkisystem.com',
      };
      this.logger.log('[getAllDevicesByUser]: ', user['email']);

      const result = await this.devicesRepo.find({
        where: { user: user['email'], isDeleted: false },
      });

      this.logger.log(
        '[getAllDevicesByUser]: success - ' + JSON.stringify(result),
      );

      return result;
    } catch (error) {
      this.logger.error('[getAllDevicesByUser]: ' + JSON.stringify(error));
      throw error;
    }
  }

  async getAllDevices() {
    try {
      this.logger.log('[getAllDevices]');
      const result = await this.devicesRepo.find({
        where: { isDeleted: false },
      });

      this.logger.log('[getAllDevices]: success - ', JSON.stringify(result));

      return result;
    } catch (error) {
      this.logger.error('[getAllDevices]: ' + JSON.stringify(error));
      throw error;
    }
  }
}
