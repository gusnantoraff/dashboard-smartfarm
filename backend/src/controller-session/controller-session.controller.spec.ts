import { Test, TestingModule } from '@nestjs/testing';
import { ControllerSessionController } from './controller-session.controller';
import { ControllerSessionService } from './controller-session.service';

describe('ControllerSessionController', () => {
  let controller: ControllerSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControllerSessionController],
      providers: [ControllerSessionService],
    }).compile();

    controller = module.get<ControllerSessionController>(ControllerSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
