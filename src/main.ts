import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { createWinstonLogger } from '@dad-group-1/backend-common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createWinstonLogger('user-service', 'info'),
  });
  const configService = app.get(ConfigService);

  const microserviceHost = configService.get<string>('HOST', '0.0.0.0');
  const microservicePort = configService.get<number>('PORT', 3001);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: microserviceHost,
      port: microservicePort,
    },
  });

  await app.startAllMicroservices();
  await app.init(); // Initialize the app without starting the HTTP server

  console.info(
    `User microservice is listening on ${microserviceHost}:${microservicePort}`,
  );
}
bootstrap();
