import { Test, TestingModule } from '@nestjs/testing';
import { VisitorsService } from './visitors.service';

describe('VisitorsService', () => {
  let service: VisitorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisitorsService],
    }).compile();

    service = module.get<VisitorsService>(VisitorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
