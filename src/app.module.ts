import { Module } from '@nestjs/common';
import { EnvConfigModule } from './infrastructure/env-configuration/env-config.module';
import { ControllerModule } from './infrastructure/presentation/controller.module';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [EnvConfigModule,ControllerModule,PassportModule],
})
export class AppModule {}
