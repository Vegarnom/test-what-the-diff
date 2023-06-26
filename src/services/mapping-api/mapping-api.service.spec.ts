import { Test, TestingModule } from '@nestjs/testing';
import { MappingApiService } from './mapping-api.service';

describe('MappingApiService', () => {
  let service: MappingApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MappingApiService],
    })
      .overrideProvider(MappingApiService)
      .useValue({})
      .compile();

    service = module.get<MappingApiService>(MappingApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
