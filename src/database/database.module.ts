import { Module } from '@nestjs/common';
import { createDatabaseModule } from '@dad-group-1/backend-common';

@Module({
  imports: [createDatabaseModule()],
})
export class DatabaseModule {}
