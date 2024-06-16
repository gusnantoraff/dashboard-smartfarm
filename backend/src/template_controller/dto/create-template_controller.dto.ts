import { IsNotEmpty, IsNumber, IsObject, IsString, IsUUID } from 'class-validator';

export class CreateTemplateDto {
  @IsUUID()
  @IsNotEmpty()
  cluster_id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  dap_count: number;

  @IsNotEmpty()
  @IsObject()
  config_ec_dap: any;

  @IsNotEmpty()
  is_active: boolean;

  dap_first_time: Date;
  temperature_water: number;
  humidity: number;
  ec: number;
  ph: number;
  water_flow: number;
  temperature_air: number;
  dap_num: number;
}
