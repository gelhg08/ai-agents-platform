import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentAttributeDto {
  @ApiProperty({ example: 'language' })
  @IsString()
  key: string;

  @ApiProperty({ example: 'Spanish' })
  @IsString()
  value: string;
}
