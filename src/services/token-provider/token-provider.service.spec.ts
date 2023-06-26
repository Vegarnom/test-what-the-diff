import { Test, TestingModule } from '@nestjs/testing';
import { TokenProviderService } from './token-provider.service';

describe('TokenProviderService', () => {
  let service: TokenProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenProviderService],
    }).compile();

    service = module.get<TokenProviderService>(TokenProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
