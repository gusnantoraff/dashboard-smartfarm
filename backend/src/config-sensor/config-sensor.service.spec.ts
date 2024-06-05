import { Test, TestingModule } from '@nestjs/testing';
import { ConfigSensorService } from './config-sensor.service';

describe('ConfigSensorService', () => {
  let service: ConfigSensorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigSensorService],
    }).compile();

    service = module.get<ConfigSensorService>(ConfigSensorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
