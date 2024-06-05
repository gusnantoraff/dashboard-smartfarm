import { IsUUID, IsDateString, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateControllerSessionDto {
  @IsUUID()
  @IsNotEmpty()
  controller_id: string;

  @IsDateString()
  @IsNotEmpty()
  dap_first_date_time: Date;

  @IsDateString()
  @IsNotEmpty()
  dap_first_end_time: Date;

  @IsUUID()
  @IsNotEmpty()
  template_id: string;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Object)
  config_sensor: any; // Change `any` to a more specific type if possible
}
