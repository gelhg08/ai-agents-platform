import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsString } from 'class-validator';

export class GenerateAgentsDto {
  @IsInt()
  @Min(1)
  @ApiProperty({example: '5'})
  quantity: number;

  @IsInt()
  @ApiProperty({example: '1'})
  categoryId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({example: 'seed-123'})
  seed?: string;
}
