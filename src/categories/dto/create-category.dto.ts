import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, maxLength } from "class-validator";

export class CreateCategoryDto {
 @IsString()
 @MaxLength(100)
 @ApiProperty({example: 'Productivity'})
 name: string

 @IsOptional()
 @IsString()
 @ApiProperty({example: 'Agents to boost productivity'})
 description?: string
}
