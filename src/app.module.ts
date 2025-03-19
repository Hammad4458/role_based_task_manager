import { Module } from '@nestjs/common';
import { EnvConfigModule } from './infrastructure/env-configuration/env-config.module';
import { ControllerModule } from './infrastructure/presentation/controller.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [EnvConfigModule,ControllerModule,JwtModule],
})
export class AppModule {}
