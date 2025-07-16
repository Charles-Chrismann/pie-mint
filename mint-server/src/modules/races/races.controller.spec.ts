import { Test, TestingModule } from '@nestjs/testing';
import { RacesController } from './races.controller';

describe('RaceController', () => {
  let controller: RacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RacesController],
    }).compile();

    controller = module.get<RacesController>(RacesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
