import { PartialType } from '@nestjs/mapped-types';
import { CreateControllerSessionDto } from './create-controller-session.dto';

export class UpdateControllerSessionDto extends PartialType(CreateControllerSessionDto) {}
