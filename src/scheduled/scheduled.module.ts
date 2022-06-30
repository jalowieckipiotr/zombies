import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zombie } from '../zombies/zombie.entity';
import { Currency } from './entitites/currency.entity';
import { Item } from './entitites/item.entity';
import { ScheduledService } from './scheduled.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, Currency, Zombie]),
    HttpModule.registerAsync({
      useFactory: async () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [ScheduledService],
  exports: [ScheduledService],
})
export class ScheduledModule {}
