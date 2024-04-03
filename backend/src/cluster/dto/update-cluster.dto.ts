import { PartialType } from '@nestjs/mapped-types';
import { CreateClusterDto } from './create-cluster.dto';

export class UpdateClusterDto extends PartialType(CreateClusterDto) {}
