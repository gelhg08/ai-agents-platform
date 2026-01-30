import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity';
import { GenerationLog } from 'src/generation-logs/entities/generation-log.entity';
import { AgentsController } from './agents.controller';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, GenerationLog, Category])],
  providers: [AgentsService],
  controllers: [AgentsController]
})
export class AgentsModule {}
