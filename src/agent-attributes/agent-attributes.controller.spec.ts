import { Test, TestingModule } from '@nestjs/testing';
import { AgentAttributesController } from './agent-attributes.controller';

describe('AgentAttributesController', () => {
  let controller: AgentAttributesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentAttributesController],
    }).compile();

    controller = module.get<AgentAttributesController>(AgentAttributesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
