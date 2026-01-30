import { Test, TestingModule } from '@nestjs/testing';
import { GenerationLogsController } from './generation-logs.controller';

describe('GenerationLogsController', () => {
  let controller: GenerationLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerationLogsController],
    }).compile();

    controller = module.get<GenerationLogsController>(GenerationLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
