import { Test, TestingModule } from '@nestjs/testing';
import { ConfigEcDapController } from './config-ec-dap.controller';
import { ConfigEcDapService } from './config-ec-dap.service';

describe('ConfigEcDapController', () => {
  let controller: ConfigEcDapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigEcDapController],
      providers: [ConfigEcDapService],
    }).compile();

    controller = module.get<ConfigEcDapController>(ConfigEcDapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
