import { Test, TestingModule } from '@nestjs/testing';
import { StandardDistancesService } from './standard-distances.service';

describe('StandardDistancesService', () => {
  let service: StandardDistancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StandardDistancesService],
    }).compile();

    service = module.get<StandardDistancesService>(StandardDistancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
