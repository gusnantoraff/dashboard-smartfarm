import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ManagementControllerService } from './management-controller.service';
import { CreateManagementControllerDto } from './dto/create-management-controller.dto';
import { UpdateManagementControllerDto } from './dto/update-management-controller.dto';

@Controller('management-controller')
export class ManagementControllerController {
  constructor(private readonly managementControllerService: ManagementControllerService) {}

  @Post()
  create(@Body() createManagementControllerDto: CreateManagementControllerDto) {
    return this.managementControllerService.create(createManagementControllerDto);
  }

  @Get()
  findAll() {
    return this.managementControllerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managementControllerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateManagementControllerDto: UpdateManagementControllerDto) {
    return this.managementControllerService.update(+id, updateManagementControllerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.managementControllerService.remove(+id);
  }
}
