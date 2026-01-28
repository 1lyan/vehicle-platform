import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as client from 'prom-client';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Prometheus metrics
  client.collectDefaultMetrics();
  const server = app.getHttpAdapter().getInstance();
  server.get('/metrics', async (_req: any, res: any) => {
    try {
      res.set('Content-Type', client.register.contentType);
      res.send(await client.register.metrics());
    } catch (err) {
      res.status(500).send((err && err.message) || String(err));
    }
  });

  await app.listen(3000);
  logger.log('Vehicle Service is running on port 3000');
}
bootstrap();