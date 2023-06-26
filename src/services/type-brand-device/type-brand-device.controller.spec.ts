import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { ResponseData } from 'src/common/params/response.data';
import { CreateTypeBrandDeviceDto } from './dto/create-type-brand-device.dto';
import { UpdateTypeBrandDeviceDto } from './dto/update-type-brand-device.dto';
import { TypeBrandDevice } from './entities/type-brand-device.entity';
import { TypeBrandDeviceController } from './type-brand-device.controller';
import { TypeBrandDeviceService } from './type-brand-device.service';

describe('TypeBrandDeviceController', () => {
  let controller: TypeBrandDeviceController;

  const responeJson = {
    json: jest.fn((x) => x),
  };
  const response = {
    status: jest.fn((x) => responeJson),
    body: jest.fn((x) => x),
  } as unknown as Response;

  const typeBrandDevice = new TypeBrandDevice();
  (typeBrandDevice.id = 1), (typeBrandDevice.typeDeviceId = 1);
  typeBrandDevice.brandDeviceId = 1;

  const mockupTypeBrandDeviceService = {
    create: jest.fn((dto: CreateTypeBrandDeviceDto): ResponseData => {
      const resData = new ResponseData();
      dto['id'] = 1;
      if (dto.brandDeviceId === 1 && dto.typeDeviceId === 1) {
        resData.hasError = false;
        resData.appData = dto;
        return resData;
      }
      resData.hasError = true;
      return resData;
    }),
    findAll: jest.fn((): ResponseData => {
      const resData = new ResponseData();
      resData.appData = [typeBrandDevice];
      return resData;
    }),
    findOne: jest.fn((id: number): ResponseData => {
      const resData = new ResponseData();
      if (id === 1) {
        resData.appData = typeBrandDevice;
        return resData;
      }
      resData.hasError = true;
      return resData;
    }),
    update: jest.fn(
      (id: number, dto: UpdateTypeBrandDeviceDto): ResponseData => {
        let resData = new ResponseData();
        resData = mockupTypeBrandDeviceService.findOne(id);
        if (resData.hasError) {
          return resData;
        }
        resData.appData = dto;
        return resData;
      },
    ),
    remove: jest.fn((id: number): ResponseData => {
      let resData = new ResponseData();
      resData = mockupTypeBrandDeviceService.findOne(id);
      if (resData.hasError) {
        return resData;
      }
      resData.appData = null;
      return resData;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeBrandDeviceController],
      providers: [TypeBrandDeviceService],
    })
      .overrideProvider(TypeBrandDeviceService)
      .useValue(mockupTypeBrandDeviceService)
      .compile();

    controller = module.get<TypeBrandDeviceController>(
      TypeBrandDeviceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateTypeBrandDeviceDto = {
      key: '',
      brandDeviceId: 1,
      typeDeviceId: 1,
    };

    it('create success', async () => {
      const result = await controller.create(dto, response);
      expect(mockupTypeBrandDeviceService.create).toHaveBeenCalledWith(dto);
      expect(result['hasError']).toEqual(false);
      expect(response.status).toHaveBeenCalledWith(200);
    });

    it('create fail', async () => {
      dto.brandDeviceId = 2;
      const result = await controller.create(dto, response);
      expect(mockupTypeBrandDeviceService.create).toHaveBeenCalledWith(dto);
      expect(result['hasError']).toEqual(true);
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });
  describe('findAll', () => {
    it('find all success', async () => {
      const result = await controller.findAll(response);
      expect(mockupTypeBrandDeviceService.findAll).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(false);
      expect(result['appData']).toEqual([typeBrandDevice]);
    });
  });

  describe('findOne', () => {
    it('find one success', async () => {
      const result = await controller.findOne(1, response);
      expect(mockupTypeBrandDeviceService.findOne).toHaveBeenCalledWith(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(false);
      expect(result['appData']).toEqual(typeBrandDevice);
    });

    it('find one fail', async () => {
      const result = await controller.findOne(2, response);
      expect(mockupTypeBrandDeviceService.findOne).toHaveBeenCalledWith(2);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(true);
      expect(result['appData']).toEqual(null);
    });
  });

  describe('update', () => {
    const dto: UpdateTypeBrandDeviceDto = {
      id: 1,
      typeDeviceId: 1,
      brandDeviceId: 2,
      key: '',
    };

    it('update success', async () => {
      const result = await controller.update(1, dto, response);
      expect(mockupTypeBrandDeviceService.update).toHaveBeenCalledWith(1, dto);
      expect(mockupTypeBrandDeviceService.findOne).toHaveBeenCalledWith(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(false);
      expect(result['appData']).toEqual(dto);
    });

    it('update fail', async () => {
      const result = await controller.update(2, dto, response);
      expect(mockupTypeBrandDeviceService.update).toHaveBeenCalledWith(2, dto);
      expect(mockupTypeBrandDeviceService.findOne).toHaveBeenCalledWith(2);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(true);
      expect(result['appData']).toEqual(null);
    });
  });

  describe('remove', () => {
    it('remove success', async () => {
      const result = await controller.remove(1, response);
      expect(mockupTypeBrandDeviceService.remove).toHaveBeenCalledWith(1);
      expect(mockupTypeBrandDeviceService.findOne).toHaveBeenCalledWith(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(false);
      expect(result['appData']).toEqual(null);
    });

    it('remove fail', async () => {
      const result = await controller.remove(2, response);
      expect(mockupTypeBrandDeviceService.remove).toHaveBeenCalledWith(2);
      expect(mockupTypeBrandDeviceService.findOne).toHaveBeenCalledWith(2);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(true);
      expect(result['appData']).toEqual(null);
    });
  });
});
