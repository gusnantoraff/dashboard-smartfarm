import { Test, TestingModule } from '@nestjs/testing';
import { ConfigEcDapService } from './config-ec-dap.service';

describe('ConfigEcDapService', () => {
  let service: ConfigEcDapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigEcDapService],
    }).compile();

    service = module.get<ConfigEcDapService>(ConfigEcDapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
