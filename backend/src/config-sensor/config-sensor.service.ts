import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigSensor } from './entities/config-sensor.entity';
import { CreateConfigSensorDto } from './dto/create-config-sensor.dto';
import { UpdateConfigSensorDto } from './dto/update-config-sensor.dto';

@Injectable()
export class ConfigSensorService {
  constructor(
    @InjectRepository(ConfigSensor)
    private readonly configSensorRepository: Repository<ConfigSensor>,
  ) {}

  async findAll(): Promise<ConfigSensor[]> {
    return this.configSensorRepository.find();
  }

  async findOne(id: string): Promise<ConfigSensor> {
    return this.configSensorRepository.findOne({ where: { config_sensor_id:id } });
  }

  async create(createConfigSensorDto: CreateConfigSensorDto): Promise<ConfigSensor> {
    const configSensor = this.configSensorRepository.create(createConfigSensorDto);
    return this.configSensorRepository.save(configSensor);
  }

  async update(id: string, updateConfigSensorDto: UpdateConfigSensorDto): Promise<ConfigSensor> {
    await this.configSensorRepository.update(id, updateConfigSensorDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.configSensorRepository.delete(id);
  }
}
