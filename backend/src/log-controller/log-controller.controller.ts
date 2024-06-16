import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { LogControllerService } from './log-controller.service';
import { CreateLogControllerDto } from './dto/create-log-controller.dto';
import { LogController } from './entities/log-controller.entity';

@Controller('log-controllers')
export class LogControllerController {
  constructor(private readonly logControllerService: LogControllerService) {}

  @Post()
  async create(@Body() createLogControllerDto: CreateLogControllerDto): Promise<LogController> {
    return this.logControllerService.create(createLogControllerDto);
  }

  @Get()
  async findAll(): Promise<LogController[]> {
    return this.logControllerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<LogController> {
    return this.logControllerService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLogControllerDto: CreateLogControllerDto): Promise<LogController> {
    return this.logControllerService.update(id, updateLogControllerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.logControllerService.remove(id);
  }

  @Delete()
  deleteAll(){
    return this.logControllerService.deleteAll();
  }
}
