import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GetRequestDto, PostRequestDto } from './dto/request-http.dto';

@Injectable()
export class RequestHttpService {
  private readonly logger = new Logger(RequestHttpService.name);

  constructor(private readonly httpService: HttpService) {}

  async getRequest(getReq: GetRequestDto): Promise<any> {
    try {
      this.logger.log(`[get request full path]: ${getReq.url}`);
      const result = await this.httpService.axiosRef.get(getReq.url, {
        data: { ...getReq?.payload },
        headers: { ...getReq?.option },
        params: { ...getReq?.param}
      });
      this.logger.log('[get response]: ', result.data);
      if (result.status === HttpStatus.OK) {
        return result.data;
      }
      return null;
    } catch (error) {
      this.logger.error(`[get request error]: ${error}`);
      return {
        catch: true,
        status: error.response && error.response.status || '',
        data: error.response && error.response.data || {
          hasError: true,
          message: error.message
        }
      }
    }
  }

  async postRequest(postReq: PostRequestDto): Promise<any> {
    try {
      this.logger.log(`[post request full path]: ${postReq.url}`);
      const result = await this.httpService.axiosRef.post(
        postReq.url,
        postReq?.payload,
        {
          headers: { ...postReq?.option },
          params: { ...postReq?.param}
        },
      );
      this.logger.log('[post response]: ', result.data);
      if (result.status === HttpStatus.OK) {
        return result.data;
      }
      return null;
    } catch (error) {
      this.logger.error(`[post request error]: ${error}`);
      return {
        catch: true,
        status: error.response && error.response.status || '',
        data: error.response && error.response.data || {
          hasError: true,
          message: error.message
        }
      }
    }
  }

  async putRequest(postReq: PostRequestDto): Promise<any> {
    try {
      this.logger.log(`[put request full path]: ${postReq.url}`);
      const result = await this.httpService.axiosRef.put(
        postReq.url,
        postReq?.payload,
        {
          headers: { ...postReq?.option },
          params: { ...postReq?.param}
        },
      );
      this.logger.log('[put response]: ', result.data);
      if (result.status === HttpStatus.OK) {
        return result.data;
      }
      return null;
    } catch (error) {
      this.logger.error(`[put request error]: ${error}`);
      return {
        catch: true,
        status: error.response && error.response.status || '',
        data: error.response && error.response.data || {
          hasError: true,
          message: error.message
        }
      }
    }
  }

  async deleteRequest(postReq: PostRequestDto): Promise<any> {
    try {
      this.logger.log(`[delete request full path]: ${postReq.url}`);
      const result = await this.httpService.axiosRef.delete(postReq.url, {
        data: { ...postReq.payload },
        headers: { ...postReq?.option },
        params: { ...postReq?.param}
      });
      this.logger.log('[delete response]: ', result.data);
      if (result.status === HttpStatus.OK) {
        return result.data;
      }
      return null;
    } catch (error) {
      this.logger.error(`[delete request error]: ${error}`);
      return {
        catch: true,
        status: error.response && error.response.status || '',
        data: error.response && error.response.data || {
          hasError: true,
          message: error.message
        }
      }
    }
  }
}
