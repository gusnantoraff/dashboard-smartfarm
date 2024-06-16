import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, Query, HttpStatus } from '@nestjs/common';
import { TemplateService } from './template_controller.service';
import { Template } from './entities/template_controller.entity';
import { CreateTemplateDto } from './dto/create-template_controller.dto';
import { UpdateTemplateDto } from './dto/update-template_controller.dto';
import { PageDto } from 'src/dto/page.dto';
import { PageOptionsDto } from 'src/dto/page-options.dto';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  async createTemplate(@Body() createTemplateDto: CreateTemplateDto): Promise<Template> {
    return this.templateService.create(createTemplateDto);
  }

  @Get('all')
  async getAllTemplates(): Promise<Template[]> {
    return this.templateService.findAll();
  }

  @Get('all/:id')
  async getAllTemplateById(@Param('id') id: string): Promise<Template> {
    return this.templateService.findOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getTemplates(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Template>> {
    return this.templateService.getTemplate(pageOptionsDto);
  }

  @Get(':id')
  async getTemplateById(@Param('id') id: string): Promise<Template> {
    return this.templateService.findOne(id);
  }

  @Get('details/:id')
  async getTemplateDetails(@Param('id') id: string): Promise<any> {
    return this.templateService.getTemplateDetails(id);
  }

  @Put(':id')
  async updateTemplate(@Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateDto): Promise<Template> {
    return this.templateService.update(id, updateTemplateDto);
  }

  @Delete(':id')
  async deleteTemplate(@Param('id') id: string): Promise<void> {
    return this.templateService.remove(id);
  }
}
