import { Test, TestingModule } from '@nestjs/testing';
import { AgentAttributesService } from './agent-attributes.service';

describe('AgentAttributesService', () => {
  let service: AgentAttributesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentAttributesService],
    }).compile();

    service = module.get<AgentAttributesService>(AgentAttributesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
