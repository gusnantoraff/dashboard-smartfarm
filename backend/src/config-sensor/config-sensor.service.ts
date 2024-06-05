import { Injectable } from '@nestjs/common';
import { CreateConfigSensorDto } from './dto/create-config-sensor.dto';
import { UpdateConfigSensorDto } from './dto/update-config-sensor.dto';

@Injectable()
export class ConfigSensorService {
  create(createConfigSensorDto: CreateConfigSensorDto) {
    return 'This action adds a new configSensor';
  }

  findAll() {
    return `This action returns all configSensor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} configSensor`;
  }

  update(id: number, updateConfigSensorDto: UpdateConfigSensorDto) {
    return `This action updates a #${id} configSensor`;
  }

  remove(id: number) {
    return `This action removes a #${id} configSensor`;
  }
}
