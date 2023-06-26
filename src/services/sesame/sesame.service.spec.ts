import { Test, TestingModule } from '@nestjs/testing';
import { SesameService } from './sesame.service';

describe('SesameService', () => {
  let service: SesameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SesameService],
    })
      .overrideProvider(SesameService)
      .useValue({})
      .compile();

    service = module.get<SesameService>(SesameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
