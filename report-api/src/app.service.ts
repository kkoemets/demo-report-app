import { Injectable, Logger } from '@nestjs/common';
import { ReportService } from './report/report.service';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { IsBefore, IsValidDate } from './validation';
import { GenerateReportMessage, JobService } from './job/job.service';

export class InitiateReportGenerationJson {
  @IsNotEmpty()
  @IsBefore('periodEnd')
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsValidDate()
  readonly periodStart: string;
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsValidDate()
  readonly periodEnd: string;
  @IsString()
  @IsNotEmpty()
  @Matches(/^(ETH|BTC|AVAX)$/i)
  readonly currency: string;
  @IsNotEmpty()
  @Matches(/^(week|day|hour|month)$/)
  readonly candleInterval: string;
}

export interface ReportGenerationStatus {
  status: 'pending' | 'completed' | 'unknown';
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private reportService: ReportService,
    private jobService: JobService,
  ) {}

  async initializeReportGeneration(
    json: InitiateReportGenerationJson,
  ): Promise<string> {
    this.logger.log('Initializing chart generation');

    return await this.jobService.sendReportGenerationJobMessage({
      periodStart: new Date(json.periodStart),
      periodEnd: new Date(json.periodEnd),
      currency: json.currency,
      candleInterval: json.candleInterval,
    } as GenerateReportMessage);
  }

  async getReportStatus(id: string): Promise<ReportGenerationStatus> {
    this.logger.log(`Getting status of report ${id}`);

    if (await this.jobService.getJobRequest(id)) {
      return {
        status: 'pending',
      };
    }

    if (await this.reportService.getReport(id)) {
      return {
        status: 'completed',
      };
    }

    return { status: 'unknown' };
  }

  async getReport(id: string): Promise<string> {
    this.logger.log(`Getting report ${id}`);
    return await this.reportService.getReport(id);
  }
}
