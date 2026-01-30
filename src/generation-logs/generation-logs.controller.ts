import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { GenerationLogsService } from "./generation-logs.service";
import { GenerationStatus } from "./entities/generation-log.entity";

@Controller('generation-logs')
@ApiTags('Generation Logs')
export class GenerationLogsController {
  constructor(private readonly service: GenerationLogsService) {}

  @Get()
  @ApiOperation({ summary: 'List generation logs' })
  findAll(@Query('status') status?: GenerationStatus) {
    return this.service.findAll(status);
  }
}

