import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfigSensorService } from './config-sensor.service';
import { CreateConfigSensorDto } from './dto/create-config-sensor.dto';
import { UpdateConfigSensorDto } from './dto/update-config-sensor.dto';

@Controller('config-sensor')
export class ConfigSensorController {
  constructor(private readonly configSensorService: ConfigSensorService) {}

  @Post()
  create(@Body() createConfigSensorDto: CreateConfigSensorDto) {
    return this.configSensorService.create(createConfigSensorDto);
  }

  @Get()
  findAll() {
    return this.configSensorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configSensorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfigSensorDto: UpdateConfigSensorDto) {
    return this.configSensorService.update(+id, updateConfigSensorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configSensorService.remove(+id);
  }
}
