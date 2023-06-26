import { MappingApiService } from './mapping-api.service';
import { CreateMappingApiDto } from './dto/create-mapping-api.dto';
import { UpdateMappingApiDto } from './dto/update-mapping-api.dto';
import { Request, Response } from 'express';
export declare class MappingApiController {
    private readonly mappingApiService;
    constructor(mappingApiService: MappingApiService);
    create(createMappingApiDto: CreateMappingApiDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getAll(res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(typeBrandId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    findOne(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    update(id: number, updateMappingApiDto: UpdateMappingApiDto, res: Response): Promise<Response<any, Record<string, any>>>;
    remove(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    requestGet(key: string, name: string, body: any, query: any, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    requestPost(key: string, name: string, body: any, query: any, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
