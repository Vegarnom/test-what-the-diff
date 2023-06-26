import { Test, TestingModule } from '@nestjs/testing';
import { TypeBrandDeviceService } from './type-brand-device.service';

describe('TypeBrandDeviceService', () => {
  let service: TypeBrandDeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeBrandDeviceService],
    })
      .overrideProvider(TypeBrandDeviceService)
      .useValue({})
      .compile();

    service = module.get<TypeBrandDeviceService>(TypeBrandDeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
