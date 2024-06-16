import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ConfigSensorService } from './config-sensor.service';
import { CreateConfigSensorDto } from './dto/create-config-sensor.dto';
import { UpdateConfigSensorDto } from './dto/update-config-sensor.dto';

@Controller('config-sensor')
export class ConfigSensorController {
  constructor(private readonly configSensorService: ConfigSensorService) {}

  @Get()
  async findAll() {
    return this.configSensorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.configSensorService.findOne(id);
  }

  @Post()
  async create(@Body() createConfigSensorDto: CreateConfigSensorDto) {
    return this.configSensorService.create(createConfigSensorDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateConfigSensorDto: UpdateConfigSensorDto) {
    return this.configSensorService.update(id, updateConfigSensorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.configSensorService.remove(id);
  }
}
