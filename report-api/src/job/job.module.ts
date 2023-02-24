import { Module } from '@nestjs/common';
import { GeneratePdf, JobService } from './job.service';
import { ReportModule } from '../report/report.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { BullModule } from '@nestjs/bullmq';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const imports: [] = [
  ReportModule,
  RedisModule.forRoot({
    config: {
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379,
    },
  }),
  BullModule.forRoot({
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379,
    },
  }),
  BullModule.registerQueue({
    name: 'report',
  }),
];

@Module({
  imports,
  providers: [JobService, GeneratePdf],
  exports: [JobService],
})
export class JobModule {}
