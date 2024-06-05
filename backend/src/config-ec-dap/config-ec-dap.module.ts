import { Module } from '@nestjs/common';
import { ConfigEcDapService } from './config-ec-dap.service';
import { ConfigEcDapController } from './config-ec-dap.controller';
import { ConfigEcDap } from './entities/config-ec-dap.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigEcDap])],
  controllers: [ConfigEcDapController],
  providers: [ConfigEcDapService],
  exports: [TypeOrmModule]
})
export class ConfigEcDapModule {}
