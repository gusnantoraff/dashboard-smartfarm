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
}
