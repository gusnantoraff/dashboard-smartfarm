import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigEcDapDto } from './create-config-ec-dap.dto';

export class UpdateConfigEcDapDto extends PartialType(CreateConfigEcDapDto) {}
