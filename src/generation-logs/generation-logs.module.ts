import { Module } from '@nestjs/common';
import { GenerationLogsController } from './generation-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenerationLog } from './entities/generation-log.entity';
import { GenerationLogsService } from './generation-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([GenerationLog])],
  controllers: [GenerationLogsController],
  providers: [GenerationLogsService]
})
export class GenerationLogsModule {}
