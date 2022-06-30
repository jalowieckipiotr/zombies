import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from 'src/scheduled/entitites/item.entity';
import { ScheduledService } from 'src/scheduled/scheduled.service';
import { Zombie } from './zombie.entity';
import { ZombiesService } from './zombies.service';
const zombie = {
  name: 'test',
  items: [
    {
      id: 1,
      name: 'test',
      price: 0,
    },
  ],
};

describe('ZombiesService', () => {
  let service: ZombiesService;
  const mockZombiesRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn((user) => Promise.resolve({ id: 1, ...user })),
    findOne: jest.fn(({ where: id }) => ({
      id: id && id.id,
      ...zombie,
    })),
    remove: jest.fn((zombie) => zombie),
  };
  const mockItemRepository = {
    findOneBy: jest.fn((param: { id }) => ({
      id: param.id,
      name: 'test',
      price: 0,
    })),
  };
  const mockScheduledService = {
    recalculateValues: jest.fn((zombie) => zombie),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZombiesService,
        {
          provide: getRepositoryToken(Zombie),
          useValue: mockZombiesRepository,
        },
        {
          provide: getRepositoryToken(Item),
          useValue: mockItemRepository,
        },
        {
          provide: ScheduledService,
          useValue: mockScheduledService,
        },
      ],
    }).compile();

    service = module.get<ZombiesService>(ZombiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a zombie', async () => {
    const dto = { name: 'test' };
    expect(await service.create(dto)).toEqual({
      id: expect.any(Number),
      name: dto.name,
    });
  });
  it('should find a zombie', async () => {
    const id = 1;
    expect(await service.findOne(id)).toEqual(
      expect.objectContaining({
        id,
        name: expect.any(String),
      }),
    );
  });
  it('should update a zombie', async () => {
    const id = 1;
    const dto = { name: 'test1' };
    expect(await service.update(id, dto)).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        ...dto,
      }),
    );
  });

  it('should remove a zombie', async () => {
    const id = 1;
    const dto = { name: 'test' };
    expect(await service.remove(id)).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        ...dto,
      }),
    );
  });
  it('should add an item to zombie', async () => {
    const id = 1;
    const itemId = 2;
    expect(await service.addItem(id, itemId)).toEqual(
      expect.objectContaining({
        id,
        name: expect.any(String),
        items: expect.arrayContaining([
          expect.objectContaining({ id: itemId }),
        ]),
      }),
    );
  });
  it('should throw an error when adding existing item', async () => {
    const id = 1;
    const itemId = 1;
    await expect(service.addItem(id, itemId)).rejects.toThrow(
      ForbiddenException,
    );
  });
  it('should throw an error when length of items to big', async () => {
    const id = 1;
    const itemId = 2;
    zombie.items.length = 5;
    await expect(service.addItem(id, itemId)).rejects.toThrow(
      ForbiddenException,
    );
  });
  it('should throw an error when adding item which is not in dictionary', async () => {
    const id = 1;
    const itemId = 2;
    mockItemRepository.findOneBy = jest.fn((param: { id }) => null);
    await expect(service.addItem(id, itemId)).rejects.toThrow(
      NotFoundException,
    );
  });
  it('should remove an item from zombie', async () => {
    const id = 1;
    const itemId = 1;
    expect(await service.removeItem(id, itemId)).toEqual(
      expect.objectContaining({
        id,
        name: expect.any(String),
        items: expect.arrayContaining([
          expect.not.objectContaining({ id: itemId }),
        ]),
      }),
    );
  });
  it('should throw an error when adding item which is not in dictionary', async () => {
    const id = 1;
    const itemId = 23;
    mockItemRepository.findOneBy = jest.fn((param: { id }) => null);
    await expect(service.addItem(id, itemId)).rejects.toThrow(
      NotFoundException,
    );
  });
  it('should throw an error when zombie not found', async () => {
    const id = 1;
    const dto = { name: 'test1' };
    mockZombiesRepository.findOne = jest.fn(({ where: id }) => null);
    expect(service.update(id, dto)).rejects.toThrow(NotFoundException);
  });
  it('should throw an error when zombie not found', async () => {
    const id = 1;
    await expect(service.remove(id)).rejects.toThrow(NotFoundException);
  });
});
