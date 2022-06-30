import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from 'src/scheduled/entitites/currency.entity';
import { Item } from 'src/scheduled/entitites/item.entity';
import { ScheduledModule } from 'src/scheduled/scheduled.module';
import { Zombie } from './zombie.entity';
import { ZombiesController } from './zombies.controller';
import { ZombiesService } from './zombies.service';
const zombie = {
  id: 1,
  name: 'test',
};
describe('ZombiesController', () => {
  const mockZombiesService = {
    create: jest.fn((dto) => {
      return {
        id: 1,
        ...dto,
      };
    }),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    findAll: jest.fn(() => [zombie]),
    findOne: jest.fn((id) => Object.assign(zombie, { id })),
    remove: jest.fn((id) => Object.assign(zombie, { id })),
    addItem: jest.fn((id, itemId) =>
      Object.assign(zombie, {
        id,
        items: [{ id: itemId, name: 'test', price: 0 }],
      }),
    ),
    removeItem: jest.fn((id, itemId) =>
      Object.assign(zombie, {
        id,
        items: [{ id: itemId + 1, name: 'test', price: 0 }],
      }),
    ),
  };
  let zombiesController: ZombiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZombiesController],
      providers: [
        {
          provide: ZombiesService,
          useValue: mockZombiesService,
        },
      ],
    }).compile();
    zombiesController = module.get<ZombiesController>(ZombiesController);
  });
  it('should create a zombie', () => {
    const dto = { name: 'test' };
    expect(zombiesController.create(dto)).toEqual({
      id: expect.any(Number),
      name: dto.name,
    });
    expect(mockZombiesService.create).toHaveBeenCalledWith(dto);
  });
  it('should update a zombie', () => {
    const dto = { name: 'test' };
    const id = 1;
    expect(zombiesController.update(id, dto)).toEqual({
      id,
      ...dto,
    });
    expect(mockZombiesService.update).toHaveBeenCalledWith(id, dto);
  });
  it('should find all zombies', () => {
    expect(zombiesController.findAll()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
      ]),
    );
  });
  it('should remove a zombies', () => {
    const id = 1;
    expect(zombiesController.remove(id)).toEqual(
      expect.objectContaining({
        id,
        name: expect.any(String),
      }),
    );
  });
  it('should add item to a zombies', () => {
    const id = 1;
    const addItemDto = {
      itemId: 2,
    };
    expect(zombiesController.removeItem(id, addItemDto)).toEqual(
      expect.objectContaining({
        id,
        name: expect.any(String),
        items: expect.not.arrayContaining([
          expect.objectContaining({ id: addItemDto.itemId }),
        ]),
      }),
    );
  });
});
