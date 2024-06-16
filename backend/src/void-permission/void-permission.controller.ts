import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VoidPermissionService } from './void-permission.service';
import { CreateVoidPermissionDto } from './dto/create-void-permission.dto';
import { UpdateVoidPermissionDto } from './dto/update-void-permission.dto';

@Controller('void-permission')
export class VoidPermissionController {
  constructor(private readonly voidPermissionService: VoidPermissionService) {}

  @Post()
  create(@Body() createVoidPermissionDto: CreateVoidPermissionDto) {
    return this.voidPermissionService.create(createVoidPermissionDto);
  }

  @Get()
  findAll() {
    return this.voidPermissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voidPermissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoidPermissionDto: UpdateVoidPermissionDto) {
    return this.voidPermissionService.update(+id, updateVoidPermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voidPermissionService.remove(+id);
  }
}
