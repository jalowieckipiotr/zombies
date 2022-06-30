import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { Zombie } from 'src/zombies/zombie.entity';
import { Currency } from './entitites/currency.entity';
import { Item } from './entitites/item.entity';
import { ScheduledService } from './scheduled.service';
const zombies = [
  {
    id: 1,
    name: 'test',
    valuePLN: 0,
    valueUSD: 0,
    valueEUR: 0,
    items: [
      {
        id: 1,
        name: 'test',
        price: 0,
      },
    ],
  },
];

describe('ItemsService', () => {
  let service: ScheduledService;
  const mockZombiesRepository = {
    find: jest.fn(() => Promise.resolve(zombies)),
  };
  const mockCurrenciesRepository = {
    create: jest.fn((currencies) => currencies),
    find: jest.fn(() => Promise.resolve([])),
    save: jest.fn((currencies) => Promise.resolve(currencies)),
  };
  const mockItemsRepository = {
    create: jest.fn((items) => items),
    find: jest.fn(() => Promise.resolve([])),
    save: jest.fn((items) => Promise.resolve(items)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.registerAsync({
          useFactory: async () => ({
            timeout: 5000,
            maxRedirects: 5,
          }),
        }),
      ],
      providers: [
        ScheduledService,
        {
          provide: getRepositoryToken(Zombie),
          useValue: mockZombiesRepository,
        },
        {
          provide: getRepositoryToken(Item),
          useValue: mockItemsRepository,
        },
        {
          provide: getRepositoryToken(Currency),
          useValue: mockCurrenciesRepository,
        },
      ],
    }).compile();

    service = module.get<ScheduledService>(ScheduledService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('test getting items', async () => {
    expect(await service.getItem()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(Number),
        }),
      ]),
    );
  });
  it('test getting currencies', async () => {
    expect(await service.getCurrencies()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: expect.any(String),
          currency: expect.any(String),
          bid: expect.any(Number),
          ask: expect.any(Number),
        }),
      ]),
    );
  });
});
