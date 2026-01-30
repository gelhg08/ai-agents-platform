import { IsString } from 'class-validator';

export class UpdateAgentAttributeDto {
  @IsString()
  value: string;
}
