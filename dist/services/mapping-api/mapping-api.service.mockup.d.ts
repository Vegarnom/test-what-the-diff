/// <reference types="jest" />
import { ResponseData } from 'src/common/params/response.data';
import { CreateMappingApiDto } from './dto/create-mapping-api.dto';
import { UpdateMappingApiDto } from './dto/update-mapping-api.dto';
export declare const mappingApiStub: () => CreateMappingApiDto | UpdateMappingApiDto;
export declare const mockupMappingApiService: {
    create: jest.Mock<ResponseData, [x: any]>;
    findAllByTypeBrandId: jest.Mock<ResponseData, [x: any]>;
    findOne: jest.Mock<ResponseData, [x: any]>;
    update: jest.Mock<ResponseData, [x: any, y: any]>;
    remove: jest.Mock<ResponseData, [x: any]>;
    request: jest.Mock<any, [x: any, y: any, z: any, a: any, b: any]>;
};
