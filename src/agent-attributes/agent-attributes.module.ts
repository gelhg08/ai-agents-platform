import { Module } from '@nestjs/common';
import { AgentAttributesService } from './agent-attributes.service';
import { AgentAttributesController } from './agent-attributes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from 'src/agents/entities/agent.entity';
import { AgentAttribute } from './entities/agent-attributes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, AgentAttribute])],
  providers: [AgentAttributesService],
  controllers: [AgentAttributesController]
})
export class AgentAttributesModule {}
