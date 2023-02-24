import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const logger: Logger = new Logger('bootstrap');

  const app: INestApplication = await NestFactory.create(AppModule);
  await app.listen(3000);
  logger.log(
    `Application listening on port ${(await app.getUrl()).split(':').pop()}`,
  );
}

bootstrap();
