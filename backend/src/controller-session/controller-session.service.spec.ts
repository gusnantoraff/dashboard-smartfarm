import { Test, TestingModule } from '@nestjs/testing';
import { ControllerSessionService } from './controller-session.service';

describe('ControllerSessionService', () => {
  let service: ControllerSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControllerSessionService],
    }).compile();

    service = module.get<ControllerSessionService>(ControllerSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
