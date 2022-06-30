import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
export class AddItemDto {
  @ApiProperty()
  @IsNumber()
  itemId: number;
}
