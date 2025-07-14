import { Test, TestingModule } from '@nestjs/testing';
import { RacesService } from './races.service';

describe('RacesService', () => {
  let service: RacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RacesService],
    }).compile();

    service = module.get<RacesService>(RacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
