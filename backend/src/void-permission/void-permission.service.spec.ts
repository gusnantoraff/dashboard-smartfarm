import { Test, TestingModule } from '@nestjs/testing';
import { VoidPermissionService } from './void-permission.service';

describe('VoidPermissionService', () => {
  let service: VoidPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoidPermissionService],
    }).compile();

    service = module.get<VoidPermissionService>(VoidPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
