import { Test, TestingModule } from '@nestjs/testing';
import { ConfigSensorController } from './config-sensor.controller';
import { ConfigSensorService } from './config-sensor.service';

describe('ConfigSensorController', () => {
  let controller: ConfigSensorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigSensorController],
      providers: [ConfigSensorService],
    }).compile();

    controller = module.get<ConfigSensorController>(ConfigSensorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
