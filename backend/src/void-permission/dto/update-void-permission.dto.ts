import { PartialType } from '@nestjs/swagger';
import { CreateVoidPermissionDto } from './create-void-permission.dto';

export class UpdateVoidPermissionDto extends PartialType(CreateVoidPermissionDto) {}
