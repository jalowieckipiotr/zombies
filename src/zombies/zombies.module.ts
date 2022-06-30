import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from '../scheduled/entitites/currency.entity';
import { Item } from '../scheduled/entitites/item.entity';
import { ScheduledModule } from '../scheduled/scheduled.module';
import { Zombie } from './zombie.entity';
import { ZombiesController } from './zombies.controller';
import { ZombiesService } from './zombies.service';

@Module({
  imports: [
    ScheduledModule,
    TypeOrmModule.forFeature([Zombie, Item, Currency]),
  ],
  controllers: [ZombiesController],
  providers: [ZombiesService],
  exports: [ZombiesService],
})
export class ZombiesModule {}
