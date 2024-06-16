import { PartialType } from '@nestjs/swagger';
import { CreateLogControllerDto } from './create-log-controller.dto';

export class UpdateLogControllerDto extends PartialType(CreateLogControllerDto) {}
