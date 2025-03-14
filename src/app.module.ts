import { Module } from '@nestjs/common';
import { EnvConfigModule } from './infrastructure/env-configuration/env-config.module';
import { ControllerModule } from './infrastructure/presentation/controller.module';


@Module({
  imports: [EnvConfigModule,ControllerModule],
})
export class AppModule {}
