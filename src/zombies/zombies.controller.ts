import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AddItemDto } from './dtos/add-item.dto';
import { CreateZombieDto } from './dtos/create-zombie.dto';
import { RemoveItemDto } from './dtos/remove-item.dto';
import { UpdateZombieDto } from './dtos/update-zombie.dto';
import { ZombiesService } from './zombies.service';

@Controller('zombies')
export class ZombiesController {
  constructor(private zombiesService: ZombiesService) {}
  @Post()
  create(@Body() body: CreateZombieDto) {
    return this.zombiesService.create(body);
  }
  @Get()
  findAll() {
    return this.zombiesService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.zombiesService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() body: UpdateZombieDto) {
    return this.zombiesService.update(id, body);
  }
  @Post(':id/item')
  addItem(@Param('id') id: number, @Body() body: AddItemDto) {
    return this.zombiesService.addItem(id, body.itemId);
  }
  @Delete(':id/item')
  removeItem(@Param('id') id: number, @Body() body: RemoveItemDto) {
    return this.zombiesService.removeItem(id, body.itemId);
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.zombiesService.remove(id);
  }
}
