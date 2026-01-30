import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AgentAttributesService } from "./agent-attributes.service";
import { CreateAgentAttributeDto } from "./dto/create-agent-attribute.dto";
import { UpdateAgentAttributeDto } from "./dto/update-agent-attribute.dto";

@Controller('agents/:id/attributes')
@ApiTags('Agent Attributes')
export class AgentAttributesController {
  constructor(private readonly service: AgentAttributesService) {}

  @Post()
  @ApiOperation({ summary: 'Create agent attributes'})
  create(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateAgentAttributeDto,
  ) {
    return this.service.create(id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get agents attributes' })
  findAll(@Param('id', ParseIntPipe) id: number) {
    return this.service.findByAgent(id);
  }

  @Patch(':key')
  @ApiOperation({summary: 'Update agent attributes'})
  update(
    @Param('id', ParseIntPipe) id: number,
    @Param('key') key: string,
    @Body() dto: UpdateAgentAttributeDto,
  ) {
    return this.service.update(id, key, dto);
  }

  @Delete(':key')
  @ApiOperation({summary: 'Delete agent attribute'})
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('key') key: string,
  ) {
    return this.service.remove(id, key);
  }
}

