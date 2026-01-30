import { Type } from "class-transformer";
import { IsEnum, IsInt, isInt, IsOptional, IsString, Min } from "class-validator";
import { AgentStatus } from "../entities/agent.entity";

export class QueryAgentsDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categoryId?: number;

    @IsOptional()
    @IsEnum(AgentStatus)
    status?: AgentStatus;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset?: number; 

    @IsOptional()
    @Type(()=> Number)
    @IsInt()
    @Min(1)
    limit?: number;    
}