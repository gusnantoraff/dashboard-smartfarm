import { PartialType } from '@nestjs/mapped-types';
import { CreateTemplateDto } from './create-template_controller.dto';

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {}
