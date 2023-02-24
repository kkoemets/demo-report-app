import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';
import { JobModule } from './job/job.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ReportModule, JobModule],
})
export class AppModule {}
