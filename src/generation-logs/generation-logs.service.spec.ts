import { Test, TestingModule } from '@nestjs/testing';
import { GenerationLogsService } from './generation-logs.service';

describe('GenerationLogsService', () => {
  let service: GenerationLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerationLogsService],
    }).compile();

    service = module.get<GenerationLogsService>(GenerationLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
