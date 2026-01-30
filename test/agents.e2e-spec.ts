import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Agents (e2e)', () => {
  let app: INestApplication;
  let categoryId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    // 1️⃣ Intentamos crear la categoría
    const createResponse = await request(app.getHttpServer())
      .post('/categories')
      .send({
        name: 'Test Category',
        description: 'Category for e2e tests',
      });

    // 2️⃣ Si ya existe, la buscamos
    if (createResponse.status === 409) {
      const listResponse = await request(app.getHttpServer())
        .get('/categories')
        .query({ name: 'Test Category', limit: 1, offset: 0 });

      categoryId = listResponse.body.data[0].id;
    } else {
      categoryId = createResponse.body.id;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /agents/generate should generate agents', async () => {
    const response = await request(app.getHttpServer())
      .post('/agents/generate')
      .send({
        categoryId,
        quantity: 2,
        seed: 'test-seed',
      })
      .expect(201);

    expect(response.body).toHaveProperty('generated', 2);
    expect(response.body).toHaveProperty('generationLogId');
  });

  it('GET /agents should return paginated agents', async () => {
    const response = await request(app.getHttpServer())
      .get('/agents')
      .query({ limit: 5, offset: 0 })
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('total');
  });
});
