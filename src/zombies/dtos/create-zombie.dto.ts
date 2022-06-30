import { ApiProperty } from '@nestjs/swagger';
import {IsString } from 'class-validator';
export class CreateZombieDto {
  @ApiProperty()
  @IsString()
  name: string;
}
