import { Test, TestingModule } from '@nestjs/testing';
import { ManagementControllerController } from './management-controller.controller';
import { ManagementControllerService } from './management-controller.service';

describe('ManagementControllerController', () => {
  let controller: ManagementControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagementControllerController],
      providers: [ManagementControllerService],
    }).compile();

    controller = module.get<ManagementControllerController>(ManagementControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
