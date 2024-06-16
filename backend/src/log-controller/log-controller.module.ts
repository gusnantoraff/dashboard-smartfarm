import { Module } from '@nestjs/common';
import { LogControllerService } from './log-controller.service';
import { LogControllerController } from './log-controller.controller';
import { LogController } from './entities/log-controller.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControllerModule } from 'src/controller/controller.module';
import { ControllerSessionModule } from 'src/controller-session/controller-session.module';
import { ConfigEcDapModule } from 'src/config-ec-dap/config-ec-dap.module';

@Module({
  imports: [TypeOrmModule.forFeature([LogController]), ControllerModule, ControllerSessionModule, ConfigEcDapModule],
  controllers: [LogControllerController],
  providers: [LogControllerService],
  exports: [TypeOrmModule]
})
export class LogControllerModule {}
