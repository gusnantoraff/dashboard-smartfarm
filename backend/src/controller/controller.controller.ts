import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, Query, HttpStatus } from '@nestjs/common';
import { ControllerService } from './controller.service';
import { Controller as ControllerEntity } from './entities/controller.entity';
import { CreateControllerDto } from './dto/create-controller.dto';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageDto } from 'src/dto/page.dto';

@Controller('controllers')
export class ControllerController {
  constructor(
    private readonly controllerService: ControllerService
  ) {}

  @Post()
  create(@Body() createControllerDto: CreateControllerDto) {
    return this.controllerService.create(createControllerDto);
  }

  @Get('all')
  findAll() {
    return this.controllerService.findAll();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getControllers(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ControllerEntity>> {
    return this.controllerService.getController(pageOptionsDto);
  }

  @Get(':id')
  async getDetailController(@Param('id') id: string): Promise<any> {
    return this.controllerService.getDetailController(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<ControllerEntity>) {
    return this.controllerService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.controllerService.remove(id);
  }
  
  @Delete()
  deleteAll(){
    return this.controllerService.deleteAll();
  }
}
