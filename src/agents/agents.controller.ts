import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryAgentsDto } from './dto/query-agents.dto';
import { GenerateAgentsDto } from './dto/generate-agents.dto';
import { AgentsService } from './agents.service';

@ApiTags('Agents')
@Controller('agents')
export class AgentsController {
    constructor(private readonly agentsService: AgentsService) { }

    @Post('generate')
    @ApiOperation({ summary: 'Generate agents' })
    generate(@Body() dto: GenerateAgentsDto) {
        return this.agentsService.generate(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List agents with filters and pagination' })
    findAll(@Query() query: QueryAgentsDto) {
        return this.agentsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get agent by id' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.agentsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update agent status or name' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateAgentDto,
    ) {
        return this.agentsService.update(id, dto);
    }
}
