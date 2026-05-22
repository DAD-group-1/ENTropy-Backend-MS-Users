import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import winston from 'winston';
import { WinstonModule } from 'nest-winston';

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
        new winston.transports.Console({ format: winston.format.cli() }),
      ],
    }),
  });
  const configService = app.get(ConfigService);

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.TCP,
      options: {
        host: configService.get<string>('HOST', '0.0.0.0'),
        port: configService.get<number>('PORT', 3001),
      },
    });

  await microservice.listen();
  console.info(
    `User microservice is listening on ${configService.get('HOST')}:${configService.get('PORT')}`,
  );
}
bootstrap();
