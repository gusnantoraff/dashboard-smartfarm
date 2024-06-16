import { PartialType } from '@nestjs/swagger';
import { CreateManagementControllerDto } from './create-management-controller.dto';

export class UpdateManagementControllerDto extends PartialType(CreateManagementControllerDto) {}
