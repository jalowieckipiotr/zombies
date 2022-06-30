import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZombiesModule } from './zombies/zombies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zombie } from './zombies/zombie.entity';
import { APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { Item } from './scheduled/entitites/item.entity';
import { ScheduledModule } from './scheduled/scheduled.module';
import { Currency } from './scheduled/entitites/currency.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduledService } from './scheduled/scheduled.service';

@Module({
  imports: [
    ZombiesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [Zombie, Item, Currency],
        };
      },
    }),
    ScheduleModule.forRoot(),
    ScheduledModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(public scheduledService: ScheduledService) {}
}
