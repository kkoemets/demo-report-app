import { Module } from '@nestjs/common';

import { ReportService } from './report.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
