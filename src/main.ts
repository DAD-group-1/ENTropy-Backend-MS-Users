import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import winston from 'winston';
import { WinstonModule } from 'nest-winston';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: 'user-service' },
      transports: [
        //
        // - Write all logs with importance level of `error` or higher to `error.log`
        //   (i.e., error, fatal, but not other levels)
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        //
        // - Write all logs with importance level of `info` or higher to `combined.log`
        //   (i.e., fatal, error, warn, and info, but not trace)
        //
        new winston.transports.File({ filename: 'combined.log' }),

        //
        // - Write all logs to the console as well
        //
        ...(process.env.ENVIRONMENT == 'DEV' ? [new winston.transports.Console({ format: winston.format.cli() })] : []),
      ],
    }),
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
