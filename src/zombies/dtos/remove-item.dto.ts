import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
export class RemoveItemDto {
  @ApiProperty()
  @IsNumber()
  itemId: number;
}
