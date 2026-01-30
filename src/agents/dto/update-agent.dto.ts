import { IsOptional, IsEnum, IsString } from 'class-validator';
import { AgentStatus } from '../entities/agent.entity';

export class UpdateAgentDto {
  @IsOptional()
  @IsEnum(AgentStatus)
  status?: AgentStatus;

  @IsOptional()
  @IsString()
  name?: string;
}
