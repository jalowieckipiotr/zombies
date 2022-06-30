import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ScheduledService } from './../src/scheduled/scheduled.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let scheduledService: ScheduledService;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    scheduledService = moduleFixture.get<ScheduledService>(ScheduledService);
  });

  it('gets cureencies', async () => {
    return expect(await scheduledService.getCurrencies()).toEqual(
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
  it('gets items', async () => {
    return expect(await scheduledService.getItem()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(Number),
        }),
      ]),
    );
  });
  let idSet: number;
  it('handles a create zombie request', () => {
    const nameProvided = 'Krzysztof';
    return request(app.getHttpServer())
      .post('/zombies')
      .send({
        name: nameProvided,
      })
      .expect(201)
      .then((res) => {
        const { id, name } = res.body;
        idSet = id;
        expect(id).toBeDefined();
        expect(name).toEqual(nameProvided);
      });
  });
  it('updates a created zombie', async () => {
    const nameProvided = 'Krzysztof2';
    return request(app.getHttpServer())
      .patch(`/zombies/${idSet}`)
      .send({
        name: nameProvided,
      })
      .expect(200)
      .then((res) => {
        const { id, name } = res.body;
        expect(id).toBeDefined();
        expect(name).toEqual(nameProvided);
      });
  });
  const itemId = 1;
  it('adds item to a zombie', async () => {
    return request(app.getHttpServer())
      .post(`/zombies/${idSet}/item`)
      .send({
        itemId,
      })
      .expect(201)
      .then((res) => {
        const { id, items } = res.body;
        expect(id).toBeDefined();
        expect(items).toEqual(
          expect.arrayContaining([expect.objectContaining({ id: itemId })]),
        );
      });
  });
  it('removes item from a zombie', async () => {
    return request(app.getHttpServer())
      .delete(`/zombies/${idSet}/item`)
      .send({
        itemId,
      })
      .expect(200)
      .then((res) => {
        const { id, items } = res.body;
        expect(id).toBeDefined();
        expect(items).toEqual(
          expect.not.arrayContaining([expect.objectContaining({ id: itemId })]),
        );
      });
  });

  it('deletes a created zombie', async () => {
    return request(app.getHttpServer()).delete(`/zombies/${idSet}`).expect(200);
  });
});
