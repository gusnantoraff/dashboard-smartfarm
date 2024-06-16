import { Test, TestingModule } from '@nestjs/testing';
import { VoidPermissionController } from './void-permission.controller';
import { VoidPermissionService } from './void-permission.service';

describe('VoidPermissionController', () => {
  let controller: VoidPermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoidPermissionController],
      providers: [VoidPermissionService],
    }).compile();

    controller = module.get<VoidPermissionController>(VoidPermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
