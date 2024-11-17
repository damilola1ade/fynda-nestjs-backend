import { Test, TestingModule } from '@nestjs/testing';
import { TrumpetService } from './trumpet.service';

describe('TrumpetService', () => {
  let service: TrumpetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrumpetService],
    }).compile();

    service = module.get<TrumpetService>(TrumpetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
