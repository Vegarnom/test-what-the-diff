import { Test, TestingModule } from '@nestjs/testing';
import { MappingApiController } from './mapping-api.controller';
import { MappingApiService } from './mapping-api.service';
import {
  mappingApiStub,
  mockupMappingApiService,
} from './mapping-api.service.mockup';
import { Request, Response } from 'express';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { MappingApi } from './entities/mapping-api.entity';
import { CreateMappingApiDto } from './dto/create-mapping-api.dto';
import { UpdateMappingApiDto } from './dto/update-mapping-api.dto';
import { DOMParser } from 'xmldom';

describe('MappingApiController', () => {
  let controller: MappingApiController;
  const request = {
    headers: {
      'content-type': 'application/json',
    },
    query: {},
  } as unknown as Request;

  const requestXml = {
    headers: {
      'content-type': 'application/xml',
    },
    query: {},
  } as unknown as Request;

  const responeJson = {
    json: jest.fn((x) => x),
  };
  const response = {
    status: jest.fn((x) => responeJson),
    body: jest.fn((x) => x),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MappingApiController],
      providers: [MappingApiService],
    })
      .overrideProvider(MappingApiService)
      .useValue(mockupMappingApiService)
      .compile();

    controller = module.get<MappingApiController>(MappingApiController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    let createMappingApiDto: CreateMappingApiDto;
    beforeEach(() => {
      createMappingApiDto = mappingApiStub();
    });

    it('create data success return mapping api', async () => {
      const mappingApi = new MappingApi();
      mappingApi.fromCreateMappingApiDto(createMappingApiDto);
      const result = await controller.create(createMappingApiDto, response);
      expect(mockupMappingApiService.create).toHaveBeenCalledWith(
        createMappingApiDto,
      );
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(false);
      expect(result['appData']).toEqual(mappingApi);
    });

    it('input data wrong type data and return about code 400', async () => {
      const target: ValidationPipe = new ValidationPipe({
        transform: true,
      });
      const metadata: ArgumentMetadata = {
        ...mappingApiStub,
        type: 'query',
      };
      await target.transform(<CreateMappingApiDto>{}, metadata).catch((err) => {
        expect(err.getResponse().status).toEqual(400);
      });
    });

    it('input requestParam emty return hasError true', async () => {
      while (createMappingApiDto.requestParams.length > 0) {
        createMappingApiDto.requestParams.pop();
      }
      const result = await controller.create(createMappingApiDto, response);
      expect(mockupMappingApiService.create).toHaveBeenCalledWith(
        createMappingApiDto,
      );
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(true);
    });

    it('input responseParams emty return hasError true', async () => {
      while (createMappingApiDto.responseParams.length > 0) {
        createMappingApiDto.responseParams.pop();
      }
      const result = await controller.create(createMappingApiDto, response);
      expect(mockupMappingApiService.create).toHaveBeenCalledWith(
        createMappingApiDto,
      );
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(true);
    });

    it('input requestParams have item not have type return hasError true', async () => {
      createMappingApiDto.requestParams[0].type = [''];
      const result = await controller.create(createMappingApiDto, response);
      expect(mockupMappingApiService.create).toHaveBeenCalledWith(
        createMappingApiDto,
      );
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(true);
      createMappingApiDto.requestParams[0].type = ['object'];
    });

    it('input responseParams have item not have type return hasError true', async () => {
      createMappingApiDto.responseParams[0].type = [''];
      const result = await controller.create(createMappingApiDto, response);
      expect(mockupMappingApiService.create).toHaveBeenCalledWith(
        createMappingApiDto,
      );
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(true);
      createMappingApiDto.responseParams[0].type = ['object'];
    });
  });

  describe('get all mapping api', () => {
    it('get all mapping api by type brand id success', async () => {
      const mappingApi = new MappingApi();
      mappingApi.fromCreateMappingApiDto(mappingApiStub());
      const result = await controller.findAll(1, response);
      expect(mockupMappingApiService.findAllByTypeBrandId).toHaveBeenCalledWith(
        1,
      );
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(false);
      expect(result['appData']).toEqual([mappingApi]);
    });

    it('get all mapping api by type brand id but not input type brand id return code 400', async () => {
      await controller.findAll(null, response);
      expect(response.status).toHaveBeenCalledWith(400);
    });
  });

  describe('findOne', () => {
    it('get one mapping api by id success', async () => {
      const result = await controller.findOne(10000, response);
      expect(mockupMappingApiService.findOne).toHaveBeenCalledWith(10000);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(false);
    });

    it('get one mapping api by id input id < 1 return hasError true', async () => {
      const result = await controller.findOne(-1, response);
      expect(mockupMappingApiService.findOne).toHaveBeenCalledWith(-1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(true);
    });

    it('get one mapping api by id input id not found or delete in db return hasError true', async () => {
      const result = await controller.findOne(1, response);
      expect(mockupMappingApiService.findOne).toHaveBeenCalledWith(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(true);
    });
  });
  describe('update', () => {
    let updateMappingApiDto: UpdateMappingApiDto;
    beforeEach(() => {
      updateMappingApiDto = mappingApiStub();
    });

    it('update mapping api fail input id not found return mapping api', async () => {
      const mappingApi = new MappingApi();
      mappingApi.fromCreateMappingApiDto(updateMappingApiDto);
      const result = await controller.update(1, updateMappingApiDto, response);
      expect(mockupMappingApiService.update).toHaveBeenCalledWith(
        1,
        updateMappingApiDto,
      );
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(true);
    });

    it('input data wrong type data and return about code 400', async () => {
      const target: ValidationPipe = new ValidationPipe({
        transform: true,
      });
      const metadata: ArgumentMetadata = {
        ...mappingApiStub,
        type: 'query',
      };
      await target.transform(<CreateMappingApiDto>{}, metadata).catch((err) => {
        expect(err.getResponse().status).toEqual(400);
      });
    });
  });

  describe('remove', () => {
    it('remove one mapping api by id success', async () => {
      const result = await controller.remove(10000, response);
      expect(mockupMappingApiService.remove).toHaveBeenCalledWith(10000);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(false);
    });

    it('remove one mapping api by id input id < 1 return hasError true', async () => {
      const result = await controller.remove(-1, response);
      expect(mockupMappingApiService.remove).toHaveBeenCalledWith(-1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(true);
    });

    it('remove one mapping api by id input id not found or delete in db return hasError true', async () => {
      const result = await controller.remove(1, response);
      expect(mockupMappingApiService.remove).toHaveBeenCalledWith(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(true);
    });
  });

  describe('request', () => {
    const body = {
      guest: {
        guestAge: 10,
        guestName: 'Trung',
      },
    };

    const bodyXml = `<root>
      <xmlbuilder for="node-js">
        <repo type="git">git://github.com/oozcitak/xmlbuilder-js.git</repo>
      </xmlbuilder>
      <test>complete</test>
    </root>`;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(bodyXml, 'text/xml');

    it('request success return json', async () => {
      const result = await controller.requestPost(
        '',
        '',
        body,
        request,
        response,
      );
      expect(mockupMappingApiService.request).toHaveBeenCalledWith(
        '',
        '',
        'POST',
        'json',
        body,
      );
      expect(result['request']).toEqual({
        customer: {
          customerAge: 10,
          customerName: 'Trung',
        },
      });
    });

    it('request error type != mapping api type return code 400', async () => {
      await controller.requestPost('', '', xmlDoc, requestXml, response);
      expect(response.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get all apis', () => {
    it('Return array of apis mapping', async () => {
      const result = [
        {
          createdAt: '2022-09-30T03:53:51.450Z',
          updatedAt: '2022-09-30T04:14:03.913Z',
          id: 1,
          endpoint: 'lhttp://localhost:8080',
          requestHeaderParam: 'asd',
          name: 'asd',
          note: null,
          description: null,
          thirdPartyApiId: 1,
          typeBrandId: 1,
          method: 'GET',
          requestType: 'json',
          responseType: 'json',
        },
      ];

      const res = await controller.getAll(response);

      expect(res['appData']).toEqual(result);
    });
  });
});
