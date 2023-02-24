import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';
import { HttpStatus } from '@nestjs/common';
import { JobModule } from './job/job.module';

describe('AppController', () => {
  let controller: AppController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [ReportModule, JobModule],
    }).compile();

    controller = app.get<AppController>(AppController);
  });

  describe('POST report generation', () => {
    let resultStatus: number = null;
    let responseJson: unknown = null;

    const mockResponse: Response = {
      status: (s) => {
        resultStatus = s;
        return mockResponse;
      },
      send: (json) => (responseJson = json),
    } as unknown as Response;
    beforeAll(() => {
      resultStatus = null;
      responseJson = null;
    });

    it('should return uuid', async () => {
      const mockResponse: Response = {
        status: (s) => {
          resultStatus = s;
          return mockResponse;
        },
        send: (json) => (responseJson = json),
      } as unknown as Response;

      await controller.generateCryptoReport(mockResponse, {
        periodStart: '2023-01-01',
        periodEnd: '2023-01-03',
        currency: 'BTC',
        candleInterval: 'day',
      });

      expect(resultStatus).toBe(HttpStatus.OK);
      expect(responseJson).toHaveProperty('id');
    });
  });
});
