import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigSensorDto } from './create-config-sensor.dto';

export class UpdateConfigSensorDto extends PartialType(CreateConfigSensorDto) {}
