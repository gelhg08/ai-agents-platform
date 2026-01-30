import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, IsString, IsDefined } from 'class-validator';

export class GenerateAgentsDto {
  @Type(() => Number)
  @IsDefined()
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 5 })
  quantity: number;

  @Type(() => Number)
  @IsDefined()
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1 })
  categoryId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'seed-123', required: false })
  seed?: string;
}
