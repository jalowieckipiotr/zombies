import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Zombie } from '../zombies/zombie.entity';
import { In, Repository } from 'typeorm';
import { Currency } from './entitites/currency.entity';
import { Item } from './entitites/item.entity';

@Injectable()
export class ScheduledService {
  constructor(
    @InjectRepository(Item) private itemsRepo: Repository<Item>,
    @InjectRepository(Currency) private currenciesRepo: Repository<Currency>,
    @InjectRepository(Zombie) private zombiesRepo: Repository<Zombie>,
    private readonly httpService: HttpService,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async getItem() {
    const response = await firstValueFrom(
      this.httpService.get('https://zombie-items-api.herokuapp.com/api/items'),
    );
    if (response?.data?.items) {
      const itemsFetched = this.itemsRepo.create(response.data.items);
      const items = await this.itemsRepo.find();
      itemsFetched.forEach((i) => {
        const item = items.find((it) => it.id === i.id);
        if (item) {
          item.name = i.name;
          item.price = i.price;
          return;
        }
        items.push(this.itemsRepo.create(i));
      });
      return this.itemsRepo.save(items);
    }
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async getCurrencies() {
    const response = await firstValueFrom(
      this.httpService.get(
        'http://api.nbp.pl/api/exchangerates/tables/C/today/',
      ),
    );
    if (response?.data[0]?.rates) {
      const currFetched = this.currenciesRepo.create(response.data[0].rates);
      const curencies = await this.currenciesRepo.find();
      currFetched.forEach((c) => {
        const currency = curencies.find((cr) => cr.code === c.code);
        if (currency) {
          currency.currency = c.currency;
          currency.bid = c.bid;
          currency.ask = c.ask;
          return;
        }
        curencies.push(this.currenciesRepo.create(c));
      });
      this.recalculateAll();
      return this.currenciesRepo.save(curencies);
    }
  }
  private async recalculateAll() {
    const zombies = await this.zombiesRepo.find({ relations: { items: true } });
    for (const zombie of zombies) {
      this.recalculateValues(zombie);
    }
  }
  async recalculateValues(zombie: Zombie) {
    let curencies = await this.currenciesRepo.find({
      where: { code: In(['EUR', 'USD']) },
    });
    const askEUR = curencies?.find((cur) => cur.code === 'EUR')?.ask || 1;
    const askUSD = curencies?.find((cur) => cur.code === 'USD')?.ask || 1;
    zombie.itemsValuePLN = 0;
    zombie.itemsValueEUR = 0;
    zombie.itemsValueUSD = 0;
    for (const item of zombie.items) {
      zombie.itemsValuePLN += Math.round((item.price || 0) * 100) / 100;
      zombie.itemsValueEUR =
        Math.round((zombie.itemsValuePLN / askEUR) * 100) / 100;
      zombie.itemsValueUSD =
        Math.round((zombie.itemsValuePLN / askUSD) * 100) / 100;
    }
  }
}
