import { Test, TestingModule } from '@nestjs/testing';
import { LogControllerService } from './log-controller.service';

describe('LogControllerService', () => {
  let service: LogControllerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogControllerService],
    }).compile();

    service = module.get<LogControllerService>(LogControllerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
