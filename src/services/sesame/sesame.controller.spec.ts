import { Test, TestingModule } from '@nestjs/testing';
import { SesameController } from './sesame.controller';
import { SesameService } from './sesame.service';

describe('SesameController', () => {
  let controller: SesameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SesameController],
      providers: [SesameService],
    })
      .overrideProvider(SesameService)
      .useValue({})
      .compile();

    controller = module.get<SesameController>(SesameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
