import { Test, TestingModule } from '@nestjs/testing';
import { ManagementControllerService } from './management-controller.service';

describe('ManagementControllerService', () => {
  let service: ManagementControllerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagementControllerService],
    }).compile();

    service = module.get<ManagementControllerService>(ManagementControllerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
