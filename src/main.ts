import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  console.log(
    `Microservice listening on ${configService.get('HOST')}:${configService.get('PORT')}`,
  );
}
bootstrap();
