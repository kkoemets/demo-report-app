import { DynamicModule, Module, Type } from '@nestjs/common';
import { GeneratePdf, JobService, reportJobName } from './job.service';
import { ReportModule } from '../report/report.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { BullModule } from '@nestjs/bullmq';

export const imports: (Type | DynamicModule)[] = [
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
    name: reportJobName,
  }),
];

@Module({
  imports,
  providers: [JobService, GeneratePdf],
  exports: [JobService],
})
export class JobModule {}
