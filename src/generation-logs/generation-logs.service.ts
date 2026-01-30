import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GenerationLog, GenerationStatus } from "./entities/generation-log.entity";

@Injectable()
export class GenerationLogsService {
  constructor(
    @InjectRepository(GenerationLog)
    private readonly repo: Repository<GenerationLog>,
  ) {}

  findAll(status?: GenerationStatus) {
    return this.repo.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
    });
  }
}

