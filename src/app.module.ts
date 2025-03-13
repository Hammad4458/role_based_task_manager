import { Module } from '@nestjs/common';
import { EnvConfigModule } from './infrastructure/env-configuration/env-config.module';


@Module({
  imports: [EnvConfigModule],
  
})
export class AppModule {}
