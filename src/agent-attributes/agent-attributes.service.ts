import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateAgentAttributeDto } from "./dto/update-agent-attribute.dto";
import { CreateAgentAttributeDto } from "./dto/create-agent-attribute.dto";
import { Agent } from "src/agents/entities/agent.entity";
import { Repository } from "typeorm";
import { AgentAttribute } from "./entities/agent-attributes.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AgentAttributesService {
  constructor(
    @InjectRepository(AgentAttribute)
    private readonly attrRepo: Repository<AgentAttribute>,

    @InjectRepository(Agent)
    private readonly agentRepo: Repository<Agent>,
  ) {}

  async create(agentId: number, dto: CreateAgentAttributeDto) {
    const agent = await this.agentRepo.findOneBy({ id: agentId });
    if (!agent) throw new NotFoundException('Agent not found');

    const attribute = this.attrRepo.create({
      agent,
      attrKey: dto.key,
      attrValue: dto.value,
    });

    return this.attrRepo.save(attribute);
  }

  async findByAgent(agentId: number) {
    return this.attrRepo.find({
      where: { agent: { id: agentId } },
    });
  }

  async update(agentId: number, key: string, dto: UpdateAgentAttributeDto) {
    const attr = await this.attrRepo.findOne({
      where: { agent: { id: agentId }, attrKey: key },
    });

    if (!attr) throw new NotFoundException('Attribute not found');

    attr.attrValue = dto.value;
    return this.attrRepo.save(attr);
  }

  async remove(agentId: number, key: string) {
    await this.attrRepo.delete({
      agent: { id: agentId },
      attrKey: key,
    });

    return { deleted: true };
  }
}

