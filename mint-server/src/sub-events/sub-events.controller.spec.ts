import { Test, TestingModule } from '@nestjs/testing';
import { SubEventsController } from './sub-events.controller';

describe('SubEventController', () => {
  let controller: SubEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubEventsController],
    }).compile();

    controller = module.get<SubEventsController>(SubEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
