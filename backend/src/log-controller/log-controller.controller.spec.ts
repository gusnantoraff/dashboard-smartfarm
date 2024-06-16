import { Test, TestingModule } from '@nestjs/testing';
import { LogControllerController } from './log-controller.controller';
import { LogControllerService } from './log-controller.service';

describe('LogControllerController', () => {
  let controller: LogControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogControllerController],
      providers: [LogControllerService],
    }).compile();

    controller = module.get<LogControllerController>(LogControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
