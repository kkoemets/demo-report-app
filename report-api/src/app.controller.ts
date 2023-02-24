import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  AppService,
  InitiateReportGenerationJson,
  ReportGenerationStatus,
} from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Post('/api/v1/crypto/report')
  @UsePipes(new ValidationPipe())
  async generateCryptoReport(
    @Res() res,
    @Body() json: InitiateReportGenerationJson,
  ): Promise<void> {
    this.logger.log('Received request to generate PDF');

    const id: string = await this.appService.initializeReportGeneration(json);
    res.status(HttpStatus.OK).send({ id });
  }

  @Get('/api/v1/crypto/report/:id/status')
  async getReportStatus(@Res() res, @Req() req): Promise<void> {
    const id: string = req.params.id;
    this.logger.log(`Received request to get status of report ${id}`);

    const status: ReportGenerationStatus =
      await this.appService.getReportStatus(id);
    res.status(HttpStatus.OK).send({ status: status.status });
  }

  @Get('/api/v1/crypto/report/:id')
  async getReport(@Res() res, @Req() req): Promise<void> {
    const id: string = req.params.id;
    this.logger.log(`Received request to get report ${id}`);

    const pdf: string = await this.appService.getReport(id);

    if (!pdf) {
      res.status(HttpStatus.NOT_FOUND).send({ error: 'Report not found' });
      return;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

    res.send(Buffer.from(pdf, 'base64'));
  }
}
