import { Test, TestingModule } from '@nestjs/testing';
import { ControllerController } from './controller.controller';
import { ControllerService } from './controller.service';

describe('ControllerController', () => {
  let controller: ControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControllerController],
      providers: [ControllerService],
    }).compile();

    controller = module.get<ControllerController>(ControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
