import { Test, TestingModule } from '@nestjs/testing';
import { StandardDistancesController } from './standard-distances.controller';

describe('StandardDistancessController', () => {
  let controller: StandardDistancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StandardDistancesController],
    }).compile();

    controller = module.get<StandardDistancesController>(StandardDistancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
