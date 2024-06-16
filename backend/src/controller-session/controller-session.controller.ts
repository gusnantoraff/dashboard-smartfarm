import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ControllerSessionService } from './controller-session.service';
import { CreateControllerSessionDto } from './dto/create-controller-session.dto';
import { UpdateControllerSessionDto } from './dto/update-controller-session.dto';

@Controller('controller-session')
export class ControllerSessionController {
  constructor(private readonly controllerSessionService: ControllerSessionService) {}

  @Get()
  async findAll() {
    return this.controllerSessionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.controllerSessionService.findOne(id);
  }

  @Post()
  async create(@Body() createControllerSessionDto: CreateControllerSessionDto) {
    return this.controllerSessionService.create(createControllerSessionDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateControllerSessionDto: UpdateControllerSessionDto) {
    return this.controllerSessionService.update(id, updateControllerSessionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.controllerSessionService.remove(id);
  }
}
