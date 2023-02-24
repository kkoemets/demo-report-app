import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { ReportService } from '../report/report.service';

export interface GenerateReportMessage {
  periodStart: Date;
  periodEnd: Date;
  currency: string;
  candleInterval: string;
}

interface JobRequest {
  id: string;
  data: GenerateReportMessage;
}

interface JobPayload {
  referenceId: string;
}

const jobRequestsKey: string = 'jobRequests';

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectQueue('report') private reportQueue: Queue,
  ) {}

  async sendReportGenerationJobMessage(
    data: GenerateReportMessage,
  ): Promise<string> {
    const jobName: string = 'report';
    this.logger.log(`Adding job ${jobName} to queue`);

    const id: string = uuidv4();

    await this.redis.hset(
      jobRequestsKey,
      id,
      JSON.stringify({ id, data } as JobRequest),
    );

    await this.reportQueue.add(jobName.toString(), {
      referenceId: id,
    } as JobPayload);

    this.logger.log(`Added ${jobName} to queue, id ${id}`);
    return id;
  }

  async getJobRequest(id: string): Promise<JobRequest | null> {
    const jobRequestString: string = await this.redis.hget(jobRequestsKey, id);
    if (!jobRequestString) {
      return null;
    }
    return JSON.parse(jobRequestString);
  }
}

@Processor('report')
export class GeneratePdf extends WorkerHost {
  private readonly logger = new Logger(GeneratePdf.name);
  constructor(
    private readonly reportService: ReportService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    const referenceId: string = job.data.referenceId;
    this.logger.log(`Processing job ${job.name}, processed id ${referenceId}`);

    const jobRequest: JobRequest = await this.getJobRequest(referenceId);
    this.logger.log(`Job request: ${JSON.stringify(jobRequest)}`);
    if (!jobRequest) {
      this.logger.error(`Job request for ${referenceId} not found`);
      return;
    }

    await this.reportService.generateCandlestickChartPdfReport(referenceId);

    await this.redis.hdel(jobRequestsKey, referenceId);

    this.logger.log('Job finished');
  }

  async getJobRequest(id: string): Promise<JobRequest | null> {
    const jobRequestString: string = await this.redis.hget(jobRequestsKey, id);
    if (!jobRequestString) {
      return null;
    }
    return JSON.parse(jobRequestString);
  }
}
