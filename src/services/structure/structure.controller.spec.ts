import { Test, TestingModule } from '@nestjs/testing';
import { StructureController } from './structure.controller';
import { StructureService } from './structure.service';
import { response } from 'express';
import { CreateStructureDto } from './dto/create-structure.dto';
import { Structure } from './entities/structure.entity';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { UpdateStructureDto } from './dto/update-structure.dto';

describe('StructureController', () => {
  let controller: StructureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StructureController],
      providers: [StructureService],
    }).compile();

    controller = module.get<StructureController>(StructureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    let createStructureDto: CreateStructureDto;
    beforeEach(() => {
      createStructureDto = {
        name: 'nameTest',
        description: '',
      };
    });

    it('create data success return structure list', async () => {
      const structure = new Structure();
      structure.fromCreateStructureDto(createStructureDto);
      const result = await controller.create(createStructureDto, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(false);
      expect(result['appData']).toEqual(structure);
    });

    it('input data wrong type data and return about code 400', async () => {
      const target: ValidationPipe = new ValidationPipe({
        transform: true,
      });
      const metadata: ArgumentMetadata = {
        ...{
          name: 'nameTest',
          description: '',
        },
        type: 'query',
      };
      await target.transform(<CreateStructureDto>{}, metadata).catch((err) => {
        expect(err.getResponse().status).toEqual(400);
      });
    });
  });

  describe('get all struct', () => {
    it('get all structure success', async () => {
      const structure = new Structure();
      structure.fromCreateStructureDto({ name: 'nameTest', description: '' });
      const result = await controller.findAll(response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(false);
      expect(result['appData']).toEqual([structure]);
    });
  });

  describe('update', () => {
    let updateStructureDto: UpdateStructureDto;
    beforeEach(() => {
      updateStructureDto = {
        id: 10000,
        name: 'nameTest',
        isDisable: true,
      };
    });
    it('update structure success', async () => {
      const result = await controller.update(updateStructureDto, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(true);
    });
    it('input data wrong type and return code 400', async () => {
      const target: ValidationPipe = new ValidationPipe({
        transform: true,
      });
      const metadata: ArgumentMetadata = {
        ...{
          id: 10000,
          name: 'nameTest',
          isDisable: true,
        },
        type: 'query',
      };
      await target.transform(<CreateStructureDto>{}, metadata).catch((err) => {
        expect(err.getResponse().status).toEqual(400);
      });
    });
  });

  describe('remove', () => {
    it('remove one structure by name success', async () => {
      const result = await controller.remove('nameTest', response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(false);
    });
  });
});
