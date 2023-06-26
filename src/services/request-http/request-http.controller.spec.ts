import { Test, TestingModule } from '@nestjs/testing';
import { RequestHttpController } from './request-http.controller';

describe('RequestHttpController', () => {
  let controller: RequestHttpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestHttpController],
    }).compile();

    controller = module.get<RequestHttpController>(RequestHttpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
