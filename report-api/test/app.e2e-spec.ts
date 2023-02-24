import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/crypto/report', () => {
    it('should return 200 with id', async () => {
      const response: request.Response = await request(app.getHttpServer())
        .post('/api/v1/crypto/report')
        .send({
          periodStart: '2023-01-01',
          periodEnd: '2023-01-03',
          currency: 'BTC',
          candleInterval: 'day',
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
    });
  });

  describe('GET /api/v1/crypto/report/:id/status', () => {
    it('should return 200 with status: unknown if random unknown id', async () => {
      const response: request.Response = await request(app.getHttpServer())
        .get('/api/v1/crypto/report/some-random-id/status')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('unknown');
    });

    it('should return report status after request to generate report had been sent', async () => {
      const initResponse: request.Response = await request(app.getHttpServer())
        .post('/api/v1/crypto/report')
        .send({
          periodStart: '2023-01-01',
          periodEnd: '2023-01-03',
          currency: 'BTC',
          candleInterval: 'day',
        })
        .expect(200);

      const { id } = initResponse.body;

      const reportStatusResponse: request.Response = await request(
        app.getHttpServer(),
      )
        .get(`/api/v1/crypto/report/${id}/status`)
        .expect(200);

      expect(reportStatusResponse.body).toHaveProperty('status');
      expect(reportStatusResponse.body.status).toBe('pending');
    });
  });

  describe('GET /api/v1/crypto/report/:id', () => {
    it('should return 404 if id is not queued or ready', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/crypto/report/some-random-id')
        .expect(404);
    });
  });
});
