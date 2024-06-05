import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ControllerSessionService } from './controller-session.service';
import { CreateControllerSessionDto } from './dto/create-controller-session.dto';
import { UpdateControllerSessionDto } from './dto/update-controller-session.dto';

@Controller('controller-session')
export class ControllerSessionController {
  constructor(private readonly controllerSessionService: ControllerSessionService) {}

  @Post()
  create(@Body() createControllerSessionDto: CreateControllerSessionDto) {
    return this.controllerSessionService.create(createControllerSessionDto);
  }

  @Get()
  findAll() {
    return this.controllerSessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.controllerSessionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateControllerSessionDto: UpdateControllerSessionDto) {
    return this.controllerSessionService.update(+id, updateControllerSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.controllerSessionService.remove(+id);
  }
}
