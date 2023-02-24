import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';
import { imports } from './job.module';

describe('JobService', () => {
  let service: JobService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [JobService],
      imports: imports,
    }).compile();

    service = app.get<JobService>(JobService);
  });

  describe('sendReportGenerationJobMessage', () => {
    it('should be successful', async () => {
      await service.sendReportGenerationJobMessage({
        periodStart: new Date('2023-01-01'),
        periodEnd: new Date('2023-01-03'),
        currency: 'BTC',
        candleInterval: 'day',
      });
    });
  });
});
