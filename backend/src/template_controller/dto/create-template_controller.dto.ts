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

  temperature_water: number;
  humidity: number;
  ec: number;
  ph_up: number;
  ph_down: number;
  water_flow: number;
  temperature_air_min: number;
  temperature_air_max: number;
  dap_num: number;
  ph: number[];
  temperature_air: number[];
  ecData: any;
}
