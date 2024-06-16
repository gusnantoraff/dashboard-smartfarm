import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ConfigEcDapService } from './config-ec-dap.service';
import { CreateConfigEcDapDto} from './dto/create-config-ec-dap.dto';
import { UpdateConfigEcDapDto } from './dto/update-config-ec-dap.dto';

@Controller('config-ec-dap')
export class ConfigEcDapController {
  constructor(private readonly configEcDapService: ConfigEcDapService) {}

  @Get()
  async findAll() {
    return this.configEcDapService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.configEcDapService.findOne(id);
  }

  @Post()
  async create(@Body() createConfigEcDapDto: CreateConfigEcDapDto) {
    return this.configEcDapService.create(createConfigEcDapDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateConfigEcDapDto: UpdateConfigEcDapDto) {
    return this.configEcDapService.update(id, updateConfigEcDapDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.configEcDapService.remove(id);
  }

  @Delete()
  deleteAll(){
    return this.configEcDapService.deleteAll();
  }
}
