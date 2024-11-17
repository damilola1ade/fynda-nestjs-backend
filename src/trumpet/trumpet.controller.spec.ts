import { Test, TestingModule } from '@nestjs/testing';
import { TrumpetController } from './trumpet.controller';

describe('TrumpetController', () => {
  let controller: TrumpetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrumpetController],
    }).compile();

    controller = module.get<TrumpetController>(TrumpetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
