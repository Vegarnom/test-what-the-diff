import { Injectable } from '@nestjs/common';
import { SesameDto, SesameLockCodeDto } from './dto/sesame.dto';
import { aesCmac } from 'node-aes-cmac';
import { SESAME_API_KEY, SESAME_CMD_CODE } from '../../common/helper/constant';
import { RequestHttpService } from '../request-http/request-http.service';
import { SesameLockCode } from './entities/sesame-lock-code.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SesameService {
  constructor(
    @InjectRepository(SesameLockCode)
    private readonly sesameLockCodeRespo: Repository<SesameLockCode>,
    private readonly httpService: RequestHttpService,
    private readonly jwt: JwtService,
  ) {}

  async toggleLock(sesameDto: SesameDto, token: string) {
    try {
      const user = (token && this.jwt.decode(token)) || {
        email: 'iot@genkisystem.com',
      };
      const key_secret_hex = '3cbcd3df9b59bef6cbf9ab24857ab6aa';
      const base64_history = Buffer.from(user['email']).toString('base64');
      const sign = this.generateRandomTag(key_secret_hex);
      const cmd = SESAME_CMD_CODE[sesameDto.cmd];

      const url = `https://app.candyhouse.co/api/sesame2/${sesameDto.uuid}/cmd`;
      console.log(`[lock toggle cmd]: ${cmd}`);
      console.log(`[lock toggle history]: ${base64_history}`);
      console.log(`[lock toggle sign]: ${sign}`);

      const payload = {
        cmd: cmd,
        history: base64_history,
        sign: sign,
      };
      const configHeader = {
        'x-api-key': SESAME_API_KEY,
      };

      const result = await this.httpService.postRequest({
        url,
        option: configHeader,
        payload,
      });

      console.log(`[lock toggle]: `, JSON.stringify(result));
      return {
        result: 'success',
        uuid: sesameDto.uuid,
      };
    } catch (error) {
      console.log('[toggle-sesame]: ', error);
      throw error;
    }
  }

  async getLockStatus(uuid: string) {
    try {
      const url = `https://app.candyhouse.co/api/sesame2/${uuid}`;
      const configHeader = {
        'x-api-key': SESAME_API_KEY,
      };

      const result = await this.httpService.getRequest({
        url,
        option: configHeader,
      });

      const resFormat = {};

      if (result) {
        resFormat['battery'] = result?.batteryPercentage;
        resFormat['status'] = result?.CHSesame2Status;
        resFormat['date'] = new Date(result?.timestamp);
      }

      console.log(`[lock status]: `, resFormat);
      return resFormat;
    } catch (error) {
      throw error;
    }
  }

  async getLockHistory(uuid: string) {
    try {
      const url = `https://app.candyhouse.co/api/sesame2/${uuid}/history?page=1&lg=10`;
      const configHeader = {
        'x-api-key': SESAME_API_KEY,
      };

      const result: Array<any> = await this.httpService.getRequest({
        url,
        option: configHeader,
      });

      const historyLock = [];
      const objLockcode = await this.getLockCode();

      if (result) {
        result.map(async (res) => {
          historyLock.push({
            id: res?.recordID,
            date: new Date(res?.timeStamp),
            description: objLockcode[res?.type.toString()]?.name,
          });
          console.log('[history array]: ', historyLock);
        });
      }

      return historyLock;
    } catch (error) {
      throw error;
    }
  }

  async createLockCode(sesameLockCodeDto: SesameLockCodeDto) {
    try {
      const result = this.sesameLockCodeRespo.save(sesameLockCodeDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getLockCode() {
    try {
      const result: Array<SesameLockCode> = await this.sesameLockCodeRespo.find(
        {
          where: {
            isDeleted: false,
          },
        },
      );
      const objResult = {};
      result.map((res) => (objResult[res.code] = res));
      return objResult;
    } catch (error) {
      throw error;
    }
  }

  async findLockCode(lockCode: number) {
    try {
      const result = await this.sesameLockCodeRespo.findOne({
        where: { code: lockCode, isDeleted: false },
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateLockCode(sesameLockCodeDto: SesameLockCodeDto) {
    try {
      const result: SesameLockCode = await this.sesameLockCodeRespo.findOne({
        where: {
          id: sesameLockCodeDto.id,
          isDeleted: false,
        },
      });

      if (result) {
        return await this.sesameLockCodeRespo.save(sesameLockCodeDto);
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteLockCode(id: number) {
    try {
      const result: SesameLockCode = await this.sesameLockCodeRespo.findOne({
        where: {
          id,
          isDeleted: false,
        },
      });

      if (result) {
        result.isDeleted = true;
        return await this.sesameLockCodeRespo.save(result);
      }
    } catch (error) {
      throw error;
    }
  }

  generateRandomTag(secretValue: string) {
    //  key:key-secret_hex to data
    const key = Buffer.from(secretValue, 'hex');

    // message
    // 1. timestamp  (SECONDS SINCE JAN 01 1970. (UTC))  // 1621854456905
    // 2. timestamp to uint32  (little endian)   //f888ab60
    // 3. remove most-significant byte    //0x88ab60
    const date = Math.floor(Date.now() / 1000);
    const dateDate = Buffer.allocUnsafe(4);
    dateDate.writeUInt32LE(date);
    const message = Buffer.from(dateDate.slice(1, 4));

    return aesCmac(key, message);
  }
}
