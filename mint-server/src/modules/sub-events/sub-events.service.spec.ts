import { Test, TestingModule } from '@nestjs/testing';
import { SubEventsService } from './sub-events.service';

describe('SubEventsService', () => {
  let service: SubEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubEventsService],
    }).compile();

    service = module.get<SubEventsService>(SubEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
