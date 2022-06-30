import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Zombie } from './zombie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateZombieDto } from './dtos/create-zombie.dto';
import { UpdateZombieDto } from './dtos/update-zombie.dto';
import { Item } from '../scheduled/entitites/item.entity';
import { ScheduledService } from '../scheduled/scheduled.service';

@Injectable()
export class ZombiesService {
  constructor(
    @InjectRepository(Zombie) private repo: Repository<Zombie>,
    @InjectRepository(Item) private itemRepo: Repository<Item>,
    private scheduledService: ScheduledService,
  ) {}
  create(body: CreateZombieDto) {
    const zombie = this.repo.create({
      name: body.name,
    });
    return this.repo.save(zombie);
  }
  findAll() {
    return this.repo.find({
      relations: {
        items: true,
      },
    });
  }
  async findOne(id: number) {
    const zombie = await this.repo.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!zombie) {
      throw new NotFoundException('Zombie not found');
    }
    return zombie;
  }
  async update(id: number, body: UpdateZombieDto) {
    const zombie = await this.repo.findOne({
      where: { id },
    });
    if (!zombie) {
      throw new NotFoundException('Zombie not found');
    }
    zombie.name = body.name;
    return this.repo.save(zombie);
  }
  async addItem(id: number, itemId: number) {
    const zombie = await this.findOne(id);
    const item = await this.itemRepo.findOneBy({ id: itemId });

    if (!item) {
      throw new NotFoundException('Item not found');
    }
    if (zombie.items && zombie.items.length > 4) {
      throw new ForbiddenException('Zombie can have max 5 items');
    }
    if (zombie.items.find((i) => i.id === itemId)) {
      throw new ForbiddenException('Zombie already have this item!');
    }
    zombie.items.push(item);
    this.scheduledService.recalculateValues(zombie);
    return this.repo.save(zombie);
  }
  async removeItem(id: number, itemId: number) {
    const zombie = await this.findOne(id);
    const itemIdx = zombie.items.findIndex((item) => item.id === itemId);
    if (itemIdx < 0) {
      throw new NotFoundException('Item not found');
    }
    zombie.items.splice(itemIdx, 1);
    this.scheduledService.recalculateValues(zombie);
    return this.repo.save(zombie);
  }
  async remove(id: number) {
    const zombie = await this.findOne(id);
    if (!zombie) {
      throw new NotFoundException('Zombie not found');
    }
    return this.repo.remove(zombie);
  }
}
