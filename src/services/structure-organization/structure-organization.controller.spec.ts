import { Test, TestingModule } from '@nestjs/testing';
import { response } from 'express';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { StructureOrganizationController } from './structure-organization.controller';
import { StructureOrganizationService } from './structure-organization.service';
import { CreateStructureOrganizationDto } from './dto/create-structure-organization.dto';
import { UpdateStructureOrganizationDto } from './dto/update-structure-organization.dto';

describe('StructureOrgController', () => {
  let controller: StructureOrganizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StructureOrganizationController],
      providers: [StructureOrganizationService],
    }).compile();

    controller = module.get<StructureOrganizationController>(
      StructureOrganizationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    let createStructureOrgDto: CreateStructureOrganizationDto;
    beforeEach(() => {
      createStructureOrgDto = {
        name: 'nameTest',
        description: '',
        parent_id: 1,
        structure_id: 1,
      };
    });

    it('create data success return structure org list', async () => {
      const structure = new Structure();
      structure.fromCreateStructureDto(createStructureOrgDto);
      const result = await controller.create(createStructureOrgDto, response);
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
      await target
        .transform(<CreateStructureOrganizationDto>{}, metadata)
        .catch((err) => {
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
    let updateStructureOrgDto: UpdateStructureOrganizationDto;
    beforeEach(() => {
      updateStructureOrgDto = {
        id: 10000,
        name: 'nameTest',
      };
    });
    it('update structure success', async () => {
      const result = await controller.update(updateStructureOrgDto, response);
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
        },
        type: 'query',
      };
      await target
        .transform(<UpdateStructureOrganizationDto>{}, metadata)
        .catch((err) => {
          expect(err.getResponse().status).toEqual(400);
        });
    });
  });

  describe('remove', () => {
    it('remove one structure by id success', async () => {
      const result = await controller.remove(10000, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(result['hasError']).toEqual(false);
    });
  });
});
