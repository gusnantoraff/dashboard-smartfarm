import { Module } from '@nestjs/common';
import { ConfigSensorService } from './config-sensor.service';
import { ConfigSensorController } from './config-sensor.controller';
import { ConfigSensor } from './entities/config-sensor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigSensor])],
  controllers: [ConfigSensorController],
  providers: [ConfigSensorService],
  exports: [TypeOrmModule]
})
export class ConfigSensorModule {}
