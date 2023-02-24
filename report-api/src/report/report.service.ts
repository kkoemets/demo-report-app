import { Injectable, Logger } from '@nestjs/common';

import * as PDFDocument from 'pdfkit';
import * as util from 'util';
import * as exportServer from 'highcharts-export-server';
import * as getStream from 'get-stream';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

const exportChart: (data: unknown) => { data: string } = util.promisify(
  exportServer.export.bind(exportServer),
);
process.env.OPENSSL_CONF = '/dev/null';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);
  private readonly generatedPdfsKey = 'generatedPdfs';

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async generateCandlestickChartPdfReport(referenceId): Promise<void> {
    this.logger.log('Generating candlestick chart PDF report');
    const doc: PDFDocument = new PDFDocument();
    await generateChart(doc);

    doc.end();

    const buffer: Buffer = await getStream.buffer(doc);
    await this.redis.hset(
      this.generatedPdfsKey,
      referenceId,
      (await buffer).toString('base64'),
    );
  }

  async getReport(id: string): Promise<string | null> {
    return this.redis.hget(this.generatedPdfsKey, id);
  }
}

const generateChart: (doc) => Promise<void> = async (doc) => {
  const chartConfig: unknown = {
    chart: {
      type: 'candlestick',
    },
    title: {
      text: 'Bitcoin Price',
    },
    subtitle: {
      text: 'Source: crypto data provider',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: 'Price (USD)',
      },
    },
    plotOptions: {
      candlestick: {
        color: 'red',
        upColor: 'green',
      },
    },
    series: [
      {
        name: 'BTC',
        type: 'candlestick',
        data: [
          [1538908800000, 6587.63, 6624.94, 6528.75, 6594.98],
          [1538995200000, 6587.63, 6624.94, 6528.75, 6594.98],
          [1539081600000, 6617.51, 6644.99, 6528.75, 6573.12],
          [1539168000000, 6557.11, 6563.89, 6488.52, 6502.35],
          [1539254400000, 6497.51, 6541.22, 6461.8, 6493.96],
          [1539340800000, 6483.45, 6533.48, 6468.8, 6517.19],
          [1539427200000, 6520.0, 6520.0, 6448.0, 6466.52],
          [1539513600000, 6463.6, 6486.2, 6448.0, 6482.63],
          [1539600000000, 6490.16, 6504.99, 6448.0, 6467.83],
          [1539686400000, 6482.69, 6540.0, 6448.0, 6493.28],
          [1539772800000, 6484.99, 6544.4, 6448.0, 6529.16],
          [1539859200000, 6506.99, 6520.0, 6448.0, 6469.1],
          [1539945600000, 6471.99, 6480.0, 6448.0, 6469.68],
          [1540032000000, 6463.99, 6463.99, 6448.0, 6455.54],
          [1540118400000, 6463.99, 6463.99, 6448.0, 6455.54],
          [1540204800000, 6463.99, 6463.99, 6448.0, 6455.54],
        ],
      },
    ],
  };

  // Set up the export server
  await exportServer.initPool();

  const res: { data: string } = await exportChart({
    type: 'png',
    options: chartConfig,
    width: 500,
  });

  const imageb64: string = res.data;

  doc.image(Buffer.from(imageb64, 'base64'));

  exportServer.killPool();
};
