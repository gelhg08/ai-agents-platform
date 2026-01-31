import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity';
import { Like, Repository } from 'typeorm';
import { GenerationLog, GenerationStatus } from 'src/generation-logs/entities/generation-log.entity';
import { GenerateAgentsDto } from './dto/generate-agents.dto';
import { QueryAgentsDto } from './dto/query-agents.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Category } from '../categories/entities/category.entity';
import seedrandom from 'seedrandom';

@Injectable()
export class AgentsService {
    constructor(
        @InjectRepository(Agent)
        private readonly agentRepo: Repository<Agent>
    ) { }

    async generate(dto: GenerateAgentsDto) {
        return this.agentRepo.manager.transaction(async manager => {
            const category = await manager.findOne(Category, {
                where: { id: dto.categoryId },
            });

            if (!category) {
                throw new NotFoundException('Category not found');
            }

            const log = manager.create(GenerationLog, {
                quantity: dto.quantity,
                seed: dto.seed,
                status: GenerationStatus.PENDING,
            });
            await manager.save(log);

            try {
                const rng = seedrandom(dto.seed ?? undefined);

                const agents = Array.from({ length: dto.quantity }).map((_, index) => {
                    const randomSuffix = Math.floor(rng() * 100000);
                    return manager.create(Agent, {
                        name: `Agent-${randomSuffix}-${index}`,
                        category,
                        generationLog: log,
                    });
                });

                await manager.save(agents);

                log.status = GenerationStatus.COMPLETED;
                log.completedAt = new Date();
                await manager.save(log);

                return {
                    generated: dto.quantity,
                    generationLogId: log.id,
                };
            } catch (error) {
                log.status = GenerationStatus.FAILED;
                log.errorMessage = error.message;
                await manager.save(log);
                throw error;
            }
        });
    }

    async findAll(query: QueryAgentsDto) {
        const { categoryId, status, name, limit, offset } = query

        const where = {
            ...(categoryId && { category: { id: categoryId } }),
            ...(status && { status }),
            ...(name && { name: Like(`%${name}%`) })
        }

        const [data, total] = await this.agentRepo.findAndCount({
            where,
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' }
        })

        return {
            data,
            total,
            limit,
            offset,
        };
    }

    async findOne(id: number) {
        const agent = await this.agentRepo.findOne({
            where: { id },
        });

        if (!agent) {
            throw new NotFoundException('Agent not found');
        }

        return agent;
    }


    async update(id: number, dto: UpdateAgentDto) {
        const agent = await this.agentRepo.findOneBy({ id });

        if (!agent) {
            throw new NotFoundException('Agent not found')
        }

        await this.agentRepo.update(id, dto)

        return {
            updated: true
        }
    }
}

