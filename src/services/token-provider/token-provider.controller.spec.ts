import { Test, TestingModule } from '@nestjs/testing';
import { TokenProviderController } from './token-provider.controller';
import { TokenProviderService } from './token-provider.service';

describe('TokenProviderController', () => {
  let controller: TokenProviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenProviderController],
      providers: [TokenProviderService],
    })
      .overrideProvider(TokenProviderService)
      .useValue({})
      .compile();

    controller = module.get<TokenProviderController>(TokenProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
