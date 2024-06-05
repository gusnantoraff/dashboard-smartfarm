import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfigEcDapService } from './config-ec-dap.service';
import { CreateConfigEcDapDto } from './dto/create-config-ec-dap.dto';
import { UpdateConfigEcDapDto } from './dto/update-config-ec-dap.dto';

@Controller('config-ec-dap')
export class ConfigEcDapController {
  constructor(private readonly configEcDapService: ConfigEcDapService) {}

  @Post()
  create(@Body() createConfigEcDapDto: CreateConfigEcDapDto) {
    return this.configEcDapService.create(createConfigEcDapDto);
  }

  @Get()
  findAll() {
    return this.configEcDapService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configEcDapService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfigEcDapDto: UpdateConfigEcDapDto) {
    return this.configEcDapService.update(+id, updateConfigEcDapDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configEcDapService.remove(+id);
  }
}
