import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {createDatabaseModule} from "@dad-group-1/backend-common";

@Module({
  imports: [
      createDatabaseModule(),
  ],
})
export class DatabaseModule {}
