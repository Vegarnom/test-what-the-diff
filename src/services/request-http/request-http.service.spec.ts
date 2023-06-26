import { Test, TestingModule } from '@nestjs/testing';
import { RequestHttpService } from './request-http.service';

describe('RequestHttpService', () => {
  let service: RequestHttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestHttpService],
    })
      .overrideProvider(RequestHttpService)
      .useValue({})
      .compile();

    service = module.get<RequestHttpService>(RequestHttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
